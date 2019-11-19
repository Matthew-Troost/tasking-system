<template>
  <v-chart
    :options="pie_chart.options"
    :init-options="pie_chart.initOptions"
    @legendselectchanged="legendSelectChanged"
  />
</template>
<script>
export default {
  props: {
    composition: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      pie_chart: {
        initOptions: {
          renderer: "svg"
        },
        options: {
          color: ["#91c7ae", "#c23531", "#2f4554", "#61a0a8", "#d48265"],
          grid: {
            top: 10
          },
          tooltip: {
            show: true,
            backgroundColor: "rgba(0, 0, 0, .8)"
          },
          legend: {
            show: true,
            orient: "horizontal"
          },
          series: [
            {
              name: "Project Composition",
              type: "pie",
              radius: "55%",
              center: ["50%", "50%"],
              label: {
                show: false
              },
              data: this.composition,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        }
      }
    }
  },
  computed: {},
  methods: {
    legendSelectChanged(event) {
      this.$emit("legendSelectChanged", event.selected)
    }
  }
}
</script>
