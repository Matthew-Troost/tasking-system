import BootstrapVue from "bootstrap-vue"
import "@/assets/styles/lite-blue.min.css"

export default {
  install(Vue) {
    Vue.use(BootstrapVue)
    Vue.component("vue-perfect-scrollbar", () =>
      import("vue-perfect-scrollbar")
    )
  }
}
