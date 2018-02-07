Vue.component('register', {
  template: `
              <div class="register">

                <h2>Registration</h2>

                <register-form :message="message" @registration="registrationHandler"/>
              </div>
            `,
  props: ['message'],
  methods: {
    registrationHandler(options){
      this.$emit('registration', options);
    }
  }
});

Vue.component('register-form', {
  template: `
    <div class="register-form">

      <div class="register-message">{{message.body}}</div>

      <div class="register-username">
        <label for="username">Username *</label>
        <input v-model="username" type="email"/>
      </div>

      <div class="register-password">
        <label for="password">Password *</label>
        <input v-model="password" type="password"/>
      </div>

      <div class="register-nickname">
        <label for="nickname">Nickname *</label>
        <input v-model="nickname" type="text"/>
      </div>

      <div class="register-access_key">
        <label for="access_key">Access Key *</label>
        <input v-model="access_key" type="text"/>
      </div>

      <button @click="submit">Submit</button>
    </div>
  `,
  data() {
    return {
      nickname: '',
      username: '',
      password: '',
      access_key: ''
    }
  },
  methods: {
    submit(){
      this.$emit('registration', {nickname: this.nickname, username: this.username, password: this.password, access_key: this.access_key});
    }
  },
  props:['message']
})
