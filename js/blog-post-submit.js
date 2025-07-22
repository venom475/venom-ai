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

        // Append the new blog post to the uploaded blogs section
        const uploadedBlogsSection = document.getElementById('uploaded-blogs');
        const article = document.createElement('article');
        article.className = 'glass p-6 rounded-lg relative';
        article.innerHTML = `
          <h2 class="text-xl font-semibold mb-2">${result.title}</h2>
          <p class="text-gray-300">${result.summary}</p>
          ${result.photo ? `<img src="${result.photo}" alt="${result.title}" class="rounded-lg mb-4" />` : ''}
          <button class="delete-btn absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm">Delete</button>
        `;
        uploadedBlogsSection.prepend(article);

        // Add event listener for the delete button of the newly added blog post
        const deleteBtn = article.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', async (e) => {
          if (!confirm(`Are you sure you want to delete the blog post "${result.title}"?`)) {
            return;
          }
          try {
            const response = await fetch(`/api/blog/${result._id}`, {
              method: 'DELETE'
            });
            if (response.ok) {
              article.remove();
            } else {
              alert('Failed to delete blog post');
            }
          } catch (error) {
            alert('Error deleting blog post');
          }
        });

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
