<template>
  <ContentLoader
    :height="300"
    :width="826"
    :speed="2"
    primary-color="#f3f3f3"
    secondary-color="#ecebeb"
  >
    <rect x="0" y="2.67" rx="3" ry="3" width="46" height="36" />
    <rect x="55" y="2.67" rx="3" ry="3" width="46" height="36" />

    <rect x="30" y="64" rx="3" ry="3" width="189.77" height="14.30" />

    <circle cx="12" cy="70" r="8.15" />
    <circle cx="806.7" cy="70" r="8.15" />
    <circle cx="778.7" cy="70" r="8.15" />

    <rect x="0" y="86" rx="3" ry="3" width="812" height="32.2" />
    <rect x="0" y="122" rx="3" ry="3" width="812" height="32.2" />

    <!--  -->

    <rect x="30" y="200" rx="3" ry="3" width="189.77" height="14.30" />

    <circle cx="12" cy="206" r="8.15" />
    <circle cx="806.7" cy="206" r="8.15" />
    <circle cx="778.7" cy="206" r="8.15" />

    <rect x="0" y="220" rx="3" ry="3" width="812" height="32.2" />
    <rect x="0" y="256" rx="3" ry="3" width="812" height="32.2" />
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
