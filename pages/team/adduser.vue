<template>
  <div>
    <Loading v-if="loading" />
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
          <b-form>
            <b-form-group label="First Name">
              <b-form-input
                v-model="first_name"
                class="mb-2"
                :class="{ error: !form.first_name.minLength.hasMinLength }"
                label="First Name"
                placeholder="Enter First Name"
              >
              </b-form-input>

              <b-alert
                v-if="!form.first_name.valid"
                show
                variant="danger"
                class="error col-md-6 mt-1"
                >Name must have at least
                {{ form.first_name.minLength.length }} letters.</b-alert
              >
            </b-form-group>
            <b-form-group label="Last Name">
              <b-form-input
                v-model="last_name"
                class="mb-2"
                :class="{ error: !form.last_name.minLength.hasMinLength }"
                label="Last Name"
                placeholder="Enter Last Name"
              >
                <b-alert
                  v-if="!form.last_name.valid"
                  show
                  variant="danger"
                  class="error col-md-6 mt-1"
                  >Last Name must have at least
                  {{ form.last_name.minLength.length }} letters.</b-alert
                >
              </b-form-input>
            </b-form-group>
            <b-form-group label="Nickname">
              <b-form-input
                v-model="nickname"
                class="mb-2"
                :class="{ error: !form.nickname.minLength.hasMinLength }"
                label="Nickname"
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
                :class="{ error: !isEmailValid() }"
                label="Email"
                placeholder="Enter Email"
              >
                <b-alert
                  v-if="!form.email.valid"
                  show
                  variant="danger"
                  class="error col-md-6 mt-1"
                  >Email format is incorrect</b-alert
                >
              </b-form-input>
            </b-form-group>
            <b-form-group label="Roles">
              <vue-tags-input
                id="typesInput"
                v-model="type"
                class="tag-custom text-14"
                :tags="types"
                :autocomplete-items="filteredTypes"
                placeholder="Type Role Name"
                @tags-changed="newTags => (autocompleteTags = newTags)"
              />
              <b-alert
                v-if="!form.email.valid"
                show
                variant="danger"
                class="error col-md-6 mt-1"
                >Email format is incorrect</b-alert
              >
            </b-form-group>
          </b-form>
        </b-card>
      </b-col>

      <b-col md="6">
        <b-card class="card-profile-1 mb-30 text-center">
          <div class="avatar box-shadow-2 mb-3">
            <img src="" alt />
          </div>
          <h5 class="m-0">{{ first_name }}</h5>
          <p class="mt-0 text-muted"></p>
          <p></p>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
// import { mapState } from "vuex"
import Loading from "@/components/loading"

export default {
  layout: "default",
  components: {
    Loading
  },
  data() {
    return {
      loading: true,
      first_name: "",
      last_name: "",
      nickname: "",
      email: "",
      type: "",
      types: [],
      avatarUrl: "",
      autocompletetypes: ["Developer", "Management", "SocialMedia", "Designer"],
      reg: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
    }
  },
  computed: {
    form() {
      return {
        first_name: {
          minLength: {
            hasMinLength: this.minLength(this.first_name, 3),
            length: 3
          },
          required: true,
          valid: true
        },
        last_name: {
          minLength: {
            hasMinLength: this.minLength(this.last_name, 3),
            length: 3
          },
          required: true,
          valid: true
        },
        nickname: {
          minLength: {
            hasMinLength: this.minLength(this.nickname, 3),
            length: 3
          },
          required: false,
          valid: true
        },
        email: {
          required: true,
          valid: true
        },
        type: {
          required: true,
          valid: true
        }
      }
    },
    filteredTypes() {
      return this.autocompletetypes.filter(item => {
        return item.toLowerCase().indexOf(this.type.toLowerCase()) !== -1
      })
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
</style>
