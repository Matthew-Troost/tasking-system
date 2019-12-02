<template>
  <div>
    <h2 class="page-title">
      Project Settings
      <small>
        <nuxt-link :to="`/projects/${$route.params.type}`">
          {{ linkToString($route.params.type) }} </nuxt-link
        >|
        <nuxt-link
          :to="`/projects/${$route.params.type}/${$route.params.project}`"
          >{{ linkToString($route.params.project) }}</nuxt-link
        >
        | Settings
      </small>
    </h2>
    <b-card>
      <h5>Associated Emails</h5>
      <VueTagsInput
        v-model="associatedEmails.tag"
        :tags="associatedEmails.tags"
        :validation="associatedEmails.validation"
        class="tag-form"
        @tags-changed="newTags => (associatedEmails.tags = newTags)"
      />
    </b-card>
  </div>
</template>
<script>
import Util from "@/utils"
import VueTagsInput from "@johmun/vue-tags-input"
// import { mapGetters } from "vuex"

export default {
  components: {
    VueTagsInput
  },
  data() {
    return {
      associatedEmails: {
        tags: [],
        tag: "",
        validation: [
          {
            classes: "invalid-email",
            rule: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          }
        ]
      }
    }
  },
  computed: {
    // project() {
    //   let selectedpoject = this.projects.find(project => {
    //     return project.name == Util.linkToString(this.$route.params.project)
    //   })
    //   if (!selectedpoject) {
    //     this.$toast.info("Project does not exist")
    //     return this.$router.back()
    //   }
    //   return selectedpoject
    // }
  },
  methods: {
    linkToString: function(value) {
      return Util.linkToString(value)
    }
  }
}
</script>
