import Vue from "vue"

//------------ PACKAGE DECLARATIONS
import "gin-blocks"
import { library } from "@fortawesome/fontawesome-svg-core"
import { faUserSecret } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

// ------------ STYLES
import "../assets/styles/custom.css"

// ------------ COMPONENTS
import SidebarPlugin from "../components/SidebarPlugin/index"

library.add(faUserSecret)
Vue.component("font-awesome-icon", FontAwesomeIcon)
Vue.use(SidebarPlugin)
