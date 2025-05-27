document.addEventListener('DOMContentLoaded', () => {
  // Fetch and render blog posts
  fetch('/api/blog')
    .then(response => response.json())
    .then(posts => {
      const blogSection = document.querySelector('main section');
      blogSection.innerHTML = ''; // Clear existing static content
      posts.forEach(post => {
        const article = document.createElement('article');
        article.className = 'glass p-6 rounded-lg';
        article.innerHTML = `
          <h2 class="text-xl font-semibold mb-2">${post.title}</h2>
          <p class="text-gray-300">${post.summary}</p>
        `;
        blogSection.appendChild(article);
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
