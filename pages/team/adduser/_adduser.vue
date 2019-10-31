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
      <b-row>
        <b-col md="6">
          <b-card title="User Details">
            <b-form @submit.prevent="submitForm">
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
                  autocomplete="false"
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
                  autocomplete="false"
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
                  autocomplete="false"
                  placeholder="Enter Nickname"
                >
                  <!-- <b-alert
                v-if="!form.nickname.valid"
                show
                variant="danger"
                class="error col-md-6 mt-1"
                >Nickname must have at least
                {{ form.last_name.minLength.length }} letters.</b-alert
              > -->
                </b-form-input>
              </b-form-group>
              <b-form-group label="Email">
                <b-form-input
                  v-model="email"
                  class="mb-2"
                  :class="{ error: !isEmailValid() || !form.email.valid }"
                  label="Email"
                  autocomplete="false"
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
                  @tags-changed="newTags => (types = newTags)"
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
              <b-button type="submit" class="save-btn" variant="primary"
                >Save</b-button
              >
            </b-form>
          </b-card>
        </b-col>

        <!-- <b-col md="6">
        <b-col md="10">
          <b-card class="card-profile-1 mb-30 text-center">
            <div class="avatar box-shadow-2 mb-3">
              <img :src="avatarUrl" alt />
            </div>
            <h5 class="m-0">
              {{ display_first_name }} {{ display_last_name }}
            </h5>
            <p class="mt-0 text-muted">aka {{ display_nickname }}</p>
            <p class="mt-0 text-muted">{{ display_email }}</p>

            <p class="mt-0 text-muted">{{ display_types }}</p>

            <p></p>
          </b-card>
        </b-col>
      </b-col> -->
      </b-row>
    </div>
  </div>
</template>
<script>
// import { mapState } from "vuex"
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
      loading: true,
      first_name: "",
      last_name: "",
      nickname: "",
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
    filteredTypes() {
      return this.autocompletetypes.filter(item => {
        return item.toLowerCase().indexOf(this.type.toLowerCase()) !== -1
      })
    },
    display_first_name() {
      return this.first_name ? this.first_name : "[First Name]"
    },
    display_last_name() {
      return this.last_name ? this.last_name : "[Last Name]"
    },
    display_nickname() {
      return this.nickname ? this.nickname : "[Nickname]"
    },
    display_email() {
      return this.email ? this.email : "[Email]"
    },
    display_types() {
      return this.types && this.types.length
        ? this.types.map(x => x.text).join(", ")
        : "[Role/s]"
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
          ].includes(type.text)
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
      }
    }
    switch (this.$route.params.adduser) {
      case "Developers":
        this.types.push({ text: "Developer" })
        break
      case "Social Media":
        this.types.push({ text: "SocialMedia" })
        break
      case "Designers":
        this.types.push({ text: "Designer" })
        break
      case "Managing":
        this.types.push({ text: "Management" })
    }
  },
  created() {
    this.loading = false
  },
  methods: {
    addUser() {},
    isEmailValid() {
      return this.email == "" || this.reg.test(this.email)
    },
    minLength(text, size) {
      return text == "" || text.length >= size
    },
    submitForm() {
      //Form Validation
      if (!this.form.first_name.minLength.hasMinLength || !this.first_name) {
        this.form.first_name.valid = false
      }
      if (!this.form.last_name.minLength.hasMinLength || !this.last_name) {
        this.form.last_name.valid = false
      }
      if (!this.form.email.validFormat || this.email === "") {
        this.form.email.valid = false
      }
      if (
        this.form.type.required &&
        (!this.form.type.correctInput || this.types.length === 0)
      ) {
        this.form.type.valid = false
      }
    }
  }
}
</script>
<style scoped>
.error {
  border-color: #f30000 !important;
  box-shadow: 0 0 0 0.2rem rgba(181, 0, 0, 0.25);
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
}

/* TODO: tag input styling */
/* .ti-input {
  background: #f8f9fa;
}
.ti-new-tag-input {
  border: 1px solid #ced4da;
  background: #f8f9fa;
}
.ti-tags {
  background: #f8f9fa;
}
.ti-new-tag-input-wraper {
  background: #f8f9fa;
} */

.vue-tags-input,
.tag-custom,
.text-14 {
  background: #f8f9fa;
  color: #0b192b;
}
.ti-input {
  border-radius: 0.25rem;
}

/* .ti-new-tag-input,
.ti-valid {
  background: #f8f9fa !important;
  color: #0b192b !important;
} */

#tagInput,
input {
  background: #f8f9fa !important;
  color: #0b192b !important;
}

.mt-1,
.my-1 {
  margin-top: 15px !important;
}

.add-user-page {
  margin-bottom: 25px;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
