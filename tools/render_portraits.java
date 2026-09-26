import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

/**
 * Offline portrait renderer for CSRP -> Cobblemon species.
 *
 * Reads every Tabula model (*.tbl, a zip containing model.json) plus its entity texture and writes
 * a 256x256 transparent PNG portrait per species, together with the Cobblemon "resolver" JSON that
 * makes Cobblemon draw that PNG instead of the 3D model / Substitute doll.
 *
 * Usage:
 *   java -cp <gson.jar> tools/render_portraits.java <csrpAssetsDir> <outAssetsDir> [speciesMapJava]
 *
 *   <csrpAssetsDir>   .../src/main/resources/assets/csrp   (contains tabula/ and textures/entity/)
 *   <outAssetsDir>    .../src/main/resources/assets/csrpmon (textures/pokemon + bedrock/ are created)
 *   [speciesMapJava]  path to ParasiteSpeciesMap.java (default: src/main/java/alku/csrpmon/species/ParasiteSpeciesMap.java)
 */
public class render_portraits {

    // ---------------------------------------------------------------- config
    static final int OUT = 256;             // final PNG size
    static final int SS = 4;                // supersampling factor (render at OUT*SS, box-downsample)
    static final double FILL = 0.80;        // silhouette fills ~80% of the frame
    static final double GAMMA = 0.85;       // gentle lift so the very dark CSRP textures stay readable
    static final double YAW = Math.toRadians(-32.0);
    static final double PITCH = Math.toRadians(-12.0);
    static final String SPECIES_NS = "csrpmon";

    // directional light for flat shading (model space: +X right, +Y up, -Z front)
    static final double[] LIGHT = norm(new double[]{0.35, 0.82, -0.45});

    // diagnostics for the current model
    static int TEXW = 1, TEXH = 1, OOB = 0;
    static long SAMPLED = 0, TRANSPARENT = 0, LUM = 0;

    // ---------------------------------------------------------------- model data
    static class Node {
        String name = "";
        double w = 1, h = 1, d = 1;         // dimensions
        double px, py, pz;                  // position (pivot, relative to parent pivot)
        double ox, oy, oz;                  // offset (box min corner, relative to this pivot)
        double rx, ry, rz;                  // rotation, degrees
        double sx = 1, sy = 1, sz = 1;      // scale
        double u, v;                        // texture offset in pixels
        boolean mirror, hidden;
        double opacity = 100;
        List<Node> children = new ArrayList<>();
    }

    static class Face {
        boolean head;
        double[][] p = new double[4][3];    // world-space corners
        double[][] uv = new double[4][2];   // texture pixel coords of the corners
        double[] n = new double[3];         // world-space outward normal
        double shade = 1.0;
    }

