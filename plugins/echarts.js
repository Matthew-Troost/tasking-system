import Vue from "vue"
import ECharts from "vue-echarts"

// import ECharts modules manually to reduce bundle size
import "echarts/lib/chart/pie"
import "echarts/lib/component/tooltip"
import "echarts/lib/component/legend"
import "zrender/lib/svg/svg"

// register component to use
Vue.component("v-chart", ECharts)
