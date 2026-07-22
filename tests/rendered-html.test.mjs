import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("app stays focused on the resume studio", async () => {
  const [page, builder, layout, packageJson, previewFiles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ResumeBuilder.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readdir(new URL("../app/_sites-preview/", import.meta.url)),
  ]);

  assert.deepEqual(previewFiles, []);
  assert.match(page, /<ResumeBuilder \/>/);
  assert.match(builder, /type ExperienceType = "employment" \| "project" \| "training" \| "break"/);
  assert.match(builder, /JSON exportieren/);
  assert.match(builder, /JSON importieren/);
  assert.match(builder, /normalizeExperience/);
  assert.match(layout, /title:\s*"Vita – Lebenslauf Studio"/);
  assert.doesNotMatch(packageJson, /wrangler|cloudflare/i);
  assert.doesNotMatch(page + layout, /codex-preview|SkeletonPreview/i);
});
