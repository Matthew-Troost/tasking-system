<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <div class="card bg-secondary shadow border-0">
        <div class="card-header bg-transparent pb-5">
          <div class="text-muted text-center mt-2 mb-3">
            <small>Sign in with</small>
          </div>
          <div class="btn-wrapper text-center">
            <a href="#" class="btn btn-neutral btn-icon">
              <span class="btn-inner--icon">
                <img src="~/assets/images/google.svg" />
              </span>
              <span class="btn-inner--text">Google</span>
            </a>
          </div>
        </div>
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
              <gin-button class="mt-4">Get organized</gin-button>
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
  name: "Login",
  data() {
    return {
      model: {
        email: "",
        password: ""
      }
    }
  },
  methods: {
    login: function() {
      this.$store.dispatch("users/login", this.email, this.password).then(
        // eslint-disable-next-line no-unused-vars
        response => {
          alert("Succesfully authenticated!")
        },
        error => {
          alert("Oops.. an error occured: " + error)
        }
      )
    }
  }
}
</script>
