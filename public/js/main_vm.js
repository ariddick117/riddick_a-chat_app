// imports always go first - if we're importing anything
import ChatMessage from "./modules/ChatMessage.js";

const socket = io();

function setUserId({sID, message}) {
    //debugger;
    vm.socketID = sID;
}

function runDisconnectMessage(packet) {
    //debugger;
    console.log(packet);
}

function appendNewMessage(msg) {
    // take the incoming message and oush it into the Vue instance into the message array
    vm.messages.push(msg);
}

// Main Vue Instances
const vm = new Vue({
    data: {
        socketID: "",
        messages: [],
        message: "",
        nickname: "",
        isHidden: false
    },

    methods: {
        addUsername() {
            console.log('Your username has been successfully set'); // || console.log('Did not work');
        },

        showMessage() {
            // emit a message event and send message to the server
            //console.log('handle send message');

            socket.emit('chat_message', { 
                content: this.message,
                name: this.nickname || "anonymous" 
                // || is called a double pipe operator or an "or" operator
                // if this.nickname is set, use that value or just make the name "anonymous"
            })

            this.message = "";
        },

        created() {
            // shows the user typing
            socket.on('typing', (data) => {
                this.typing = data;
            });


            socket.on('stopTyping', () => {
                this.typing = false;
            });
        }
    },

    components: {
        newmessage: ChatMessage
    },

    mounted: function() {
        console.log('mounted');
    }
}).$mount('#app');

// some event handling -> these events come from the server
socket.addEventListener('connected', setUserId);
socket.addEventListener('user_disconnect', runDisconnectMessage);
socket.addEventListener('new_message', appendNewMessage);