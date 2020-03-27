var express = require('express');
var app = express();

// require the socket in the library
const io = require('socket.io')(); // instantiate the library right away with the () method -> makes it run
const port = process.env.PORT || 3030;

// Arrays for usernames
users = [];

// tell express where our static files are (js, images, css etc)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

// MESSAGING FUNCTIONALITY
// attach socket.io
io.attach(server);

io.on('connection', function(socket) {
    console.log('user connected');
    socket.emit('connected', { sID: `${socket.id}`, message: 'new connection'});
    
    // listen for an incoming message from a user (socket refers to an individual user)
    // msg is the incoming message from that user
    socket.on('chat_message', function(msg) {
        console.log(msg);

        // Typing message "..."
        socket.on('typing', () => {
            socket.broadcast.emit('typing ...', {
            username: socket.id,
            });
        })

        // when we get a new message, send it to everyone so they see it
        // io is the switchboard operator that makes sure everyone who is connected gets the messages
        io.emit('new_message', { id: socket.id, message: msg})
    })

    // listen for a disconnect event
    socket.on('disconnect', function() {
        console.log('a user disconnected');

        message = `${socket.id} has left the chat!`;
        io.emit('user_disconnect', message);
    })
})