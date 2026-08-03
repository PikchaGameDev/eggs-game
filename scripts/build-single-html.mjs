import { build } from "vite";
import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const temporaryDirectory = path.join(projectRoot, ".standalone-build");
const outputFile = path.join(projectRoot, "eggs-game-standalone.html");

await rm(temporaryDirectory, { recursive: true, force: true });

await build({
  configFile: false,
  root: projectRoot,
  base: "./",
  build: {
    outDir: temporaryDirectory,
    emptyOutDir: true,
    cssCodeSplit: false,
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    rollupOptions: {
      input: path.join(projectRoot, "index.html"),
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});

const generatedIndexPath = path.join(temporaryDirectory, "index.html");
let html = await readFile(generatedIndexPath, "utf8");

const scriptTagPattern =
  /<script\s+type="module"[^>]*src="([^"]+)"[^>]*><\/script>/;
const styleTagPattern = /<link\s+rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/;
const scriptMatch = html.match(scriptTagPattern);
const styleMatch = html.match(styleTagPattern);

if (!scriptMatch) {
  throw new Error("Generated JavaScript bundle was not found");
}

const scriptPath = path.resolve(
  temporaryDirectory,
  scriptMatch[1].replace(/^\.\//, "")
);
const script = (await readFile(scriptPath, "utf8")).replace(
  /<\/script/gi,
  "<\\/script"
);

html = html.replace(
  scriptTagPattern,
  () => `<script type="module">${script}</script>`
);

if (styleMatch) {
  const stylePath = path.resolve(
    temporaryDirectory,
    styleMatch[1].replace(/^\.\//, "")
  );
  const style = await readFile(stylePath, "utf8");
  html = html.replace(styleTagPattern, () => `<style>${style}</style>`);
}

const remoteImagePattern = /<img\b[^>]*\bsrc="(https?:\/\/[^\"]+)"[^>]*>/gi;
const remoteImageUrls = [
  ...new Set(
    [...html.matchAll(remoteImagePattern)].map((match) => match[1])
  ),
];

for (const imageUrl of remoteImageUrls) {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to embed image ${imageUrl}: HTTP ${response.status}`
    );
  }

  const mimeType =
    response.headers.get("content-type")?.split(";")[0] ||
    "application/octet-stream";
  const imageBuffer = Buffer.from(await response.arrayBuffer());
  const dataUrl = `data:${mimeType};base64,${imageBuffer.toString("base64")}`;

  html = html.replaceAll(imageUrl, dataUrl);
}

await writeFile(outputFile, html, "utf8");
await rm(temporaryDirectory, { recursive: true, force: true });

console.log(`Standalone game created: ${outputFile}`);
