<template>
  <div>
    <h2 class="page-title">
      Settings
      <small>
        <nuxt-link :to="`/projects/${$route.params.type}`">{{
          linkToString($route.params.type)
        }}</nuxt-link>
        |
        <nuxt-link
          :to="`/projects/${$route.params.type}/${$route.params.project}`"
          >{{ linkToString($route.params.project) }}</nuxt-link
        >
        | Settings
      </small>
    </h2>
    <b-card>
      <h5>Associated Emails</h5>
    </b-card>
  </div>
</template>
<script>
import Util from "@/utils"
export default {
  methods: {
    linkToString: function(value) {
      return Util.linkToString(value)
    }
  }
}
</script>
