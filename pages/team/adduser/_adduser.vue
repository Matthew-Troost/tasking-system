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
        <b-form @submit.prevent="submitForm">
          <b-row>
            <b-col md="6">
              <b-form-group label="First Name">
                <b-form-input
                  v-model="first_name"
                  class="mb-2"
                  fade="true"
                  :class="{
                    error:
                      !form.first_name.minLength.hasMinLength ||
                      !form.first_name.valid
                  }"
                  autocomplete="off"
                  label="First Name"
                  placeholder="Enter First Name"
                >
                </b-form-input>
                <transition name="fade">
                  <b-alert
                    v-if="!form.first_name.valid"
                    show
                    variant="danger"
                    class="error col-md-6 mt-1"
                    >Name must have at least
                    {{ form.first_name.minLength.length }} letters.</b-alert
                  >
                </transition>
              </b-form-group>
              <b-form-group label="Last Name">
                <b-form-input
                  v-model="last_name"
                  class="mb-2"
                  :class="{
                    error:
                      !form.last_name.minLength.hasMinLength ||
                      !form.last_name.valid
                  }"
                  autocomplete="off"
                  label="Last Name"
                  placeholder="Enter Last Name"
                >
                </b-form-input>
                <transition name="fade">
                  <b-alert
                    v-if="!form.last_name.valid"
                    name="fade"
                    tag="b-alert"
                    show
                    fade="true"
                    variant="danger"
                    class="error col-md-6 mt-1"
                    >Last Name must have at least
                    {{ form.last_name.minLength.length }} letters.</b-alert
                  ></transition
                >
              </b-form-group>
              <b-form-group label="Nickname">
                <b-form-input
                  v-model="nickname"
                  class="mb-2"
                  :class="{ error: !form.nickname.minLength.hasMinLength }"
                  label="Nickname"
                  autocomplete="off"
                  placeholder="Enter Nickname"
                >
                </b-form-input>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Email">
                <b-form-input
                  v-model="email"
                  class="mb-2"
                  :class="{ error: !isEmailValid() || !form.email.valid }"
                  label="Email"
                  autocomplete="off"
                  type="email"
                  placeholder="Enter Email"
                >
                </b-form-input>
                <transition name="fade">
                  <b-alert
                    v-if="!form.email.valid"
                    show
                    variant="danger"
                    class="error col-md-6 mt-1"
                    >{{
                      email ? "Email format is incorrect" : "Please enter email"
                    }}</b-alert
                  >
                </transition>
              </b-form-group>
              <b-form-group label="Roles">
                <vue-tags-input
                  id="tagInput"
                  v-model="type"
                  class="tag-custom text-14 test"
                  :tags="types"
                  :autocomplete-items="filteredTypes"
                  placeholder="Type Role Name"
                  @tags-changed="newTags => (types = newTags.map(x => x.text))"
                />
                <transition name="fade">
                  <b-alert
                    v-show="!form.type.valid"
                    show
                    variant="danger"
                    class="error col-md-6 mt-1"
                    >{{ form.type.errorMessage }}</b-alert
                  >
                </transition>
              </b-form-group>
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
              <b-form-file
                v-model="avatar"
                type="file"
                :class="{ fileInputError: !form.avatar.valid }"
                placeholder="Choose or drop avatar here"
                drop-placeholder="Drop avatar here"
                variant="primary"
                value="Upload"
              />
              <b-alert
                v-if="!form.avatar.valid"
                show
                variant="danger"
                class="error col-md-6 mt-1"
                >Please upload an avatar for this user</b-alert
              >
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

