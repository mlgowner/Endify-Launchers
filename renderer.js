document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const result = await window.api.login({ username, password });
  if (result.success) {
    document.getElementById('login-content').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
  } else {
    alert('Login failed: ' + result.error);
  }
});

document.getElementById('register-btn')?.addEventListener('click', async () => {
  await window.api.openRegister();
});

document.getElementById('profile-circle')?.addEventListener('click', () => {
  window.location.href = 'pages/profile.html';
});

document.getElementById('back-btn')?.addEventListener('click', () => {
  window.location.href = 'pages/main.html';
});

document.getElementById('play-mod-1')?.addEventListener('click', async () => {
  const profile = await window.api.fetchProfile();
  if (profile.username) {
    const result = await window.api.launchMc({ version: '1.20.1', username: profile.username, uuid: profile.uuid });
    if (result.success) alert('Mod 1 launched!');
  }
});

document.getElementById('play-mod-2')?.addEventListener('click', async () => {
  const profile = await window.api.fetchProfile();
  if (profile.username) {
    const result = await window.api.launchMc({ version: '1.20.1', username: profile.username, uuid: profile.uuid });
    if (result.success) alert('Mod 2 launched!');
  }
});

window.addEventListener('load', async () => {
  const profile = await window.api.fetchProfile();
  if (profile.username) {
    document.getElementById('login-content').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
  } else {
    document.getElementById('main-content').classList.add('hidden');
    document.getElementById('login-content').classList.remove('hidden');
  }
  if (window.location.pathname.includes('profile.html')) {
    document.getElementById('profile-username').textContent = profile.username || 'Guest';
  }
  document.getElementById('catalog-button').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
});