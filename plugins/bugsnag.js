import Vue from "vue"
import bugsnag from "@bugsnag/js"
import bugsnagVue from "@bugsnag/plugin-vue"

if (!process.env.DEVELOPMENT) {
  const bugsnagClient = bugsnag(process.env.BUGSNAG_TOKEN)
  bugsnagClient.use(bugsnagVue, Vue)
}
