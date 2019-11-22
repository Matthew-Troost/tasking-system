<template>
  <!-- eslint-disable vue/no-v-html -->
  <div>
    <p id="test" hidden :v-html="noteContent"></p>
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
              variant="primary m-1 ripple btn-sm add-note-btn"
              @click="addNote"
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
                    class="d-flex mb-10 user"
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
                      <div
                        class="m-0 note-description"
                        v-html="note.content"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </vue-perfect-scrollbar>
        </b-tab>
        <b-tab title="Uploads">
          <b-row>
            <b-col :md="uploads.length > 0 ? 6 : 12">
              <b-form-file
                v-model="document"
                type="file"
                placeholder="Choose or drop a document here"
                drop-placeholder="Drop document here"
                variant="primary"
                value="Upload"
                @input="saveDoc"
              >
                <template slot="file-name" slot-scope="{ names }">
                  <b-badge variant="dark">{{ names[0] }}</b-badge>
                  <b-badge v-if="names.length > 1" variant="dark" class="ml-1">
                    + {{ names.length - 1 }} More files
                  </b-badge>
                </template>
              </b-form-file>
              <div
                v-show="uploadingDoc"
                class="spinner spinner-primary spinner-sm"
              ></div>
            </b-col>
            <b-col v-show="uploads.length > 0" md="6">
              <b-card>
                <div
                  v-for="upload in uploads"
                  :key="upload.id"
                  class="upload-item"
                >
                  <a :href="upload.storageDownlaodURL" target="_blank">{{
                    upload.name
                  }}</a>
                  <p>{{ upload.date.toDate() | moment("from", "now") }}</p>
                </div>
              </b-card>
            </b-col>
          </b-row>
        </b-tab>
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
      document: null,
      noteContent: "",
      addingNote: false,
      uploadingDoc: false,
      customToolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["code-block"]
      ],
      project: "",
      listName: "",
      task: "",
      currentUserInfo: ""
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
            uploads: [],
            taskidentifier: this.taskid
          }
        : _extras
    },
    notes() {
      return this.lodash.orderBy(this.extras.notes, "date", "desc")
    },
    uploads() {
      return this.lodash.orderBy(this.extras.uploads, "date", "desc")
    },
    taskUserEmails() {
      return this.$store.state.users.all
        .filter(x => this.task.users.includes(x.id))
        .map(t => t.email)
    }
  },
  mounted() {
    this.loading = false
  },
  created() {
    this.currentUserInfo = this.$store.getters["users/getUserByUID"](
      this.$store.state.users.current_user.uid
    )
    this.task = this.$parent.$parent.value

    this.listName = this.$parent.$parent.listName

    this.project = this.$parent.$parent.$parent.$parent.$parent.$parent.project
  },
  methods: {
    getUserName: function(userid) {
      let user = this.users.find(user => user.id == userid)
      return user ? user.nickname : "[User no longer exists]"
    },
    updateExtras: function(addingNote) {
      if (this.extras.id) {
        this.$store.state.db
          .collection("taskextras")
          .doc(this.extras.id)
          .update(this.extras)
          .then(() => {
            if (addingNote) {
              this.noteContent = ""
            } else {
              this.document = null
            }

            this.addingNote = false
            this.uploadingDoc = false
          })
          .catch(error => this.displayPushError(addingNote, error))
      } else {
        this.$store.state.db
          .collection("taskextras")
          .add(this.extras)
          .then(() => {
            if (addingNote) {
              this.noteContent = ""
            } else {
              this.document = null
            }

            this.addingNote = false
            this.uploadingDoc = false
          })
          .catch(error => this.displayPushError(addingNote, error))
      }
    },
    addNote: function() {
      if (this.noteContent.length === 0 || !this.noteContent.trim()) {
        return this.$toast.error("You'll need to enter some content first...")
      }

      this.addingNote = true

      //Sending Slack message to people on this task that a new note was added
      new Promise(() => {
        this.$slack.sendTaskNoteNotification(
          this.currentUserInfo,
          this.task.description,
          this.project.name,
          this.taskUserEmails,
          this.listName
        )
      }).catch(error => {
        console.log(error)
      })

      this.extras.notes.push({
        date: this.$store.state.firebase.firestore.Timestamp.fromDate(
          new Date()
        ),
        userid: this.currentUser.id,
        content: this.noteContent
      })

      this.updateExtras(true)
    },
    saveDoc: function() {
      if (this.document != null) {
        this.uploadingDoc = true

        //Sending Slack message to people on this task that a new document was uploaded
        new Promise(() => {
          this.$slack.sendTaskUploadNotification(
            this.currentUserInfo,
            this.task.description,
            this.project.name,
            this.taskUserEmails,
            this.listName
          )
        }).catch(error => {
          console.log(error)
        })

        this.$store.state.storage
          .ref(`/TaskDocs/${this.taskid}/${this.document.name}`)
          .put(this.document)
          .then(snapshot => {
            snapshot.ref
              .getDownloadURL()
              .then(url => {
                this.extras.uploads.push({
                  date: this.$store.state.firebase.firestore.Timestamp.fromDate(
                    new Date()
                  ),
                  name: this.document.name,
                  storageDownlaodURL: url
                })

                this.updateExtras(false)
              })
              .catch(error => this.displayPushError(false, error))
          })
          .catch(error => this.displayPushError(false, error))
      }
    },
    displayPushError: function(addingNote, error) {
      this.$toast.error(
        `There was an issue adding your ${
          addingNote ? "note" : "doc"
        }: ${error}`
      )
      this.addingNote = false
      this.uploadingDoc = false
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
.text-title {
  line-height: normal;
}
.note-description {
  font-size: 12px;
}
.message {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}
.add-note-btn {
  margin-top: 9px !important;
  margin-right: 0px !important;
}
.upload-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.upload-item p {
  margin-bottom: 0px;
  font-size: 10px;
}
</style>
