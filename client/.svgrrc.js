module.exports = {
  template: require("./src/custom.template"),
  outDir: "./src/components/icons",
  typescript: true,
  svgProps: {
    width: "{props.width || '100%'}",
    height: "{props.height || '100%'}"
  },
  jsxRuntime: "automatic",
  index: false,
  ignoreExisting: true
};
