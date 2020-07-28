const withPrefresh = require("@prefresh/next");

module.exports = withPrefresh({
  experimental: {
    modern: true,
    polyfillsOptimization: true,
    redirects() {
      return [
        {
          source: "/manual.html",
          destination: "/manual",
          permanent: true,
        },
        {
          source: "/benchmarks.html",
          destination: "/benchmarks",
          permanent: true,
        },
        {
          source: "/typedoc",
          destination:
            "https://doc.deno.land/https/github.com/denoland/deno/releases/latest/download/lib.deno.d.ts",
          permanent: true,
        },
        {
          source: "/typedoc/index.html",
          destination:
            "https://doc.deno.land/https/github.com/denoland/deno/releases/latest/download/lib.deno.d.ts",
          permanent: true,
        },
      ];
    },
  },
  webpack(config, { dev, isServer }) {
    const splitChunks = config.optimization && config.optimization.splitChunks;
    if (splitChunks) {
      const cacheGroups = splitChunks.cacheGroups;
      const preactModules =
        /[\\/]node_modules[\\/](preact|preact-render-to-string|preact-context-provider)[\\/]/;
      if (cacheGroups.framework) {
        cacheGroups.preact = Object.assign({}, cacheGroups.framework, {
          test: preactModules,
        });
        cacheGroups.commons.name = "framework";
      } else {
        cacheGroups.preact = {
          name: "commons",
          chunks: "all",
          test: preactModules,
        };
      }
    }

    // inject Preact DevTools
    if (dev && !isServer) {
      const entry = config.entry;
      config.entry = () =>
        entry().then((entries) => {
          entries["main.js"] = ["preact/debug"].concat(
            entries["main.js"] || [],
          );
          return entries;
        });
    }

    return config;
  },
});
