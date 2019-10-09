import Vue from "vue"

//------------ PACKAGE DECLARATIONS
//import "gin-blocks"
import themeKit from "./theme-kit"
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
Vue.component("font-awesome-icon", FontAwesomeIcon)

Vue.use(themeKit)
