<template>
  <div>
    <img :class="{ hide: hideElement }" src="@/assets/images/astronaut.gif" />
  </div>
</template>
<script>
export default {
  name: "Loading",
  data() {
    return {
      hideElement: true
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
<style scoped>
div {
  position: absolute;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 200px;
  height: 200px;
}
</style>
