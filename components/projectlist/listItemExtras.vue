<template>
  <div>
    <loading v-show="loading" :width="100" position="unset" />
    <div v-if="!loading" class="m-t-25">
      <b-tabs active-nav-item-class="nav nav-tabs" content-class="mt-3">
        <b-tab title="Notes" active>
          <VueEditor v-model="noteContent" :editor-toolbar="customToolbar" />
          <div class="align-right">
            <b-button variant="primary m-1 ripple btn-sm" @click="addNote"
              >Add note</b-button
            >
          </div>
          <vue-perfect-scrollbar>
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
                      :user-id="note.userid"
                      class="m-r-10"
                    />
                    <div class="message flex-grow-1">
                      <div class="d-flex">
                        <p class="mb-1 text-title text-16 flex-grow-1">
                          {{ getUserName(note.userid) }}
                        </p>
                        <span class="text-small text-muted">{{
                          note.date.toDate() | moment("from", "now")
                        }}</span>
                      </div>
                      <!-- eslint-disable-next-line vue/no-v-html -->
                      <p class="m-0" v-html="note.content"></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </vue-perfect-scrollbar>
        </b-tab>
        <b-tab title="Uploads"> </b-tab>
      </b-tabs>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex"
import { VueEditor } from "vue2-editor"
import ProjectAvatar from "@/components/projectAvatar"

export default {
  components: {
    VueEditor,
    ProjectAvatar
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
      noteContent: "",
      customToolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["code-block"]
      ]
    }
  },
  computed: {
    ...mapState({
      users: state => state.users.all,
      currentUser: state => state.users.current_user
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
              this.extras = {
                ...taskextras.docs[0].data(),
                id: taskextras.docs[0].id
              }
            }
            this.loading = false
          })
      }
    },
    getUserName: function(userid) {
      let user = this.users.find(user => user.id == userid)
      return user ? user.nickname : "[User no longer exists]"
    },
    addNote: function() {
      if (this.noteContent.length === 0 || !this.noteContent.trim()) {
        return this.$toast.error("You'll need to enter some content first...")
      }

      this.extras.notes.push({
        date: this.$store.state.firebase.firestore.Timestamp.fromDate(
          new Date()
        ),
        userid: this.users.find(user => {
          return user.uid == this.currentUser.uid
        }).id,
        content: this.noteContent
      })

      this.$store.state.db
        .collection("taskextras")
        .doc(this.extras.id)
        .update(this.extras)
        .then(() => {
          this.noteContent = ""
        })
        .catch(error => {
          this.$toast.error(`There was an issue adding your note: ${error}`)
        })
    }
  }
}
</script>
