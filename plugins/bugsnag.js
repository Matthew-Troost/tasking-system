import Vue from "vue"
import bugsnag from "@bugsnag/js"
import bugsnagVue from "@bugsnag/plugin-vue"

const bugsnagClient = bugsnag(process.env.BUGSNAG_TOKEN)
bugsnagClient.use(bugsnagVue, Vue)
