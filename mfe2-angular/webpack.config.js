const {
  shareAll,
  withModuleFederationPlugin,
} = require('@angular-architects/module-federation/webpack');

const config = withModuleFederationPlugin({
  name: 'mfe2_angular',

  exposes: {
    './mount': './src/app/mount.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});

config.output = {
  ...config.output,
  publicPath: '/',
};

module.exports = config;
