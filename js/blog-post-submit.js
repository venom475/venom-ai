document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('blog-post-form');
  const messageDiv = document.getElementById('form-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageDiv.textContent = '';

    const formData = new FormData(form);

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        messageDiv.textContent = 'Blog post submitted successfully!';
        messageDiv.style.color = 'lightgreen';
        form.reset();
      } else {
        const error = await response.json();
        messageDiv.textContent = 'Error: ' + (error.error || 'Failed to submit blog post');
        messageDiv.style.color = 'red';
      }
    } catch (err) {
      messageDiv.textContent = 'Error: ' + err.message;
      messageDiv.style.color = 'red';
    }
  });
});
