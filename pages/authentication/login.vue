<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5">
          <form role="form">
            <gin-input
              v-model="model.email"
              class="input-group-alternative mb-3"
              placeholder="Email2"
            ></gin-input>

            <gin-input
              v-model="model.password"
              class="input-group-alternative"
              placeholder="Password"
              type="password"
            />
            <div class="text-center">
              <gin-button class="mt-4" @click="login">Get organized</gin-button>
            </div>
          </form>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6">
          <a href="#" class="text-light">
            <small>Reset password</small>
          </a>
        </div>
        <div class="col-6 text-right">
          <router-link to="/authentication/register" class="text-light">
            <small>Create new account</small>
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
  name: "Login",
  data() {
    return {
      model: {
        email: "",
        password: ""
      }
    }
  },
  created() {
    if (this.$store.getters["users/current_user"]) {
      this.$store.dispatch("users/logout")
    }
  },
  methods: {
    login: function() {
      this.$store
        .dispatch("users/login", {
          email: this.model.email,
          password: this.model.password
        })
        .then(
          user => {
            if (user.user.emailVerified) {
              this.$toast.success(`Welcome back!`, {
                theme: "bubble",
                position: "top-left",
                duration: 5000
              })
              this.$router.push("/dashboard")
            } else {
              this.$toast.info(
                `Mmmm.. you'll need to verify your email address before logging in.`,
                {
                  theme: "bubble",
                  position: "top-left",
                  duration: 5000
                }
              )
            }
          },
          error => {
            this.$toast.error(error, {
              theme: "bubble",
              position: "top-left",
              duration: 5000
            })
          }
        )
    }
  }
}
</script>
