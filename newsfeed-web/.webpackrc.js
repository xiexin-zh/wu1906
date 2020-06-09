const APP_VERSION = process.env.npm_package_version;

const CLIENT_ID = process.env.npm_package_config_clientId;

// const BASE_URL = 'http://uat-sunpeopleprx-2.scgdomain.com'; // UAT
// const NEW_BASE_URL = 'https://uat-sunpeopleprx-2.scgdomain.com';


const BASE_URL = 'https://sp-api.i-mocca.com'; // QA
const NEW_BASE_URL = 'https://sp-api.i-mocca.com';


const webpackConfig = {
  proxy: {
    '/usercenter': {
      target: BASE_URL,
      changeOrigin: true,
    },
    '/api': {
      target: BASE_URL,
      changeOrigin: true,
    },
    '/sunpeople': {
      target: BASE_URL,
      changeOrigin: true,
    },
    '/cdn': {
      target: BASE_URL,
      changeOrigin: true,
    },
    '/s3': {
      target: BASE_URL,
      changeOrigin: true,
    },
    '/download': {
      target: BASE_URL,
      changeOrigin: true,
    },
    '/nf_api': {
      target: BASE_URL,
      changeOrigin: true,
    },

    '/fs': {
      target: NEW_BASE_URL,
      changeOrigin: true,
    },
  },
  alias: {
    utils: `${__dirname}/src/utils`,
    components: `${__dirname}/src/components`,
    assets: `${__dirname}/src/assets`,
  },
  hash: true,

  html: {
    template: './src/index.ejs',
  },
  define: {
    APP_VERSION,
    CLIENT_ID,
  },
  env: {
    development: {
      publicPath: '/',
    },
    production: {
      publicPath: '/newsfeed_web/',
    },
  },
};

export default webpackConfig;
