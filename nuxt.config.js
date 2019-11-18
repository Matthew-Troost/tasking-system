module.exports = {
  mode: "spa", //spa (single page application) is client-side rendered, universal is server-side
  /*
   ** Headers of the page
   */
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
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#2f495e" },
  /*
   ** Global CSS
   */
  css: ["@/assets/styles/custom.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "@plugins/global.js",
    "@plugins/authentication.js",
    "@plugins/snapshotsubscriptions.js",
    "@plugins/echarts.js",
    "@plugins/bugsnag.js"
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
