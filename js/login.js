document.getElementById('login-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const messageDiv = document.getElementById('message');
  messageDiv.textContent = '';

  try {
    const response = await fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      messageDiv.style.color = 'green';
      messageDiv.textContent = 'Login successful!';
      // Redirect to dashboard page after successful login
      window.location.href = '/dashboard.html';
    } else {
      messageDiv.style.color = 'red';
      messageDiv.textContent = data.error || 'Login failed.';
    }
  } catch (error) {
    messageDiv.style.color = 'red';
    messageDiv.textContent = 'Error connecting to server.';
  }
});
