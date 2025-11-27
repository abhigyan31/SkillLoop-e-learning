// js/login.js
// Frontend login that posts credentials to your backend API and expects cookie-based auth.
// Change API_BASE to your backend host when deployed.

const API_BASE = 'https://skill-loop-demo-tan.vercel.app/'; // <- change for production

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const yearEl = document.getElementById('copyYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearValidation(form);

    const email = (form.email?.value || '').trim().toLowerCase();
    const password = form.password?.value || '';

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setFieldError(form.email, 'Please enter a valid email');
      return;
    }
    if (!password) {
      setFieldError(form.password, 'Please enter your password');
      return;
    }

    try {
      const resp = await fetch(`/backend/api/auth/login`, {
        method: 'POST',
        credentials: 'include', // important if server sets HttpOnly cookie
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const json = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        const msg = json.error || json.message || 'Login failed';
        // if server returns field-specific errors, map them
        if (json.errors && typeof json.errors === 'object') {
          for (const k in json.errors) {
            const el = form.querySelector(`[name="${k}"]`);
            if (el) setFieldError(el, json.errors[k]);
          }
        } else {
          showFormError(msg, form);
        }
        return;
      }

      // Success — server should set HttpOnly cookie. Optionally json.user returned.
      showToast('Signed in — redirecting...');
      setTimeout(() => {
        // Change to the page where logged-in users should land
        window.location.href = 'home.html';
      }, 900);

    } catch (err) {
      console.error('Network or server error during login:', err);
      showFormError('Network error. Please try again later.', form);
    }
  });

  // Remove error when user changes input
  form.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', () => {
      inp.classList.remove('input-error');
      const msg = inp.parentElement.querySelector('.error-msg');
      if (msg) msg.remove();
    });
  });

  // Helpers (same as signup)
  function setFieldError(el, message) {
    if (!el) return;
    el.classList.add('input-error');
    let msg = el.parentElement.querySelector('.error-msg');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'error-msg';
      el.parentElement.appendChild(msg);
    }
    msg.textContent = message;
    if (el.focus) el.focus();
  }

  function clearValidation(frm) {
    frm.querySelectorAll('.input-error').forEach(n => n.classList.remove('input-error'));
    frm.querySelectorAll('.error-msg').forEach(n => n.remove());
    const banner = frm.querySelector('.form-error-banner');
    if (banner) banner.remove();
  }

  function showFormError(message, containerForm) {
    let banner = containerForm.querySelector('.form-error-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'form-error-banner';
      banner.style.color = '#ffffff';
      banner.style.background = 'linear-gradient(90deg,#ff5f6d,#ffc371)';
      banner.style.padding = '10px 14px';
      banner.style.borderRadius = '8px';
      banner.style.marginBottom = '12px';
      banner.style.fontWeight = '600';
      containerForm.prepend(banner);
    }
    banner.textContent = message;
    setTimeout(() => {
      banner?.remove();
    }, 6000);
  }

  function showToast(text) {
    let t = document.querySelector('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      t.style.position = 'fixed';
      t.style.right = '20px';
      t.style.bottom = '20px';
      t.style.background = '#0f172a';
      t.style.color = '#fff';
      t.style.padding = '10px 14px';
      t.style.borderRadius = '8px';
      t.style.zIndex = 9999;
      document.body.appendChild(t);
    }
    t.textContent = text;
    t.style.opacity = '1';
    setTimeout(() => {
      t.style.opacity = '0';
    }, 2500);
  }
});
