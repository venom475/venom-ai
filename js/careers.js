document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('career-form');
  const message = document.getElementById('career-message');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.textContent = 'Sending application...';
    message.style.color = '';

    const payload = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      role: document.getElementById('role').value,
      details: document.getElementById('details').value.trim()
    };

    try {
      const response = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      message.textContent = data.message;
      message.style.color = '#195395';
      form.reset();
    } catch (error) {
      console.error('Career application error:', error);
      message.textContent = error.message || 'Failed to submit application. Please try again.';
      message.style.color = '#b42318';
    }
  });
});