export default {
  layout: "default",
  components: {
    Loading
  },
  validate({ params }) {
    return ["Developers", "Managing", "Social Media", "Designers"].includes(
      params.adduser
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
        symbols: true
      }),
      type: "",
      types: [],
      avatarUrl: require("@../../../assets/images/avatars/blank-profile-picture.png"),
      autocompletetypes: ["Developer", "Management", "SocialMedia", "Designer"],
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
    lowerCaseTypes() {
      return this.types.map(x => x.toLowerCase())
    },
    teamParameter() {
      switch (this.types[0].toLowerCase()) {
        case "designer":
          return "designers"
        case "developer":
          return "developers"
        case "management":
          return "managing"
        default:
          return this.types[0].toLowerCase()
      }
    }
  },
  watch: {
    first_name(newValue) {
      const hasMinLength =
        this.minLength(newValue, 3) && (this.form.first_name.valid = true)
      this.form.first_name.minLength.hasMinLength = hasMinLength
    },
    last_name(newValue) {
      const hasMinLength =
        this.minLength(newValue, 3) && (this.form.last_name.valid = true)
      this.form.last_name.minLength.hasMinLength = hasMinLength
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
      this.form.type.valid = true
    },
    email() {
      this.form.email.valid = this.email !== "" || this.form.email.validFormat
    },
    avatar() {
      this.form.avatar.valid = true
    }
  },
  beforeMount() {
    this.form = {
      first_name: {
        minLength: {
          hasMinLength: true,
          length: 3
        },
        required: true,
        valid: true
      },
      last_name: {
        minLength: {
          hasMinLength: true,
          length: 3
        },
        required: true,
        valid: true
      },
      nickname: {
        minLength: {
          hasMinLength: true,
          length: 3
        },
        required: false,
        valid: true
      },
      email: {
        required: true,
        validFormat: this.isEmailValid(),
        valid: true
      },
      type: {
        required: true,
        valid: true,
        correctInput: false,
        errorMessage: ""
      },
      avatar: {
        valid: true
      }
    }
    switch (this.$route.params.adduser) {
      case "Developers":
        this.types.push("Developer")
        break
      case "Social Media":
        this.types.push("SocialMedia")
        break
      case "Designers":
        this.types.push("Designer")
        break
      case "Managing":
        this.types.push("Management")
    }
  },
  created() {
    this.loading = false
  },
  methods: {
    addUser() {
      return new Promise((resolve, reject) => {
        this.$toast.success(`Adding User`)
        this.$router.push({
          name: "team-team",
          params: {
            team: this.teamParameter
          }
        })
        this.$store.state.auth
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(
            user => {
              //Add Avatar
              console.log("addavatar")
              this.$store.state.storage
                .ref(this.avatarSaveUrl)
                .put(this.avatar)
                .then(() => {
                  this.$store.state.storage
                    .ref(this.avatarSaveUrl)
                    .getDownloadURL()
                    .then(url => {
                      console.log("addUser")
                      //Add User
                      this.$store.state.db.collection("users").add({
                        first_name: this.first_name,
                        last_name: this.last_name,
                        nickname: this.nickname,
                        type: this.lowerCaseTypes,
                        avatar: url
                      })
                    })
                })
              resolve(user)
            },
            error => {
              reject(error)
            }
          )
      })
    },
    isEmailValid() {
      return this.email == "" || this.reg.test(this.email)
    },
    minLength(text, size) {
      return text == "" || text.length >= size
    },
    submitForm() {
      //Form Validation
      this.valid = true
      if (!this.form.first_name.minLength.hasMinLength || !this.first_name) {
        this.form.first_name.valid = false
        this.valid = false
      }
      if (!this.form.last_name.minLength.hasMinLength || !this.last_name) {
        this.form.last_name.valid = false
        this.valid = false
      }
      if (!this.form.email.validFormat || this.email === "") {
        this.form.email.valid = false
        this.valid = false
      }
      if (
        this.form.type.required &&
        (!this.form.type.correctInput || this.types.length === 0)
      ) {
        this.valid = false
        this.form.type.valid = false
      }
      if (!this.avatar) {
        this.valid = false
        this.form.avatar.valid = false
      }
      if (this.valid)
        this.addUser().then(
          user => {
            console.log(user)
            this.$toast.success("User Successfully Added")
          },
          error => {
            console.log(error)
            this.$toast.error("Error Encountered")
          }
        )
    }
  }
}
</script>
<style scoped>
.error {
  border-color: #f30000 !important;
  /* border-color: #dc5050 !important; */
  box-shadow: 0 0 10px 0.2rem rgba(181, 0, 0, 0.25);
  /* box-shadow: 0 0 0 0.2rem rgba(181, 0, 0, 0.25); */
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
.vue-tags-input,
.tag-custom,
.text-14 {
  background: #f8f9fa;
  color: #0b192b;
}
.ti-input {
  border-radius: 0.25rem;
}

#tagInput [type="input"] {
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

::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: #505050;
  opacity: 1; /* Firefox */
}

:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #505050;
}

::-ms-input-placeholder {
  /* Microsoft Edge */
  color: #505050;
}
</style>
