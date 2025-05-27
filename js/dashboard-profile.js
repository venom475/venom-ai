document.addEventListener('DOMContentLoaded', () => {
  const profileButton = document.getElementById('profile-button');
  const profileDropdown = document.getElementById('profile-dropdown');
  const profileForm = document.getElementById('profile-form');
  const profileMessage = document.getElementById('profile-message');
  const authButtons = document.getElementById('auth-buttons');
  const btnRegister = document.getElementById('btn-register');
  const btnLogin = document.getElementById('btn-login');
  const profilePhoto = document.getElementById('profile-photo');
  const profilePhotoInput = document.getElementById('profile-photo-input');
  const profileNameInput = document.getElementById('profile-name');
  const profileEmailInput = document.getElementById('profile-email');

  let currentUser = null;

  // Toggle profile dropdown
  profileButton.addEventListener('click', () => {
    profileDropdown.classList.toggle('hidden');
  });

  // Show login/register buttons, hide profile form
  function showAuthButtons() {
    authButtons.style.display = 'flex';
    profileForm.classList.add('hidden');
    profileMessage.textContent = '';
    clearProfileForm();
  }

  // Show profile form, hide login/register buttons
  function showProfileForm() {
    authButtons.style.display = 'none';
    profileForm.classList.remove('hidden');
    profileMessage.textContent = '';
  }

  // Clear profile form inputs
  function clearProfileForm() {
    profileNameInput.value = '';
    profileEmailInput.value = '';
    profilePhoto.src = '';
    profilePhotoInput.value = '';
  }

  // Populate profile form with user data
  function populateProfileForm(user) {
    profileNameInput.value = user.username || '';
    profileEmailInput.value = user.email || '';
    if (user.photo) {
      profilePhoto.src = user.photo;
    } else {
      profilePhoto.src = 'https://via.placeholder.com/64?text=No+Photo';
    }
  }

  // Register and Login button handlers to navigate to pages
  btnRegister.addEventListener('click', () => {
    window.location.href = 'register.html';
  });
  btnLogin.addEventListener('click', () => {
    window.location.href = 'login.html';
  });

  // Profile form submit handler (update profile)
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please login first.');
      return;
    }
    const updatedName = profileNameInput.value.trim();
    const updatedEmail = profileEmailInput.value.trim();
    if (!updatedName || !updatedEmail) {
      alert('Name and email cannot be empty.');
      return;
    }
    // For simplicity, only updating username and email locally here
    // Ideally, add API endpoint to update user profile info
    currentUser.username = updatedName;
    currentUser.email = updatedEmail;
    profileMessage.textContent = 'Profile updated locally. Refresh to persist.';
  });

  // Profile photo upload handler
  profilePhotoInput.addEventListener('change', () => {
    if (!currentUser) {
      alert('Please login first.');
      profilePhotoInput.value = '';
      return;
    }
    const file = profilePhotoInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    fetch(`/api/users/photo/${currentUser._id}`, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert('Photo upload failed: ' + data.error);
        } else {
          profilePhoto.src = data.photo;
          alert('Photo uploaded successfully.');
        }
      })
      .catch(err => {
        alert('Photo upload error: ' + err.message);
      });
  });

  // Initialize UI
  showAuthButtons();
});
