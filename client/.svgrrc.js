module.exports = {
  template: require("./src/custom.template"),
  outDir: "./src/components/icons",
  typescript: true,
  svgProps: {
    height: "{props.height || '100%'}",
    preserveAspectRatio: "true"
  },
  jsxRuntime: "automatic",
  index: false,
  ignoreExisting: true,
  dimensions: false
};
