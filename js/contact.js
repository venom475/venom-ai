document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('main form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Message sent successfully!');
        form.reset();
      } else {
        alert(data.error || 'Failed to send message.');
      }
    } catch (error) {
      alert('Failed to send message.');
    }
  });
});
