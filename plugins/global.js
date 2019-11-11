import Vue from "vue"

//------------ PACKAGE DECLARATIONS
import themeKit from "./theme-kit"
import Dialog from "vue-dialog-loading"
import { library } from "@fortawesome/fontawesome-svg-core"
import {
  faChartLine,
  faHandPeace,
  faCode
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

// ------------ STYLES
import "../assets/styles/custom.css"

// ------------ COMPONENTS
library.add(faChartLine, faHandPeace, faCode)
import Loading from "../components/loading.vue"
import VCalendar from "v-calendar"
Vue.use(VCalendar)

Vue.component("font-awesome-icon", FontAwesomeIcon)
Vue.component("loading", Loading)
Vue.use(themeKit)
Vue.use(Dialog)
