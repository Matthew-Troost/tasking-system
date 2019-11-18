import Vue from "vue"
import bugsnag from "@bugsnag/js"
import bugsnagVue from "@bugsnag/plugin-vue"

const bugsnagClient = bugsnag("0cc7797bde148de26b6bb54bfd4f1f18")
bugsnagClient.use(bugsnagVue, Vue)
