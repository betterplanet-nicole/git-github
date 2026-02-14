const chatWindow = document.getElementById('chatWindow');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const imageInput = document.getElementById('imageInput');
const evaluationParametersInput = document.getElementById('evaluationParameters');

function addMessage(role, text) {
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const message = messageInput.value.trim();
  const paramsRaw = evaluationParametersInput.value.trim();
  const imageFile = imageInput.files?.[0];

  if (!message && !imageFile) {
    addMessage('bot', 'Please enter a message or upload an image.');
    return;
  }

  addMessage('user', message || '[Image only request]');

  let imageDataUrl = null;
  if (imageFile) {
    imageDataUrl = await fileToDataUrl(imageFile);
  }

  let evaluationParameters = paramsRaw;
  try {
    evaluationParameters = paramsRaw ? JSON.parse(paramsRaw) : '';
  } catch {
    // Keep non-JSON text as-is.
  }

  const submitButton = chatForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        imageDataUrl,
        evaluationParameters
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to chat with the assistant.');
    }

    addMessage('bot', result.reply);
    messageInput.value = '';
    imageInput.value = '';
  } catch (error) {
    addMessage('bot', `Error: ${error.message}`);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Send';
  }
});
