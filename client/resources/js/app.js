new Vue({
  name: 'vue_chat',
  el: '#app',
  methods: {
    register(options){
      $.ajax({
        url: '/auth/register',
        data: JSON.stringify(options),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        method: 'POST',
        success: (response) => {
          window.location.href = '/login'
        },
        error: (response) => {
          this.registerMessage = JSON.parse(response.responseText);
        }
      });
    },
    login(options){
      $.ajax({
        url: '/auth/login',
        data: JSON.stringify(options),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        method: 'POST',
        success: (response) => {
          window.location.href = '/lobby'
        },
        error: (response) => {
          this.loginMessage = JSON.parse(response.responseText);
        }
      });
    }
  },
  data(){
    return {
      registerMessage: {body: 'Please enter your data:', code: 100},
      loginMessage: {body: 'Please enter your data:', code:100}
    }
  },
  computed: {
  }
});
