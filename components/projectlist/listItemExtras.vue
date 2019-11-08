<template>
  <div>
    <Loading v-show="loading" :width="100" position="unset" />
    <b-card v-if="!loading">
      <b-tabs active-nav-item-class="nav nav-tabs" content-class="mt-3">
        <b-tab title="Notes" active>
          <VueEditor :editor-toolbar="customToolbar" />
          <div class="chat-sidebar-container">
            <div class="chat-content-wrap">
              <div class="chat-content">
                <div
                  v-for="note in extras.notes"
                  :key="note.date"
                  class="d-flex mb-30 user"
                >
                  <ProjectAvatar
                    image-url="@/assets/images/avatars/matthewt.svg"
                    :hide-nick-name="true"
                    :width="35"
                    nick-name="Matt"
                    class="m-r-10"
                  />
                  <div class="message flex-grow-1">
                    <div class="d-flex">
                      <p class="mb-1 text-title text-16 flex-grow-1">
                        {{ getUserName(note.userid) }}
                      </p>
                      <span class="text-small text-muted">24 min ago</span>
                    </div>
                    <p class="m-0">{{ note.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-tab>
        <b-tab title="Uploads"> </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>
<script>
import { mapState } from "vuex"
import { VueEditor } from "vue2-editor"
import ProjectAvatar from "@/components/projectAvatar"
import Loading from "../loading"

export default {
  components: {
    VueEditor,
    ProjectAvatar,
    Loading
  },
  props: {
    taskid: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      loading: true,
      extras: null,
      customToolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["image", "code-block"]
      ]
    }
  },
  computed: {
    ...mapState({
      users: state => state.users.all
    })
  },
  methods: {
    initialize: function() {
      if (this.loading) {
        this.$store.state.db
          .collection("taskextras")
          .where("taskidentifier", "==", this.taskid)
          .limit(1)
          .onSnapshot(taskextras => {
            if (taskextras && taskextras.docs) {
              this.extras = taskextras.docs[0].data()
            }
            this.loading = false
          })
      }
    },
    getUserName: function(userid) {
      let user = this.users.find(user => user.id == userid)
      return user ? user.nickname : "[User no longer exists]"
    }
  }
}
</script>
