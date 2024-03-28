const template = ({ componentName, imports, interfaces, props, jsx }, { tpl }) => {
  const newLine = "\n";
  const componentNameSliced = componentName.startsWith("Svg")
    ? componentName.slice(3)
    : componentName;
  return tpl`
${imports};

${interfaces};

${newLine}
export default function ${componentNameSliced}(${props}) {
  return (
    ${jsx}
  )
};
`;
};

module.exports = template;
