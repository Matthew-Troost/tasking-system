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
        :tags="associatedEmailTags"
        :validation="associatedEmails.validation"
        placeholder="Add an address"
        class="tag-form"
        @tags-changed="newTags => (associatedEmailTags = newTags)"
      />
      <b-button
        type="submit"
        class="save-btn f-r mt-15"
        variant="primary"
        @click="update"
        >Update</b-button
      >
    </b-card>
  </div>
</template>
<script>
import Util from "@/utils"
import VueTagsInput from "@johmun/vue-tags-input"
import { mapGetters } from "vuex"

export default {
  components: {
    VueTagsInput
  },
  data() {
    return {
      associatedEmails: {
        tag: "",
        tags: [],
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
    ...mapGetters({
      getProjectByName: "projects/getByName"
    }),
    project() {
      let selectedProject = this.getProjectByName(
        Util.linkToString(this.$route.params.project)
      )

      if (!selectedProject) {
        this.$toast.info("Project does not exist")
        return this.$router.back()
      }

      return selectedProject
    },
    associatedEmailTags: {
      get() {
        if (this.project) {
          return this.project.settings.associatedEmails.map(email => ({
            id: email,
            text: email
          }))
        }
        return []
      },
      set(val) {
        this.associatedEmails.tags = val.map(tag => {
          return tag.text
        })
      }
    }
  },
  methods: {
    linkToString(value) {
      return Util.linkToString(value)
    },
    update() {
      this.$store.state.db
        .collection("projects")
        .doc(this.project.id)
        .update({
          settings: {
            associatedEmails: this.associatedEmails.tags
          }
        })
        .then(() =>
          this.$toast.success(
            `${this.project.name} settings successfully updated.`
          )
        )
        .catch(err =>
          this.$toast.error(
            `There was an issue updating this project's settings: ${err}`
          )
        )
    }
  }
}
</script>
