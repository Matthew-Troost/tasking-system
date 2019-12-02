<template>
  <div class="add-user-page">
    <Loading v-if="loading" />
    <div v-if="!loading">
      <b-row>
        <b-col md="8">
          <h2 class="page-title">
            Add User
          </h2>
        </b-col>
      </b-row>
      <b-card title="User Details">
        <b-form @submit.prevent="validateForm">
          <b-row>
            <b-col md="6">
              <textbox-comp
                v-model="first_name"
                label="First Name"
                :soft-error="form.first_name.softError"
                :hard-error="form.first_name.hardError"
                placeholder="Enter First Name"
                error-message="Please Enter First Name"
              ></textbox-comp>

              <textbox-comp
                v-model="last_name"
                label="Last Name"
                :soft-error="form.last_name.softError"
                :hard-error="form.last_name.hardError"
                placeholder="Enter Last Name"
                error-message="Please Enter Last Name"
              ></textbox-comp>

              <textbox-comp
                v-model="nickname"
                label="Nickname"
                :soft-error="form.nickname.softError"
                :hard-error="form.nickname.hardError"
                placeholder="Enter Nickname"
                error-message="Please Enter Nickname"
              ></textbox-comp>

              <b-form-group label="Password">
                <b-form-input
                  v-model="password"
                  class="mb-2"
                  label="Password"
                  placeholder=""
                  disabled
                >
                </b-form-input>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <textbox-comp
                v-model="email"
                label="Email"
                :soft-error="form.email.softError"
                :hard-error="form.email.hardError"
                placeholder="Enter Email"
                :error-message="form.email.errorMessage"
              ></textbox-comp>

              <b-form-group label="Positions">
                <vue-tags-input
                  id="tagInput"
                  v-model="type"
                  class="tag-custom text-14 tag-custom"
                  :tags="types"
                  :autocomplete-items="filteredTypes"
                  placeholder="Type Position Name"
                  @tags-changed="newTags => (types = newTags.map(x => x.text))"
                />
                <error-comp
                  :hard-error="form.type.hardError"
                  :error-message="form.type.errorMessage"
                ></error-comp>
              </b-form-group>
              <b-form-group label="Roles">
                <vue-tags-input
                  id="roleInput"
                  v-model="role"
                  class="tag-custom text-14 tag-custom"
                  :tags="roles"
                  :autocomplete-items="filteredRoles"
                  placeholder="Type Role Name"
                  @tags-changed="
                    newRoles => (roles = newRoles.map(x => x.text))
                  "
                />
              </b-form-group>
              <b-form-group label="Avatar">
                <p class="file-info">Must be a .png file</p>
                <b-form-file
                  v-model="avatar"
                  type="file"
                  :class="{ fileInputError: form.avatar.hardError }"
                  placeholder="Choose or drop avatar here"
                  drop-placeholder="Drop avatar here"
                  variant="primary"
                  value="Upload"
                />
              </b-form-group>
              <error-comp
                :hard-error="form.avatar.hardError"
                :error-message="form.avatar.errorMessage"
              ></error-comp>
              <b-button type="submit" class="save-btn" variant="primary"
                >Save</b-button
              >
            </b-col>
          </b-row>
        </b-form>
      </b-card>
    </div>
  </div>
</template>
<script>
import Loading from "@/components/loading"
import generator from "generate-password"
import textboxComp from "@/components/form/textbox-comp"
import errorComp from "@/components/form/error-comp"

