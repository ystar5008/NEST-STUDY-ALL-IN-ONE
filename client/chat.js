const socket = io("http://localhost:3000/chats")

const message = document.getElementById('message');
const messages = document.getElementById('messages');

const handleSubmitNewMessage = () => {
    socket.emit('events', { data: message.value })
}

socket.on('events', ({ data }) => {
    handleNewMessage(data);
})

const handleNewMessage = (message) => {
    messages.appendChild(buildNewMessage(message));
}

const buildNewMessage = (message) => {
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(message))
    return li;
}