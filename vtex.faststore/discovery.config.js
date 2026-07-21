
module.exports = {
  seo: {
  "title": "FastStore",
  "description": "A fast and performant store framework",
  "titleTemplate": "%s | FastStore",
  "author": "FastStore"
},

  // Theming
  theme: 'custom-theme',

  // Ecommerce Platform
  platform: 'vtex',

  // Platform specific configs for API
  api: {
    storeId: process.env.ACCOUNT_NAME,
    workspace: process.env.WORKSPACE,
    environment: 'vtexcommercestable',
    hideUnavailableItems: true,
    incrementAddress: false,
  },

  // Default session
  session: {
    currency: {
      code: "BRL",
      symbol: "R$",
    },
    locale: "pt-BR",
    channel: '{"salesChannel":1,"regionId":""}',
    country: "BRA",
    deliveryMode: null,
    addressType: null,
    postalCode: null,
    geoCoordinates: null,
    person: null,
  },

  cart: {
    id: '',
    items: [],
    messages: [],
    shouldSplitItem: true,
  },

  // Production URLs
  storeUrl: `https://${process.env.ACCOUNT_NAME}.vtex.app`,
  secureSubdomain: "https://secure.vtexfaststore.com/",
  checkoutUrl: "https://secure.vtexfaststore.com/checkout",
  loginUrl: "https://secure.vtexfaststore.com/api/io/login",
  accountUrl: "https://secure.vtexfaststore.com/api/io/account",

  previewRedirects: {
    home: '/',
    plp: "/tr%C3%A4persienn",
    search: "/s?q=Test%20Brand%20name",
    pdp: "/jaqueta_leve_de_nylon-preta/p",
  },

  // Lighthouse CI
  lighthouse: {
    server: process.env.BASE_SITE_URL || 'http://localhost:3000',
    pages: {
      home: '/',
      pdp: "/jaqueta_leve_de_nylon-preta/p",
      collection: "/tr%C3%A4persienn",
    },
  },

  // E2E CI
  cypress: {
    pages: {
      home: '/',
      pdp: "/jaqueta_leve_de_nylon-preta/p",
      collection: "/tr%C3%A4persienn",
      collection_filtered: "/tr%C3%A4persienn/?category-1=tr%C3%A4persienn&brand=Test%20Brand%20name&facets=category-1%2Cbrand%27",
      search: "/s?q=Test%20Brand%20name",
    },
    browser: 'electron',
  },

  analytics: {
    // https://developers.google.com/tag-platform/tag-manager/web#standard_web_page_installation,
    gtmContainerId: "GTM-1234567",
  },

  experimental: {
    nodeVersion: 24,
    cypressVersion: 12,
  },

  vtexHeadlessCms: {
    webhookUrls: [
      `https://${process.env.ACCOUNT_NAME}.myvtex.com/cms-releases/webhook-releases`,
    ],
  },
}
