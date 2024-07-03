module.exports = {
  template: require("./src/custom.template"),
  outDir: "./src/components/icons",
  typescript: true,
  svgProps: {
    height: "{props.height || '100%'}"
  },
  jsxRuntime: "automatic",
  index: false,
  ignoreExisting: true,
  dimensions: false
};
