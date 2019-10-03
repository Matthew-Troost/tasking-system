<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <div class="card bg-secondary shadow border-0">
        <div class="card-header bg-transparent pb-5">
          <div class="text-muted text-center mt-2 mb-3">
            <small>Sign up with</small>
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
          <div class="text-center text-muted mb-4">
            <small>Or sign up with credentials</small>
          </div>
          <form role="form">
            <gin-input
              v-model="model.email"
              class="input-group-alternative mb-3"
              placeholder="Email"
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
              <gin-button class="mt-4" @click="register"
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
import firebase from "firebase/app"
import "firebase/firestore"

export default {
  layout: "authentication",
  name: "Register",
  data() {
    return {
      model: {
        name: "",
        email: "",
        password: ""
      }
    }
  },
  methods: {
    register: function() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.model.email, this.model.password)
        .then(
          function(user) {
            alert(user)
          },
          function(error) {
            alert(error)
          }
        )
    }
  }
}
</script>
