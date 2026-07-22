import type { Plugin } from "vite";

// No-op plugin placeholder for the Sites build hook.
export function sites(): Plugin {
  return {
    name: "sites",
    apply: "build",
  };
}
