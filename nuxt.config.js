module.exports = {
  mode: "spa", //spa (single page application) is client-side rendered, universal is server-side
  /*
   ** Headers of the page
   */
  env: {
    //Moved to package.json file
    DEVELOPMENT: process.env.NODE_ENV !== "production", //switch this to false before deploying
    SLACK_OAUTH:
      "xoxp-5039254558-11063984753-849564116853-4a335ff20261c511e810a29c3d7f6f5f",
    SLACK_BOT_OAUTH: "xoxb-5039254558-849096412500-ZaFeCzf2DzceiwIm6hRyuLbm",
    BUGSNAG_TOKEN: "0cc7797bde148de26b6bb54bfd4f1f18"
  },
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/new-favicon.png" }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#2f495e" },
  /*
   ** Global CSS
   */
  css: ["@/assets/styles/custom.css", "@/assets/styles/flickity/custom.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "@plugins/global.js",
    "@plugins/authentication.js",
    "@plugins/snapshotsubscriptions.js",
    "@plugins/echarts.js",
    process.env.DEVELOPMENT ? "" : "@plugins/bugsnag.js"
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    "@nuxtjs/toast",
    "@nuxtjs/auth",
    "@nuxtjs/axios",
    [
      "nuxt-fontawesome",
      {
        imports: [
          {
            set: "@fortawesome/free-solid-svg-icons",
            icons: ["fas"]
          },
          {
            set: "@fortawesome/free-brands-svg-icons",
            icons: ["fab"]
          }
        ]
      }
    ]
  ],

  axios: {
    // proxyHeaders: false
  },

  //Notifications
  toast: {
    theme: "bubble",
    position: "top-left",
    duration: 5000
  },

  router: {
    middleware: ["authenticationguard"],
    linkActiveClass: "open"
  },
  /*
   ** Build configuration
   */
  build: {
    transpile: ["vue-echarts", "resize-detector"],
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        })
      }
      //chrome debugging
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? "eval-source-map" : "inline-source-map"
      }
    }
  }
}