    // ---------------------------------------------------------------- main
    public static void main(String[] args) throws Exception {
        if (args.length < 2) {
            System.err.println("usage: java -cp <gson.jar> tools/render_portraits.java <csrpAssetsDir> <outAssetsDir> [ParasiteSpeciesMap.java]");
            System.exit(2);
        }
        Path csrpAssets = Paths.get(args[0]).toAbsolutePath().normalize();
        Path outAssets = Paths.get(args[1]).toAbsolutePath().normalize();
        Path speciesMap = Paths.get(args.length > 2 ? args[2]
                : "src/main/java/alku/csrpmon/species/ParasiteSpeciesMap.java").toAbsolutePath().normalize();

        System.out.println("csrpAssets = " + csrpAssets);
        System.out.println("outAssets  = " + outAssets);
        System.out.println("speciesMap = " + speciesMap);

        List<String[]> entries = parseSpeciesMap(speciesMap);
        System.out.println("species entries: " + entries.size());

        Path tabulaDir = csrpAssets.resolve("tabula");
        Path entityDir = csrpAssets.resolve("textures/entity");
        Path pngDir = outAssets.resolve("textures/pokemon");
        Path resolverDir = outAssets.resolve("bedrock/pokemon/resolvers");
        Files.createDirectories(pngDir);
        Files.createDirectories(resolverDir);

        int ok = 0;
        List<String> problems = new ArrayList<>();
        for (String[] e : entries) {
            String csrpId = e[0], species = e[1];
            Path tbl = tabulaDir.resolve(csrpId + ".tbl");
            try {
                if (!Files.isRegularFile(tbl)) {
                    problems.add(species + ": missing model " + tbl);
                    continue;
                }
                String json = readZipEntry(tbl, "model.json");
                if (json == null) {
                    problems.add(species + ": no model.json inside " + tbl.getFileName());
                    continue;
                }
                JsonObject root = JsonParser.parseString(stripBom(json)).getAsJsonObject();
                List<Node> roots = new ArrayList<>();
                for (JsonElement ce : arr(root, "cubes")) roots.add(parseNode(ce.getAsJsonObject()));

                // ---- texture lookup
                Path tex = findTexture(entityDir, csrpId);
                if (tex == null) {
                    problems.add(species + ": no texture for " + csrpId + " in " + entityDir);
                    continue;
                }
                BufferedImage img = ImageIO.read(tex.toFile());
                if (img == null) {
                    problems.add(species + ": unreadable texture " + tex.getFileName());
                    continue;
                }

                Stats st = new Stats();
                TEXW = img.getWidth(); TEXH = img.getHeight();
                OOB = 0; SAMPLED = 0; TRANSPARENT = 0; LUM = 0;
                List<Face> faces = new ArrayList<>();
                for (Node r : roots) collect(r, IDENT, new double[]{0, 0, 0}, faces, st, false);

                if (faces.isEmpty()) {
                    problems.add(species + ": model has no visible faces");
                    continue;
                }

                BufferedImage out = render(faces, img, st);
                if (out == null) {
                    problems.add(species + ": nothing rasterised");
                    continue;
                }
                ImageIO.write(out, "PNG", pngDir.resolve(species + ".png").toFile());
                writeResolver(resolverDir.resolve(species + ".json"), species);

                System.out.printf(Locale.ROOT,
                        "OK  %-14s -> %-14s nodes=%-4d drawn=%-4d faces=%-4d tex=%s(%dx%d) spriteBBox=%.1fx%.1f%n",
                        csrpId, species, st.nodes, st.drawn, st.faces,
                        tex.getFileName(), img.getWidth(), img.getHeight(),
                        st.spriteMax[0] - st.spriteMin[0], st.spriteMax[1] - st.spriteMin[1]);
                System.out.printf(Locale.ROOT,
                        "      oobUVboxes=%d sampledTexels=%d transparentSamples=%.1f%% meanLum=%.1f%n",
                        OOB, SAMPLED, SAMPLED == 0 ? 0.0 : 100.0 * TRANSPARENT / SAMPLED,
                        SAMPLED - TRANSPARENT == 0 ? 0.0 : (double) LUM / (SAMPLED - TRANSPARENT));
                ok++;
            } catch (Exception ex) {
                problems.add(species + ": " + ex);
            }
        }

        System.out.println();
        System.out.println("portraits written: " + ok + " / " + entries.size());
        if (!problems.isEmpty()) {
            System.out.println("problems (" + problems.size() + "):");
            for (String p : problems) System.out.println("  - " + p);
        }
    }

    // ---------------------------------------------------------------- species map parsing
    static final Pattern ADD = Pattern.compile("add\\(\\s*\"([^\"]+)\"\\s*,\\s*\"([^\"]+)\"");

