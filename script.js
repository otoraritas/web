const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
let isChatting = false;
let typingInterval;

function sendMessage() {
    const userMessage = userInput.value.trim();
    const sendButton = document.querySelector('button');
    const stopButton = document.querySelectorAll('button')[1]; // Select the second button (Stop)

    if (!isChatting) {
        if (userMessage !== '') {
            isChatting = true;

            appendMessage('USER', userMessage, 'user-message');
            let botResponse = '';

            simulateTyping('CHATBOT', 'Tunggu 1 abad...');

            switch (userMessage.toLowerCase()) {
                case 'menu':
                    botResponse = 'Teks: Kosong';
                    break;
                case 'buka':
                    botResponse = 'Pintu berhasil dibuka.';
                    break;
                case 'pesan':
                    botResponse = 'Ada pesan baru untuk Anda.';
                    break;
                default:
                    fetch(`https://langapi.cyclic.app/api/openai?text=${encodeURIComponent(userMessage)}`)
                        .then(response => response.json())
                        .then(data => {
                            botResponse = data.result || 'Maaf, saya tidak mengerti pesan Anda.';
                        })
                        .catch(error => {
                            console.error('Error fetching data:', error);
                            botResponse = 'Maaf, terjadi kesalahan.';
                        })
                        .finally(() => {
                            simulateTyping('CHATBOT', botResponse);
                            userInput.value = '';
                            sendButton.textContent = 'Send';
                        });
                    return;
            }

            simulateTyping('CHATBOT', botResponse);
            userInput.value = '';
            sendButton.textContent = 'Send';
        }
    } else {
        clearInterval(typingInterval); // Stop typing simulation
        isChatting = false;
        sendButton.textContent = 'Send';
    }
}

function stopChat() {
    clearInterval(typingInterval); // Stop typing simulation
    isChatting = false;
    const sendButton = document.querySelector('button');
    sendButton.textContent = 'Send';
}

function simulateTyping(sender, message) {
    const messageType = sender === 'USER' ? 'user-message' : 'chatbot-message';
    const messageElement = document.createElement('div');
    messageElement.className = `message ${messageType}`;
    chatBox.appendChild(messageElement);

    let i = 0;
    typingInterval = setInterval(() => {
        const partialMessage = message.substring(0, i);
        const contentToDisplay = isHTML(partialMessage) ? formatCode(partialMessage) : partialMessage;
        messageElement.innerHTML = `${sender}: ${contentToDisplay}|`;
        i++;

        if (i > message.length) {
            clearInterval(typingInterval);
            const finalContent = isHTML(message) ? formatCode(message) : message;
            messageElement.innerHTML = `${sender}: ${finalContent}`;
            appendCopyCodeLink(messageElement, finalContent);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }, 50);

    messageElement.onclick = () => showCopyCodeButton(messageElement);
}

function appendCopyCodeLink(element, code) {
    const copyCodeLink = document.createElement('span');
    copyCodeLink.className = 'copy-code';
    copyCodeLink.textContent = 'Copy Code';
    copyCodeLink.onclick = () => copyCodeToClipboard(code);

    const copyCodeContainer = document.createElement('div');
    copyCodeContainer.className = 'copy-code-container';
    copyCodeContainer.appendChild(copyCodeLink);

    element.appendChild(copyCodeContainer);
}

function copyCodeToClipboard(code) {
    const textarea = document.createElement('textarea');
    textarea.value = code;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function isHTML(str) {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
}

function formatCode(code) {
    return `<pre>${escapeHtml(code)}</pre>`;
}

function escapeHtml(html) {
    const text = document.createTextNode(html);
    const div = document.createElement('div');
    div.appendChild(text);
    return div.innerHTML;
}

function appendMessage(sender, message, messageType) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${messageType}`;
    messageElement.innerText = `${sender}: ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showCopyCodeButton(messageElement) {
    const copyCodeContainer = messageElement.querySelector('.copy-code-container');
    if (copyCodeContainer) {
        copyCodeContainer.style.display = 'flex';

        setTimeout(() => {
            copyCodeContainer.style.display = 'none';
        }, 10000);
    }
}

function toggleSessionMenu() {
    const sessionMenu = document.getElementById('sessionMenu');
    sessionMenu.classList.toggle('show');
}

function createNewSession() {
    console.log('Creating a new session...');
}
