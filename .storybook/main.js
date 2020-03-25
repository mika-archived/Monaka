const path = require("path");

module.exports = {
  stories: ["../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-actions", "@storybook/addon-links"],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve("ts-loader"),
        },
      ],
    });

    config.resolve.extensions.push(".ts", ".tsx");
    config.resolve.alias = { "@": path.resolve(__dirname, "../src") };
    return config;
  },
};