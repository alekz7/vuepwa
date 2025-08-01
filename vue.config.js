const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  publicPath: "/vuepwa/",
  // base: "/vuepwa/", The issue is that you're using base which is a Vite configuration option, but you're using Vue CLI (vue-cli-service). In Vue CLI, the equivalent option is publicPath.
  transpileDependencies: true,
});
