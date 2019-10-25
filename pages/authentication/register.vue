<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5">
          <form role="form">
            <gin-input
              v-model="model.first_name"
              class="input-group-alternative mb-3"
              placeholder="First Name"
              type="text"
              required
            ></gin-input>

            <gin-input
              v-model="model.last_name"
              class="input-group-alternative mb-3"
              placeholder="Last Name"
              type="text"
              required
            ></gin-input>

            <gin-input
              v-model="model.email"
              class="input-group-alternative mb-3"
              placeholder="Email"
              type="email"
              required
            ></gin-input>

            <gin-input
              v-model="model.password"
              class="input-group-alternative"
              placeholder="Password"
              type="password"
              required
            ></gin-input>

            <div class="text-center">
              <gin-button
                class="mt-4"
                native-type="submit"
                @click.prevent="register"
                >Create account
              </gin-button>
            </div>
          </form>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6">
          <a href="#" class="text-light">
            <small>Forgot password?</small>
          </a>
        </div>
        <div class="col-6 text-right">
          <router-link to="/authentication/login" class="text-light">
            <small>Login into your account</small>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  layout: "authentication",
  auth: false,
  name: "Register",
  data() {
    return {
      model: {
        first_name: "",
        last_name: "",
        email: "",
        password: ""
      }
    }
  },
  methods: {
    register: function() {
      // if (this.validateForm()) {
      this.$store
        .dispatch("users/register", {
          email: this.model.email,
          password: this.model.password,
          first_name: this.model.first_name,
          last_name: this.model.last_name
        })
        .then(
          // eslint-disable-next-line no-unused-vars
          user => {
            this.$toast.success(
              `Nice ${this.model.first_name}! We have sent you a verification email - please confirm that bad boy.`
            )
          },
          error => {
            this.$toast.error(error)
          }
        )
      // }
    },
    validateForm: function() {
      var nodes = document.querySelectorAll(`form :invalid`)
      var vm = this //current vue instance;

      Object.keys(this["validationErrors"]).forEach(key => {
        this["validationErrors"][key] = null
      })

      if (nodes.length > 0) {
        nodes.forEach(node => {
          if (node.title) {
            this["validationErrors"][node.name] = node.title
          } else {
            this["validationErrors"][node.name] = node.validationMessage
          }

          node.addEventListener("change", function() {
            vm.validateForm()
          })
        })

        return false
      } else {
        return true
      }
    }
  }
}
</script>
