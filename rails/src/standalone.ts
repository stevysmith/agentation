/**
 * Agentation Standalone Entry Point
 *
 * Bundles React + Agentation into a single self-executing script.
 * Used by the agentation-rails gem — Rails developers never see React.
 */
import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { PageFeedbackToolbarCSS } from "agentation";

let root: Root | null = null;
let container: HTMLElement | null = null;

function getConfig(): Record<string, string> {
  const config: Record<string, string> = {};
  const el = document.getElementById("agentation-config");
  if (el) {
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith("data-")) {
        const key = attr.name
          .slice(5)
          .replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        config[key] = attr.value;
      }
    }
  }
  return config;
}

function mount() {
  if (container) return;

  const config = getConfig();

  container = document.createElement("div");
  container.id = "agentation-root";
  document.body.appendChild(container);

  root = createRoot(container);
  root.render(
    React.createElement(PageFeedbackToolbarCSS, {
      endpoint: config.endpoint || undefined,
      sessionId: config.sessionId || undefined,
      webhookUrl: config.webhookUrl || undefined,
    })
  );
}

function unmount() {
  if (root) {
    root.unmount();
    root = null;
  }
  if (container) {
    container.remove();
    container = null;
  }
}

// Auto-mount on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}

// Clean up before Turbo caches the page
document.addEventListener("turbo:before-cache", unmount);

// Re-mount on Turbo navigation
document.addEventListener("turbo:load", mount);

// Expose for manual control if needed
(window as any).__agentation = { mount, unmount };
