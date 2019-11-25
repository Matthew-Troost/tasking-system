import Vue from "vue"

//------------ PACKAGE DECLARATIONS
import themeKit from "./theme-kit"
import Dialog from "vue-dialog-loading"
import { library } from "@fortawesome/fontawesome-svg-core"
import VueTagsInput from "@johmun/vue-tags-input"
import VueLazyload from "vue-lazyload"
import VueLodash from "vue-lodash"

import {
  faChartLine,
  faHandPeace,
  faCode
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import * as Slack from "@/services/slack/slack"
import axios from "axios"
import VueAxios from "vue-axios"

// ------------ STYLES
import "../assets/styles/custom.css"
import VueMoment from "vue-moment"

// ------------ COMPONENTS
library.add(faChartLine, faHandPeace, faCode)
import Loading from "../components/loading.vue"
import VCalendar from "v-calendar"
Vue.use(VCalendar)

Vue.component("font-awesome-icon", FontAwesomeIcon)
Vue.component("loading", Loading)
Vue.use(themeKit)
Vue.use(Slack)
Vue.use(Dialog)
Vue.use(VueAxios, axios)
Vue.prototype.$slack = Slack
Vue.use(VueTagsInput)
Vue.use(VueLazyload, {
  loading: "/_nuxt/assets/images/astronaut.gif"
})
Vue.use(VueMoment)
Vue.use(VueLodash, { name: "lodash" })
