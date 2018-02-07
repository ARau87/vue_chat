Vue.component('chat-thumbnail', {
  template: `
    <div class="chat-thumbnail l3o12" @click.prevent="join">
      <h3 class="chat-name">{{chatName}}</h3>
    </div>
  `,
  methods: {
    join(){
      console.log(this.chatName);
      window.location.href = '/chat/' + this.chatName;
    }
  },
  data(){
    return {};
  },
  props: ['id', 'chatName']

});

Vue.component('lobby', {
  template: `

    <div class="chats-overview">
      <h2>Select a chatroom</h2>
      <div class="wrapper">
      <chat-thumbnail v-for="chat in chats" :id="chat.id" :key="chat.id" :chatName="chat.name" />
      </div>
    </div>
  `,
  mounted(){
      console.log('MOUNTED');
      this.loadChats();
      this.connectToServer();
  },
  methods: {
    connectToServer(){
      this.socket;
    },
    loadChats(){
      $.ajax({
        url: '/api/chats',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        method: 'GET',
        cache: false,
        success: (response) => {
          this.chats = response.chats;
        },
        error: (response) => {
          if(response.status === 401){
            window.location.replace('/login');
          }
        }
      });
    }
  },
  data(){
    return {
      chats: []
    }
  },
  computed: {
    socket(){
      return io.connect('/lobby');
    }
  }
});
