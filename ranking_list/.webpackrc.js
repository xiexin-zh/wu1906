const BASE_URL = "http://123.57.189.15";

const webpackConfig = {
  proxy: {
    "/api": {
      target: BASE_URL,
      changeOrigin: false,
    },
  },
  alias: {
    utils: `${__dirname}/src/utils`,
    components: `${__dirname}/src/components`,
    assets: `${__dirname}/src/assets`,
  },
};

export default webpackConfig;
