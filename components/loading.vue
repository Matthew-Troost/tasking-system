<template>
  <div :style="styles">
    <img :class="{ hide: hideElement }" src="@/assets/images/astronaut.gif" />
  </div>
</template>
<script>
export default {
  name: "Loading",
  props: {
    width: {
      type: Number,
      default: 200
    },
    position: {
      type: String,
      default: "absolute"
    }
  },
  data() {
    return {
      hideElement: true
    }
  },
  computed: {
    styles() {
      return {
        position: this.position,
        width: `${this.width}px`,
        height: `${this.width}px`,
        margin: "auto",
        top: "0",
        right: "0",
        bottom: "0",
        left: "0"
      }
    }
  },
  mounted() {
    setTimeout(
      // eslint-disable-next-line no-unused-vars
      _ => (this.hideElement = false),
      500
    )
  }
}
</script>
