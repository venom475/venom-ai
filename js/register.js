document.getElementById('register-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const messageDiv = document.getElementById('message');
  messageDiv.textContent = '';

  try {
    const response = await fetch('http://localhost:8080/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: name, email, password })
    });

    const data = await response.json();

    if (response.ok) {
      messageDiv.style.color = 'green';
      messageDiv.textContent = data.message || 'Registration successful!';
      // Optionally clear the form
      this.reset();
      // Redirect to login page after successful registration
      window.location.href = '/login.html';
    } else {
      messageDiv.style.color = 'red';
      messageDiv.textContent = data.error || 'Registration failed.';
    }
  } catch (error) {
    messageDiv.style.color = 'red';
    messageDiv.textContent = 'Error connecting to server.';
  }
});