export default {
  layout: "default",
  components: {
    Loading,
    textboxComp,
    errorComp
  },
  validate({ params }) {
    return ["developers", "managing", "socialmedia", "designers"].includes(
      params.role
    )
  },
  data() {
    return {
      valid: false,
      loading: true,
      first_name: "",
      last_name: "",
      nickname: "",
      avatar: null,
      email: "",
      password: generator.generate({
        length: 10,
        numbers: true,
        uppercase: true,
        strict: true,
        symbols: false
      }),
      type: "",
      types: [],
      autocompletetypes: ["Developer", "Management", "SocialMedia", "Designer"],
      role: "",
      roles: [],
      autocompleteRoles: ["SuperAdmin", "User"],
      reg: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      form: {}
    }
  },
  computed: {
    avatarSaveUrl() {
      return "/UserAvatars/" + this.avatar.name
    },
    filteredTypes() {
      return this.autocompletetypes.filter(item => {
        return item.toLowerCase().indexOf(this.type.toLowerCase()) !== -1
      })
    },
    filteredRoles() {
      return this.autocompleteRoles.filter(item => {
        return item.toLowerCase().indexOf(this.role.toLowerCase()) !== -1
      })
    },
    lowerCaseTypes() {
      return this.types.map(x => x.toLowerCase())
    },
    teamParameter() {
      let parameter = {
        designer: "designers",
        developer: "developers",
        management: "managing",
        default: this.types[0].toLowerCase()
      }
      return parameter[this.types[0].toLowerCase()] || parameter["default"]
    },
    currentUser() {
      return this.$store.getters["users/getUserByUID"](
        this.$store.state.users.current_user.uid
      )
    },
    userIsSuperAdmin() {
      return (
        this.currentUser &&
        this.currentUser.roles &&
        this.currentUser.roles.includes("SuperAdmin")
      )
    }
  },
  watch: {
    first_name() {
      this.form.first_name.hardError = false
    },
    last_name() {
      this.form.last_name.hardError = false
    },
    types() {
      if (this.types.length !== 0) {
        this.types.forEach(type => {
          this.form.type.correctInput = [
            "Developer",
            "Management",
            "SocialMedia",
            "Designer"
          ].includes(type)
        })
        if (!this.form.type.correctInput) {
          this.form.type.errorMessage =
            "Please select one of the approved Roles"
        }
      } else {
        this.form.type.correctInput = true
        this.form.type.errorMessage = "Please select a Role for this user"
      }
      this.form.type.hardError = false
    },
    email() {
      this.form.email.softError = !this.isEmailValid()
      this.form.email.hardError = false
    },
    avatar() {
      this.form.avatar.isPng = this.avatar.type.includes("png")
      this.form.avatar.hardError = !this.form.avatar.isPng
      if (!this.form.avatar.isPng)
        this.form.avatar.errorMessage = "Please Upload a .png File"
    }
  },
  mounted() {
    document.getElementsByTagName("input").tagInput.classList.add("tag-custom")
    document.getElementsByTagName("input").roleInput.classList.add("tag-custom")
  },
  beforeMount() {
    this.form = {
      first_name: {
        hardError: false
      },
      last_name: {
        hardError: false
      },
      nickname: {
        hardError: false
      },
      email: {
        softError: false,
        hardError: false,
        errorMessage: this.email
          ? "Email Format is Incorrect"
          : "Please Enter Email"
      },
      type: {
        hardError: false,
        correctInput: false,
        errorMessage: ""
      },
      avatar: {
        hardError: false,
        errorMessage: "Please Upload an Avatar",
        isPng: true
      }
    }
    switch (this.$route.params.role) {
      case "developers":
        this.types.push("Developer")
        break
      case "socialmedia":
        this.types.push("SocialMedia")
        break
      case "designers":
        this.types.push("Designer")
        break
      case "managing":
        this.types.push("Management")
    }
  },
  created() {
    this.loading = false
  },
  methods: {
    async submitForm() {
      return new Promise((resolve, reject) => {
        this.$toast.success(`Adding User`)
        this.$router.push({
          name: "team-role",
          params: {
            role: this.teamParameter
          }
        })
        this.$store.state.auth
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(user => {
            this.addAvatar()
              .then(() => {
                this.getAvatarUrl()
                  .then(url => {
                    this.addUser(user, url)
                      .then(() => {
                        resolve(true)
                      })
                      .catch(error => {
                        reject(error)
                      })
                  })
                  .catch(error => {
                    reject(error)
                  })
              })
              .catch(error => {
                reject(error)
              })
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    addAvatar() {
      return new Promise((resolve, reject) => {
        this.$store.state.storage
          .ref(this.avatarSaveUrl)
          .put(this.avatar)
          .then(() => {
            resolve(true)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    addUser(user, url) {
      return new Promise((resolve, reject) => {
        this.$store.state.db
          .collection("users")
          .add({
            first_name: this.first_name,
            last_name: this.last_name,
            nickname: this.nickname,
            type: this.lowerCaseTypes,
            roles: this.roles === [] ? ["User"] : this.roles,
            avatar: url,
            uid: user.user.uid,
            email: this.email
          })
          .then(() => {
            resolve(true)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getAvatarUrl() {
      return new Promise((resolve, reject) => {
        this.$store.state.storage
          .ref(this.avatarSaveUrl)
          .getDownloadURL()
          .then(url => {
            resolve(url)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    isEmailValid() {
      return this.email === "" || this.reg.test(this.email)
    },
    validateForm() {
      this.valid = true
      if (!this.first_name) {
        this.form.first_name.hardError = true
        this.valid = false
      }
      if (!this.last_name) {
        this.form.last_name.hardError = true
        this.valid = false
      }
      if (this.form.email.softError || this.email === "") {
        this.form.email.hardError = true
        this.valid = false
      }
      if (!this.form.type.correctInput || this.types.length === 0) {
        this.valid = false
        this.form.type.hardError = true
      }
      if (!this.avatar) {
        this.valid = false
        this.form.avatar.hardError = true
        this.form.avatar.errorMessage = "Please Upload an Avatar"
      } else if (!this.form.avatar.isPng) {
        this.valid = false
        this.form.avatar.hardError = true
        this.form.avatar.errorMessage = "Please Upload a .png File"
      }

      if (this.valid)
        this.submitForm()
          .then(() => {
            this.$toast.success("User Successfully Added")
          })
          .catch(error => {
            console.log(error)
            this.$toast.error("Error Encountered")
          })
    }
  }
}
</script>
<style scoped>
.error {
  border-color: #f30000 !important;
  box-shadow: 0 0 10px 0.2rem rgba(181, 0, 0, 0.25);
}
.fileInputError {
  box-shadow: 0 0 10px 0.2rem rgba(181, 0, 0, 0.25);
}
.vue-tags-input {
  max-width: unset !important;
}
.card-profile-1 .avatar {
  width: 20% !important;
  height: 20% !important;
}
.save-btn {
  margin-top: 10px;
  float: right;
}
.ti-tag[data-v-61d92e31] {
  background: #f8f9fa !important;
  color: #0b192b !important;
}

.ti-input {
  border-radius: 0.25rem;
}
.tag-custom {
  background: #f8f9fa !important;
  color: #0b192b !important;
}

#tagInput [type="input"] {
  background: #f8f9fa !important;
  color: #0b192b !important;
}
#roleInput [type="input"] {
  background: #f8f9fa !important;
  color: #0b192b !important;
}
input {
  background: #f8f9fa !important;
}
.mt-1,
.my-1 {
  margin-top: 15px !important;
}
.add-user-page {
  margin-bottom: 25px;
}

.upload-btn {
  float: right;
  margin-right: 5px;
  margin-top: 10px;
}
.file-info {
  margin: 0;
  font-size: 10px;
  font-weight: bold;
  color: #37c162;
}
</style>
