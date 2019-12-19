<template>
  <ContentLoader
    :height="300"
    :width="826"
    :speed="2"
    primary-color="#f3f3f3"
    secondary-color="#ecebeb"
    preserve-aspect-ratio="xMidYMin meet"
  >
    <rect x="6" y="7" rx="4" ry="4" width="216" height="52.65" />
    <rect x="235.69" y="6" rx="5" ry="5" width="580" height="400" />
    <rect x="6" y="67" rx="4" ry="4" width="216" height="52.65" />
    <rect x="5" y="127" rx="4" ry="4" width="216" height="205.79" />
  </ContentLoader>
</template>

<script>
import { ContentLoader } from "vue-content-loader"

export default {
  components: {
    ContentLoader
  }
}
</script>
