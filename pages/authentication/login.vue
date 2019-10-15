<template>
  <div class="auth-layout-wrap">
    <div class="auth-content">
      <div class="card o-hidden">
        <div class="row">
          <div class="col-md-12">
            <div class="p-4">
              <div class="auth-logo text-center mb-30">
                <img :src="model.logo" />
              </div>
              <h1 class="mb-3 text-18">Sign In</h1>
              <b-form @submit.prevent="formSubmit">
                <b-form-group label="Email Address" class="text-12">
                  <b-form-input
                    v-model="model.email"
                    class="form-control-rounded"
                    type="text"
                    email
                    required
                  ></b-form-input>
                </b-form-group>

                <b-form-group label="Password" class="text-12">
                  <b-form-input
                    v-model="model.password"
                    class="form-control-rounded"
                    type="password"
                  ></b-form-input>
                </b-form-group>

                <!-- <b-button block to="/" variant="primary btn-rounded mt-2"
                  >Sign In</b-button
                > -->
                <b-button
                  type="submit"
                  tag="button"
                  class="btn-rounded btn-block mt-2"
                  variant="primary mt-2"
                  @click="login"
                >
                  SignIn
                </b-button>
              </b-form>

              <div class="mt-3 text-center">
                <router-link to="forgot" tag="a" class="text-muted">
                  <u>Forgot Password?</u>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5">
          <form role="form">
            <gin-input
              v-model="model.email"
              class="input-group-alternative mb-3"
              placeholder="Email"
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
  </div> -->
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
        password: "",
        logo: require("@../../../assets/images/logo2.png")
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
<style scoped>
.auth-layout-wrap .auth-content {
  min-width: 25rem;
}
.auth-logo img {
  /* height: 100px; */
  width: unset;
  margin-bottom: 1.5rem;
}
</style>
