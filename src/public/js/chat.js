const socket = io();

function initializeChat(userEmail) {
    socket.on('load all messages', function(messages) {
        messages.forEach(function(message) {
            displayMessage(message);
        });
    });

    document.getElementById('form').addEventListener('submit', function(e) {
        e.preventDefault();
        const messageInput = document.getElementById('input');
        if (messageInput.value) {
            socket.emit('chat message', { user: userEmail, message: messageInput.value });
            messageInput.value = '';
        }
    });

    socket.on('chat message', function(data) {
        displayMessage(data);
    });
}

function displayMessage(data) {
    const item = document.createElement('li');
    item.textContent = `${data.user}: ${data.message}`;
    document.getElementById('messages').appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
}

document.getElementById('joinChat').addEventListener('click', function() {
    const userEmail = document.getElementById('userEmail').value;
    if (userEmail) {
        socket.emit('user email provided', userEmail);

        document.getElementById('user-container').style.display = 'none';
        document.getElementById('chat-container').style.display = 'block';
        initializeChat(userEmail);
    }
});

document.addEventListener("DOMContentLoaded", function() {
    if (window.location !== window.parent.location) {
        const navbar = document.getElementById("navbar");
        if (navbar) {
            navbar.style.display = "none";
        }

        const footer = document.getElementById("footer");
        if (footer) {
            footer.style.display = "none";
        }
    }
});