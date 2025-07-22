document.addEventListener('DOMContentLoaded', () => {
  // Fetch and render blog posts
  fetch('/api/blog')
    .then(response => response.json())
    .then(posts => {
      const uploadedBlogsSection = document.getElementById('uploaded-blogs');
      uploadedBlogsSection.innerHTML = ''; // Clear existing content
      posts.forEach(post => {
        const article = document.createElement('article');
        article.className = 'glass p-6 rounded-lg relative';
        article.innerHTML = `
          <h2 class="text-xl font-semibold mb-2">${post.title}</h2>
          <p class="text-gray-300">${post.summary}</p>
          ${post.photo ? `<img src="${post.photo}" alt="${post.title}" class="rounded-lg mb-4" />` : ''}
          <button class="delete-btn absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm">Delete</button>
        `;
        uploadedBlogsSection.appendChild(article);
      });

      // Add event listeners for delete buttons
      const deleteButtons = uploadedBlogsSection.querySelectorAll('.delete-btn');
      deleteButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
          const article = e.target.closest('article');
          const title = article.querySelector('h2').textContent;

          // Find the post ID by matching title (assuming titles are unique)
          const post = posts.find(p => p.title === title);
          if (!post) {
            alert('Blog post not found');
            return;
          }

          if (!confirm(`Are you sure you want to delete the blog post "${title}"?`)) {
            return;
          }

          try {
            const response = await fetch(`/api/blog/${post._id}`, {
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
      });
    })
    .catch(error => {
      console.error('Error fetching blog posts:', error);
    });

  // Fetch and render company links
  fetch('/api/company-links')
    .then(res => res.json())
    .then(links => {
      const companyList = document.getElementById('company-list');
      links.forEach(link => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${link.url}" class="hover:text-green-400 transition">${link.name}</a>`;
        companyList.appendChild(li);
      });
    })
    .catch(() => {});

  // Fetch and render services links
  fetch('/api/services-links')
    .then(res => res.json())
    .then(links => {
      const servicesList = document.getElementById('services-list');
      links.forEach(link => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${link.url}" class="hover:text-green-400 transition">${link.name}</a>`;
        servicesList.appendChild(li);
      });
    })
    .catch(() => {});

  // Fetch and render contact info and social links
  fetch('/api/contact-info')
    .then(res => res.json())
    .then(data => {
      document.getElementById('contact-info').textContent = data.text || 'VenomAI: Our company is You and I.';
      const socialLinksDiv = document.getElementById('social-links');
      if (data.socialLinks) {
        data.socialLinks.forEach(link => {
          const a = document.createElement('a');
          a.href = link.url;
          a.setAttribute('aria-label', link.name);
          a.className = 'hover:text-green-400 transition';
          a.innerHTML = link.svgIcon;
          socialLinksDiv.appendChild(a);
        });
      }
    })
    .catch(() => {});

  // Handle subscription form submission
  const subscribeForm = document.getElementById('subscribe-form');
  subscribeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('subscribe-email');
    const messageDiv = document.getElementById('subscribe-message');
    const email = emailInput.value.trim();
    if (!email) {
      messageDiv.textContent = 'Please enter a valid email.';
      return;
    }
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        messageDiv.textContent = 'Subscribed successfully!';
        emailInput.value = '';
      } else {
        messageDiv.textContent = data.error || 'Subscription failed.';
      }
    } catch (error) {
      messageDiv.textContent = 'Subscription failed.';
    }
  });
});
