<template>
  <div>
    <loading v-show="loading" :width="100" position="unset" />
    <div v-if="!loading">
      <b-tabs active-nav-item-class="nav nav-tabs" content-class="mt-3">
        <b-tab title="Notes" active>
          <VueEditor v-model="noteContent" :editor-toolbar="customToolbar" />
          <div class="align-right">
            <div
              v-show="addingNote"
              class="spinner spinner-primary spinner-sm"
            ></div>
            <b-button
              v-show="!addingNote"
              variant="primary m-1 ripple btn-sm"
              @click="orderNotesByDate"
              >Add note</b-button
            >
          </div>
          <vue-perfect-scrollbar>
            <div class="chat-sidebar-container">
              <div class="chat-content-wrap">
                <div class="chat-content">
                  <div
                    v-for="note in notes"
                    :key="note.id"
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
import { mapState, mapGetters } from "vuex"
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
      noteContent: "",
      addingNote: false,
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
      currentUser: state => state.users.current_user,
      taskextras: state => state.taskextras.all
    }),
    ...mapGetters({
      getExtras: "taskextras/getForTask"
    }),
    extras() {
      let _extras = this.getExtras(this.taskid)
      return _extras == null
        ? {
            notes: [],
            taskidentifier: this.taskid
          }
        : _extras
    },
    notes() {
      return this.lodash.orderBy(this.extras.notes, "date", "desc")
    }
  },
  mounted() {
    this.loading = false
  },
  methods: {
    getUserName: function(userid) {
      let user = this.users.find(user => user.id == userid)
      return user ? user.nickname : "[User no longer exists]"
    },
    addNote: function() {
      if (this.noteContent.length === 0 || !this.noteContent.trim()) {
        return this.$toast.error("You'll need to enter some content first...")
      }

      this.addingNote = true

      this.extras.notes.push({
        date: this.$store.state.firebase.firestore.Timestamp.fromDate(
          new Date()
        ),
        userid: this.users.find(user => {
          return user.uid == this.currentUser.uid
        }).id,
        content: this.noteContent
      })

      if (this.extras.id) {
        this.$store.state.db
          .collection("taskextras")
          .doc(this.extras.id)
          .update(this.extras)
          .then(() => {
            this.noteContent = ""
            this.addingNote = false
          })
          .catch(error => {
            this.$toast.error(`There was an issue adding your note: ${error}`)
            this.addingNote = false
          })
      } else {
        this.$store.state.db
          .collection("taskextras")
          .add(this.extras)
          .then(() => {
            this.noteContent = ""
            this.addingNote = false
          })
          .catch(error => {
            this.$toast.error(`There was an issue adding your note: ${error}`)
            this.addingNote = false
          })
      }
    }
  }
}
</script>
<style scoped>
.spinner {
  margin: 4px;
}
.chat-sidebar-container {
  max-height: 300px;
}
</style>
