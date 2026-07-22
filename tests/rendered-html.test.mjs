import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the resume studio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="de">/i);
  assert.match(html, /<title>Vita – Lebenslauf Studio<\/title>/i);
  assert.match(html, /Inhalt bearbeiten/);
  assert.match(html, /Als PDF exportieren/);
  assert.match(html, /Bewerbungsfoto/);
  assert.match(html, /type="file"/);
  assert.match(html, /Design/);
  assert.match(html, /Spalten tauschen/);
  assert.match(html, /Software Engineer mit Erfahrung/);
  assert.match(html, /Lebenslauf-Vorschau/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("starter preview was removed from the finished app", async () => {
  const [page, layout, packageJson, previewFiles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readdir(new URL("../app/_sites-preview/", import.meta.url)),
  ]);

  assert.deepEqual(previewFiles, []);
  assert.match(page, /<ResumeBuilder \/>/);
  assert.match(layout, /title:\s*"Vita – Lebenslauf Studio"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page + layout, /codex-preview|SkeletonPreview/);
});
