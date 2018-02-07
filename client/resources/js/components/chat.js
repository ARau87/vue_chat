Vue.component('chat-message', {
  template: `
    <div>
      <div class="chat-message-user"><span>{{message.user}}</span></div><div class="chat-message-body">{{message.body}}</div>
    </div>
  `,
  props:['message']
});

Vue.component('chat-user', {
  template: `
    <div class="chat-user">
      <span>{{user.nickname}}</span>
    </div>
  `,
  props:['user']
});


Vue.component('chat', {
  template: `
    <div v-if="!error && chat.name" class="chat container">
      <div class="row chat-header">
        <h1>Hello {{ me.nickname }}. Welcome to {{chat.name}}</h1>
      </div>

      <div class="row chat-input-wrapper">
        <div class="chat-input l12o12">
          <label for="chat-send">Message:</label>
          <input @keyup.enter="send" v-model="message" type="text"/>
          <button @click.prevent="send">Send</button>
        </div>
      </div>

      <div class="row chat-infos">
        <div class="chat-messages l9o12">
          <h2>Messages:</h2>
            <chat-message v-for="chatMessage in messages" v-bind:class="[(chatMessage.user == me.nickname) ? ownMessage : otherUserMessage, errorClass]" :message="chatMessage" :key="messages.indexOf(chatMessage)"></chat-message>
        </div>

        <div class="chat-users l3o12">
          <h2>Users:</h2>
          <chat-user v-for="user in users" :user="user" :key="user._id"></chat-user>
        </div>
      </div>

    </div>

    <div class="chat container" v-else-if="!error && !chat.name">
      Loading...
    </div>

    <div class="chat container" v-else-if="error">
      <h1>This chat was not found. Please return to the <a href="/lobby">lobby</a></h1>

    </div>

  `,
  methods: {
    loadChatInformation(){
      this.chatUrl = window.location.href.split('/')[window.location.href.split('/').length-1];

      $.ajax({
        url: '/api/chat/' + this.chatUrl,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        method: 'GET',
        success: (response) => {
          this.chat = response.chat;
        },
        error: () => {
          this.error = true;
        }
      });
    },
    loadUserInformation(){
      $.ajax({
        url: '/auth/me',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        method: 'GET',
        success: (response) => {
          this.me = response.user;

        },
        error: (response) => {
        }
      });
    },
    loadChatUsersInformation(){

      $.ajax({
        url: '/api/chat/' + window.location.href.split('/')[window.location.href.split('/').length-1] +'/users',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        method: 'GET',
        success: (response) => {
          this.users = response.users;
        },
        error: (response) => {
          if(response.status === 401){
            window.location.replace('/login');
          }
        }
      });
    },
    setupSocket(){

      this.socket = io.connect('/'+this.chatUrl);

      $(window).on('beforeunload', () => {
        this.socket.emit('disconnected', {user: this.me.username});
      })

      this.socket.on('user-message', (message) => {
        console.log('[CLIENT] User sent message!');
        this.addMessage(message);
      });

      this.socket.on('user-entered', (message) => {
        console.log('[CLIENT] User entered room!');
        this.loadChatUsersInformation();
      });

      this.socket.on('user-left', (message) => {
        console.log('[CLIENT] User left room!');
        this.loadChatUsersInformation();
      });

    },
    send(){
      this.socket.emit('chat-message', {body: this.message, user: this.me.nickname});
      this.message = "";
    },
    addMessage(message){
      this.messages.push(message);
    },
    addUser(message){
      this.users.push(message.user);
    }

  },
  data(){
    return {
      chatUrl: '',
      chat: {},
      error: false,
      me: {},
      socket: null,
      message: '',
      messages: [],
      users: [],
      ownMessage: 'chat-own-message',
      otherUserMessage: 'chat-other-message',
      errorClass: 'chat-error'
    }
  },
  created(){
    this.loadChatInformation();
    this.loadUserInformation();
    this.loadChatUsersInformation();
    this.setupSocket();
  },
  watch: {
    me: function(me){
      this.socket.emit('entered', {body: 'Hey guys!', user: this.me.username});
    }
  }

});
