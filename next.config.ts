import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Run @vscode/vscode-languagedetection natively in Node.js without bundling.
  // This prevents Turbopack/webpack from inlining the package and lets it use
  // the real filesystem paths (needed for loading model.json and the weights
  // binary via its internal fs calls).
  serverExternalPackages: ["@vscode/vscode-languagedetection"],

  turbopack: {
    rules: {
      // Turbopack doesn't know how to handle .LICENSE.txt files bundled inside
      // some npm packages (e.g. @vscode/vscode-languagedetection). Treat them
      // as empty raw assets so the build doesn't fail.
      "*.LICENSE.txt": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
