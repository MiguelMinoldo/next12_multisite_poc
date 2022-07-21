const styleguidePlugin = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    i18n: {
      ...nextConfig.i18n,
      locales: ['en', 'en-GB'],
    },
  });
};

module.exports = styleguidePlugin;
