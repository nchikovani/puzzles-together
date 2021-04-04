module.exports = (config) => {
  const tsRule = config.module.rules[1].oneOf[2];
  tsRule.include = undefined;
  tsRule.exclude = /node_modules/;

  return config;
};