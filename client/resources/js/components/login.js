Vue.component('login', {
  template: `
              <div class="login">

                <h2>Login</h2>


                <div class="login-form">
                  <div class="login-message">{{message.body}}</div>
                  <div class="login-username">
                    <label for="username">Username</label>
                    <input type="email" v-model="username" />
                  </div>
                  <div class="login-password">
                    <label for="password">Password</label>
                    <input type="password" v-model="password" />
                  </div>

                  <button @click.prevent="loginHandler">Submit</button>
                </div>
              </div>
            `,
  props: ['message'],
  data(){
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    loginHandler(){
      this.$emit('login', {username: this.username, password: this.password});
    }
  }
});