    static List<String[]> parseSpeciesMap(Path file) throws Exception {
        List<String[]> out = new ArrayList<>();
        Map<String, String> seen = new LinkedHashMap<>();
        for (String line : Files.readAllLines(file, StandardCharsets.UTF_8)) {
            String t = line.trim();
            if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) continue;
            Matcher m = ADD.matcher(line);
            if (m.find()) seen.put(m.group(1), m.group(2));
        }
        for (Map.Entry<String, String> e : seen.entrySet()) out.add(new String[]{e.getKey(), e.getValue()});
        return out;
    }

    // ---------------------------------------------------------------- json helpers
    static String stripBom(String s) {
        return s != null && !s.isEmpty() && s.charAt(0) == '\uFEFF' ? s.substring(1) : s;
    }

    static JsonArray arr(JsonObject o, String k) {
        JsonElement e = o.get(k);
        return e != null && e.isJsonArray() ? e.getAsJsonArray() : new JsonArray();
    }

    static double num(JsonObject o, String k, double def) {
        JsonElement e = o.get(k);
        return e != null && e.isJsonPrimitive() ? e.getAsDouble() : def;
    }

    static boolean bool(JsonObject o, String k, boolean def) {
        JsonElement e = o.get(k);
        return e != null && e.isJsonPrimitive() ? e.getAsBoolean() : def;
    }

    static String str(JsonObject o, String k) {
        JsonElement e = o.get(k);
        return e != null && e.isJsonPrimitive() ? e.getAsString() : null;
    }

    static double[] vec(JsonObject o, String k, double[] def) {
        JsonArray a = arr(o, k);
        if (a.size() < 3) return def;
        return new double[]{a.get(0).getAsDouble(), a.get(1).getAsDouble(), a.get(2).getAsDouble()};
    }

    static Node parseNode(JsonObject o) {
        Node n = new Node();
        String nm = str(o, "name");
        if (nm != null) n.name = nm;
        double[] dim = vec(o, "dimensions", new double[]{1, 1, 1});
        n.w = dim[0]; n.h = dim[1]; n.d = dim[2];
        double[] pos = vec(o, "position", new double[]{0, 0, 0});
        n.px = pos[0]; n.py = pos[1]; n.pz = pos[2];
        double[] off = vec(o, "offset", new double[]{0, 0, 0});
        n.ox = off[0]; n.oy = off[1]; n.oz = off[2];
        double[] rot = vec(o, "rotation", new double[]{0, 0, 0});
        n.rx = rot[0]; n.ry = rot[1]; n.rz = rot[2];
        double[] sc = vec(o, "scale", new double[]{1, 1, 1});
        n.sx = sc[0]; n.sy = sc[1]; n.sz = sc[2];
        JsonArray uv = arr(o, "txOffset");
        if (uv.size() >= 2) { n.u = uv.get(0).getAsDouble(); n.v = uv.get(1).getAsDouble(); }
        n.mirror = bool(o, "txMirror", false);
        n.hidden = bool(o, "hidden", false);
        n.opacity = num(o, "opacity", 100);
        for (JsonElement c : arr(o, "children")) n.children.add(parseNode(c.getAsJsonObject()));
        return n;
    }

    static String readZipEntry(Path zip, String entry) throws Exception {
        try (ZipFile zf = new ZipFile(zip.toFile())) {
            ZipEntry ze = zf.getEntry(entry);
            if (ze == null) {
                // tolerate a nested folder
                var en = zf.entries();
                while (en.hasMoreElements()) {
                    ZipEntry e = en.nextElement();
                    if (e.getName().endsWith("/" + entry) || e.getName().equals(entry)) { ze = e; break; }
                }
            }
            if (ze == null) return null;
            try (var in = zf.getInputStream(ze)) {
                return new String(in.readAllBytes(), StandardCharsets.UTF_8);
            }
        }
    }

    // ---------------------------------------------------------------- transform + geometry
    static final double[] IDENT = {1, 0, 0, 0, 1, 0, 0, 0, 1};

    static double[] matmul(double[] a, double[] b) {
        double[] r = new double[9];
        for (int i = 0; i < 3; i++)
            for (int j = 0; j < 3; j++)
                r[i * 3 + j] = a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j];
        return r;
    }

    static double[] apply(double[] m, double x, double y, double z) {
        return new double[]{
                m[0] * x + m[1] * y + m[2] * z,
                m[3] * x + m[4] * y + m[5] * z,
                m[6] * x + m[7] * y + m[8] * z};
    }

    static double[] norm(double[] v) {
        double l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        if (l < 1e-12) return new double[]{0, 0, 0};
        return new double[]{v[0] / l, v[1] / l, v[2] / l};
    }

    static double dot(double[] a, double[] b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }

    static class Stats {
        int nodes, drawn, faces;
        int oob;                 // boxes whose UV rect leaves the texture
        long sampled, transparent, lumSum;
        double[] spriteMin = {1e9, 1e9};
        double[] spriteMax = {-1e9, -1e9};
    }

    /** Recursively walks the Tabula tree, accumulating the affine transform. */
    static void collect(Node n, double[] Ap, double[] tp, List<Face> out, Stats st, boolean inHead) {
        boolean head = inHead || isHeadName(n.name);
        st.nodes++;
        // R = Rx(rx) * Ry(ry) * Rz(rz)   (vanilla: rotationZYX -> Z applied first)
        double cx = Math.cos(Math.toRadians(n.rx)), sx = Math.sin(Math.toRadians(n.rx));
        double cy = Math.cos(Math.toRadians(n.ry)), sy = Math.sin(Math.toRadians(n.ry));
        double cz = Math.cos(Math.toRadians(n.rz)), sz = Math.sin(Math.toRadians(n.rz));
        double[] Rx = {1, 0, 0, 0, cx, -sx, 0, sx, cx};
        double[] Ry = {cy, 0, sy, 0, 1, 0, -sy, 0, cy};
        double[] Rz = {cz, -sz, 0, sz, cz, 0, 0, 0, 1};
        double[] R = matmul(matmul(Rx, Ry), Rz);
        double[] S = {n.sx, 0, 0, 0, n.sy, 0, 0, 0, n.sz};
        double[] M = matmul(R, S);              // this node's local matrix (rotation * scale)
        double[] A = matmul(Ap, M);             // accumulated

        // t_child = Ap * position + tp
        double[] pv = apply(Ap, n.px, n.py, n.pz);
        double[] t = {pv[0] + tp[0], pv[1] + tp[1], pv[2] + tp[2]};

        if (!n.hidden && n.opacity > 0 && n.w > 0 && n.h > 0 && n.d > 0) {
            st.drawn++;
            emitBox(n, A, t, out, st, head);
        }
        for (Node c : n.children) collect(c, A, t, out, st, head);
    }

    /** Minecraft box-UV face table, taken from vanilla ModelPart.Cube (see report). */
    static void emitBox(Node n, double[] A, double[] t, List<Face> out, Stats st, boolean head) {
        double x0 = n.ox, y0 = n.oy, z0 = n.oz;
        double x1 = x0 + n.w, y1 = y0 + n.h, z1 = z0 + n.d;
        double u = n.u, v = n.v;
        double u0 = u, u1 = u + n.d, u2 = u + n.d + n.w, u22 = u + n.d + 2 * n.w,
                u3 = u + n.d + n.w + n.d, u4 = u + n.d + n.w + n.d + n.w;
        double v0 = v, v1 = v + n.d, v2 = v + n.d + n.h;

        if (u0 < 0 || v0 < 0 || u4 > TEXW || v2 > TEXH) OOB++;

        // {faceName, 4 local corners, 4 (u,v), outward local normal}
        Object[][] F = new Object[][]{
                {"down", new double[][]{{x1, y0, z1}, {x0, y0, z1}, {x0, y0, z0}, {x1, y0, z0}},
                        new double[][]{{u2, v0}, {u1, v0}, {u1, v1}, {u2, v1}}, new double[]{0, -1, 0}},
                {"up", new double[][]{{x1, y1, z0}, {x0, y1, z0}, {x0, y1, z1}, {x1, y1, z1}},
                        new double[][]{{u22, v1}, {u2, v1}, {u2, v0}, {u22, v0}}, new double[]{0, 1, 0}},
                {"west", new double[][]{{x0, y0, z0}, {x0, y0, z1}, {x0, y1, z1}, {x0, y1, z0}},
                        new double[][]{{u1, v1}, {u0, v1}, {u0, v2}, {u1, v2}}, new double[]{-1, 0, 0}},
                {"north", new double[][]{{x1, y0, z0}, {x0, y0, z0}, {x0, y1, z0}, {x1, y1, z0}},
                        new double[][]{{u2, v1}, {u1, v1}, {u1, v2}, {u2, v2}}, new double[]{0, 0, -1}},
                {"east", new double[][]{{x1, y0, z1}, {x1, y0, z0}, {x1, y1, z0}, {x1, y1, z1}},
                        new double[][]{{u3, v1}, {u2, v1}, {u2, v2}, {u3, v2}}, new double[]{1, 0, 0}},
                {"south", new double[][]{{x0, y0, z1}, {x1, y0, z1}, {x1, y1, z1}, {x0, y1, z1}},
                        new double[][]{{u4, v1}, {u3, v1}, {u3, v2}, {u4, v2}}, new double[]{0, 0, 1}},
        };

        for (Object[] f : F) {
            double[][] lc = (double[][]) f[1];
            double[][] luv = (double[][]) f[2];
            double[] ln = (double[]) f[3];
            Face face = new Face();
            face.head = head;
            for (int i = 0; i < 4; i++) {
                double[] w = apply(A, lc[i][0], lc[i][1], lc[i][2]);
                face.p[i][0] = w[0] + t[0];
                face.p[i][1] = w[1] + t[1];
                face.p[i][2] = w[2] + t[2];
                face.uv[i][0] = luv[i][0];
                face.uv[i][1] = luv[i][1];
            }
            if (n.mirror) {                       // vanilla mirrors the box on X, which flips u per face
                for (int i = 0; i < 4; i++) {
                    double c = (face.uv[0][0] + face.uv[1][0]) / 2.0;
                    face.uv[i][0] = 2 * c - face.uv[i][0];
                }
            }
            face.n = norm(apply(A, ln[0], ln[1], ln[2]));
            face.shade = 0.62 + 0.38 * Math.max(0, dot(face.n, LIGHT));
            out.add(face);
            st.faces++;
        }
    }

    // ---------------------------------------------------------------- camera
    static double[] view(double x, double y, double z) {
        double cy = Math.cos(YAW), sy = Math.sin(YAW);
        double x1 = x * cy + z * sy;
        double z1 = -x * sy + z * cy;
        double cp = Math.cos(PITCH), sp = Math.sin(PITCH);
        double y2 = y * cp - z1 * sp;
        double z2 = y * sp + z1 * cp;
        return new double[]{x1, y2, z2};
    }

    // ---------------------------------------------------------------- rasteriser
    /**
     * Renders twice: once to measure the real silhouette (so we can centre it exactly and make it
     * fill FILL of the frame), then once with the corrected framing.
     */
    static BufferedImage render(List<Face> faces, BufferedImage tex, Stats st) {
        int W = OUT * SS;
        // view-space + projected corners for every face
        int nf = faces.size();
        boolean anyHead = false;
        for (Face f : faces) if (f.head) anyHead = true;
        double[][][] sv = new double[nf][4][2];     // screen (supersampled) x/y
        double[][] dz = new double[nf][4];          // view depth per corner
        double[] min = {1e9, 1e9}, max = {-1e9, -1e9};
        for (int i = 0; i < nf; i++) {
            Face f = faces.get(i);
            for (int k = 0; k < 4; k++) {
                double[] vp = view(-f.p[k][0], -f.p[k][1], f.p[k][2]);
                sv[i][k][0] = vp[0];
                sv[i][k][1] = -vp[1];
                dz[i][k] = vp[2];
                min[0] = Math.min(min[0], sv[i][k][0]); max[0] = Math.max(max[0], sv[i][k][0]);
                min[1] = Math.min(min[1], sv[i][k][1]); max[1] = Math.max(max[1], sv[i][k][1]);
            }
        }
        double bw = Math.max(1e-6, max[0] - min[0]), bh = Math.max(1e-6, max[1] - min[1]);
        double cx = (min[0] + max[0]) / 2, cy = (min[1] + max[1]) / 2;
        double scale = FILL * W / Math.max(bw, bh);

        int[] px = new int[W * W];
        float[] pa = new float[W * W];
        float[] pz = new float[W * W];
        int[] bb = raster(faces, sv, dz, tex, W, cx, cy, scale, px, pa, pz);
        if (bb == null) return null;

        double mw = bb[2] - bb[0] + 1, mh = bb[3] - bb[1] + 1;
        double m = Math.max(mw, mh);
        double scale2 = scale * (FILL * W / m);
        // re-centre using the measured pixel centre mapped back into view space
        double mcx = (bb[0] + bb[2] + 1) / 2.0, mcy = (bb[1] + bb[3] + 1) / 2.0;
        cx += (mcx - W / 2.0) / scale;
        cy += (mcy - W / 2.0) / scale;

        Arrays.fill(px, 0);
        Arrays.fill(pa, 0f);
        bb = raster(faces, sv, dz, tex, W, cx, cy, scale2, px, pa, pz);

        st.spriteMin[0] = bb[0]; st.spriteMin[1] = bb[1];
        st.spriteMax[0] = bb[2]; st.spriteMax[1] = bb[3];

        // box-downsample with alpha-weighted averaging
        BufferedImage out = new BufferedImage(OUT, OUT, BufferedImage.TYPE_INT_ARGB);
        for (int y = 0; y < OUT; y++) {
            for (int x = 0; x < OUT; x++) {
                double sa = 0, sr = 0, sg = 0, sb = 0;
                for (int dy = 0; dy < SS; dy++) {
                    for (int dx = 0; dx < SS; dx++) {
                        int idx = (y * SS + dy) * W + (x * SS + dx);
                        float a = pa[idx];
                        if (a <= 0) continue;
                        int c = px[idx];
                        sa += a;
                        sr += ((c >> 16) & 0xFF) * a;
                        sg += ((c >> 8) & 0xFF) * a;
                        sb += (c & 0xFF) * a;
                    }
                }
                if (sa <= 1e-6) continue;
                int a = (int) Math.round(Math.min(1.0, sa / (SS * SS)) * 255);
                int r = gamma(sr / sa), g = gamma(sg / sa), b = gamma(sb / sa);
                out.setRGB(x, y, (a << 24) | (clamp(r) << 16) | (clamp(g) << 8) | clamp(b));
            }
        }
        // Zoom to the face: framing the head reads far better than fitting the whole body.
        // Creatures with no head bone fall back to their upper body.
        java.util.List<Face> headFaces = new java.util.ArrayList<>();
        for (Face f : faces) if (f.head) headFaces.add(f);
        boolean hasHead = !headFaces.isEmpty();
        int[] focus = null;
        if (hasHead) {
            int hn = headFaces.size();
            double[][][] hsv = new double[hn][4][2];
            double[][] hdz = new double[hn][4];
            for (int i = 0; i < hn; i++) {
                Face hf = headFaces.get(i);
                for (int k = 0; k < 4; k++) {
                    double[] vp = view(-hf.p[k][0], -hf.p[k][1], hf.p[k][2]);
                    hsv[i][k][0] = vp[0];
                    hsv[i][k][1] = -vp[1];
                    hdz[i][k] = vp[2];
                }
            }
            int[] hpx = new int[W * W];
            float[] hpa = new float[W * W];
            float[] hpz = new float[W * W];
            focus = raster(headFaces, hsv, hdz, tex, W, cx, cy, scale2, hpx, hpa, hpz);
        }
        if (focus == null && bb != null) {
            focus = new int[]{bb[0], bb[1], bb[2], bb[1] + Math.max(1, (bb[3] - bb[1]) * 55 / 100)};
        }
        if (focus != null) {
            double fs = Math.max(focus[2] - focus[0], focus[3] - focus[1]) / (double) SS;
            double topH = (focus[3] - focus[1]) / (double) SS;
            double side = hasHead ? Math.min(OUT, Math.max(fs * 2.0, OUT * 0.36))
                                  : Math.min(OUT, Math.max(topH * 1.35, OUT * 0.74));
            int sz = (int) Math.round(side);
            double fcx = (focus[0] + focus[2]) / 2.0 / SS;
            double fcy = (focus[1] + focus[3]) / 2.0 / SS;
            int x0 = (int) Math.round(fcx - sz / 2.0);
            int y0 = (int) Math.round(fcy - sz / 2.0);
            x0 = Math.max(0, Math.min(OUT - sz, x0));
            y0 = Math.max(0, Math.min(OUT - sz, y0));
            if (sz > 16 && sz < OUT) {
                BufferedImage zoomed = new BufferedImage(OUT, OUT, BufferedImage.TYPE_INT_ARGB);
                java.awt.Graphics2D g2 = zoomed.createGraphics();
                g2.setRenderingHint(java.awt.RenderingHints.KEY_INTERPOLATION,
                        java.awt.RenderingHints.VALUE_INTERPOLATION_BILINEAR);
                g2.drawImage(out.getSubimage(x0, y0, sz, sz), 0, 0, OUT, OUT, null);
                g2.dispose();
                return zoomed;
            }
        }
        return out;
    }

    /** Bones that read as a creature head, so the portrait can zoom to the face. */
    static boolean isHeadName(String name) {
        String n = name.toLowerCase();
        return n.startsWith("head") || n.startsWith("skull") || n.startsWith("face")
                || n.equals("bodyj") || n.equals("bodyt");
    }

    static int clamp(int v) { return v < 0 ? 0 : v > 255 ? 255 : v; }

    static int gamma(double c) {
        return clamp((int) Math.round(255.0 * Math.pow(Math.max(0, Math.min(255, c)) / 255.0, GAMMA)));
    }

    static int[] raster(List<Face> faces, double[][][] sv, double[][] dz, BufferedImage tex,
                        int W, double cx, double cy, double scale,
                        int[] px, float[] pa, float[] pz) {
        int tw = tex.getWidth(), th = tex.getHeight();
        Arrays.fill(pz, Float.MAX_VALUE);
        int bb0 = Integer.MAX_VALUE, bb1 = Integer.MAX_VALUE, bb2 = Integer.MIN_VALUE, bb3 = Integer.MIN_VALUE;

        // painter-friendly: far faces first (the z-buffer does the real work, this just keeps ties sane)
        Integer[] order = new Integer[faces.size()];
        for (int i = 0; i < order.length; i++) order[i] = i;
        final double[] fz = new double[faces.size()];
        for (int i = 0; i < faces.size(); i++) {
            double s = 0;
            for (int k = 0; k < 4; k++) s += dz[i][k];
            fz[i] = s / 4;
        }
        Arrays.sort(order, (a, b) -> Double.compare(fz[b], fz[a]));

        double[][] sp = new double[4][2];
        for (int oi : order) {
            Face f = faces.get(oi);
            for (int k = 0; k < 4; k++) {
                sp[k][0] = (sv[oi][k][0] - cx) * scale + W / 2.0;
                sp[k][1] = (sv[oi][k][1] - cy) * scale + W / 2.0;
            }
            // back-face culling in view space: the camera looks along +z
            double nz = view(-f.n[0], -f.n[1], f.n[2])[2];
            if (nz > -1e-6) continue;

            double ex = sp[1][0] - sp[0][0], ey = sp[1][1] - sp[0][1];
            double fx = sp[3][0] - sp[0][0], fy = sp[3][1] - sp[0][1];
            double det = ex * fy - ey * fx;
            if (Math.abs(det) < 1e-9) continue;
            double inv = 1.0 / det;

            int x0 = (int) Math.floor(Math.min(Math.min(sp[0][0], sp[1][0]), Math.min(sp[2][0], sp[3][0])));
            int x1 = (int) Math.ceil(Math.max(Math.max(sp[0][0], sp[1][0]), Math.max(sp[2][0], sp[3][0])));
            int y0 = (int) Math.floor(Math.min(Math.min(sp[0][1], sp[1][1]), Math.min(sp[2][1], sp[3][1])));
            int y1 = (int) Math.ceil(Math.max(Math.max(sp[0][1], sp[1][1]), Math.max(sp[2][1], sp[3][1])));
            x0 = Math.max(x0, 0); y0 = Math.max(y0, 0);
            x1 = Math.min(x1, W - 1); y1 = Math.min(y1, W - 1);

            for (int yy = y0; yy <= y1; yy++) {
                double dy = yy + 0.5 - sp[0][1];
                for (int xx = x0; xx <= x1; xx++) {
                    double dx = xx + 0.5 - sp[0][0];
                    double s = (dx * fy - dy * fx) * inv;
                    double t = (-dx * ey + dy * ex) * inv;
                    if (s < -1e-6 || s > 1 + 1e-6 || t < -1e-6 || t > 1 + 1e-6) continue;
                    double z = dz[oi][0] + s * (dz[oi][1] - dz[oi][0]) + t * (dz[oi][3] - dz[oi][0]);
                    int idx = yy * W + xx;
                    if (z >= pz[idx]) continue;

                    double su = s;
                    double uu = f.uv[0][0] + su * (f.uv[1][0] - f.uv[0][0]) + t * (f.uv[3][0] - f.uv[0][0]);
                    double vv = f.uv[0][1] + su * (f.uv[1][1] - f.uv[0][1]) + t * (f.uv[3][1] - f.uv[0][1]);
                    int tu = (int) Math.floor(uu), tv = (int) Math.floor(vv);
                    if (tu < 0) tu = 0; if (tu >= tw) tu = tw - 1;
                    if (tv < 0) tv = 0; if (tv >= th) tv = th - 1;
                    int argb = tex.getRGB(tu, tv);
                    int a = (argb >>> 24);
                    SAMPLED++;
                    if (a == 0) { TRANSPARENT++; continue; }
                    LUM += (int) (0.299 * (argb >> 16 & 0xFF) + 0.587 * (argb >> 8 & 0xFF) + 0.114 * (argb & 0xFF));
                    double sh = f.shade;
                    int r = clamp((int) ((argb >> 16 & 0xFF) * sh));
                    int g = clamp((int) ((argb >> 8 & 0xFF) * sh));
                    int b = clamp((int) ((argb & 0xFF) * sh));
                    px[idx] = (r << 16) | (g << 8) | b;
                    pa[idx] = (float) (a / 255.0);
                    pz[idx] = (float) z;
                    if (xx < bb0) bb0 = xx; if (xx > bb2) bb2 = xx;
                    if (yy < bb1) bb1 = yy; if (yy > bb3) bb3 = yy;
                }
            }
        }
        if (bb2 < bb0) return null;
        return new int[]{bb0, bb1, bb2, bb3};
    }

    // ---------------------------------------------------------------- outputs
    static void writeResolver(Path file, String species) throws Exception {
        String sprite = SPECIES_NS + ":textures/pokemon/" + species + ".png";
        String json = "{\n"
                + "  \"order\": 0,\n"
                + "  \"species\": \"" + SPECIES_NS + ":" + species + "\",\n"
                + "  \"variations\": [\n"
                + "    {\n"
                + "      \"aspects\": [],\n"
                + "      \"sprites\": {\n"
                + "        \"portrait\": \"" + sprite + "\",\n"
                + "        \"profile\": \"" + sprite + "\"\n"
                + "      }\n"
                + "    }\n"
                + "  ]\n"
                + "}\n";
        Files.write(file, json.getBytes(StandardCharsets.UTF_8));
    }

    static Path findTexture(Path dir, String id) throws Exception {
        Path exact = dir.resolve(id + ".png");
        if (Files.isRegularFile(exact)) return exact;
        List<String> cands = new ArrayList<>();
        try (var s = Files.list(dir)) {
            s.filter(p -> p.getFileName().toString().toLowerCase(Locale.ROOT).endsWith(".png"))
                    .forEach(p -> cands.add(p.getFileName().toString()));
        }
        cands.sort(String::compareTo);
        String best = null; int bestScore = Integer.MAX_VALUE;
        for (String c : cands) {
            String base = c.substring(0, c.length() - 4).toLowerCase(Locale.ROOT);
            String low = id.toLowerCase(Locale.ROOT);
            int score;
            if (base.startsWith(low)) score = base.length() - low.length();
            else if (base.contains(low)) score = 100 + base.indexOf(low);
            else score = 1000 + levenshtein(base, low);
            if (score < bestScore) { bestScore = score; best = c; }
        }
        if (best == null || bestScore > 1000 + Math.max(4, id.length())) return null;
        System.out.println("  ! texture fallback for '" + id + "' -> " + best);
        return dir.resolve(best);
    }

    static int levenshtein(String a, String b) {
        int[] prev = new int[b.length() + 1], cur = new int[b.length() + 1];
        for (int j = 0; j <= b.length(); j++) prev[j] = j;
        for (int i = 1; i <= a.length(); i++) {
            cur[0] = i;
            for (int j = 1; j <= b.length(); j++) {
                int cost = a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1;
                cur[j] = Math.min(Math.min(cur[j - 1] + 1, prev[j] + 1), prev[j - 1] + cost);
            }
            int[] tmp = prev; prev = cur; cur = tmp;
        }
        return prev[b.length()];
    }
}
