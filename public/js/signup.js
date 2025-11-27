// js/signup.js
// Frontend signup that posts to your backend API and expects cookie-based auth (HttpOnly cookie).
// Change API_BASE if your backend uses a different host/port (e.g. the production URL).

const API_BASE = 'https://skill-loop-demo-tan.vercel.app/'; // <- change to your backend URL when deployed

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const yearEl = document.getElementById('copyYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearValidation(form);

    const firstName = (form.firstName?.value || '').trim();
    const lastName = (form.lastName?.value || '').trim();
    const email = (form.email?.value || '').trim().toLowerCase();
    const password = form.password?.value || '';
    const confirmPassword = form.confirmPassword?.value || '';

    // Client-side validation
    const errors = {};
    if (!firstName) errors.firstName = 'Please enter your first name';
    if (!lastName) errors.lastName = 'Please enter your last name';
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Please enter a valid email address';
    if (!password || password.length < 8) errors.password = 'Password must contain at least 8 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!form.agreeTerms?.checked) errors.agreeTerms = 'You must accept the Terms and Privacy';

    if (Object.keys(errors).length) {
      showValidationErrors(errors, form);
      return;
    }

    // Build payload
    const payload = {
      firstName,
      lastName,
      email,
      password
    };

    try {
      // POST to backend signup endpoint
      const resp = await fetch(`/backend/api/auth/signup.js`, {
        method: 'POST',
        credentials: 'include', // required for cookie-based auth
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        // Try to show field-specific errors if server provided them
        const msg = json.error || json.message || 'Signup failed';
        // If server returned validation errors object, map them to fields (common pattern)
        if (json.errors && typeof json.errors === 'object') {
          showValidationErrors(json.errors, form);
        } else {
          showFormError(msg, form);
        }
        return;
      }

      // Success
      showToast('Account created successfully. Redirecting to sign in...');
      // You may redirect to dashboard directly if server logs in user and sets cookie
      setTimeout(() => window.location.href = 'index.html', 1400);

    } catch (err) {
      console.error('Network or server error during signup:', err);
      showFormError('Network error. Please try again later.', form);
    }
  });

  // Remove error when user starts typing
  form.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', () => {
      inp.classList.remove('input-error');
      const msg = inp.parentElement.querySelector('.error-msg');
      if (msg) msg.remove();
    });
  });

  // Helper functions
  function showValidationErrors(errors, containerForm) {
    Object.keys(errors).forEach(key => {
      const message = errors[key];
      const el = containerForm.querySelector(`[name="${key}"]`) || document.getElementById(key);
      if (el) setFieldError(el, message);
      // special-case checkbox
      if (key === 'agreeTerms') {
        const cb = containerForm.querySelector('#agreeTerms');
        if (cb) setFieldError(cb, errors[key]);
      }
    });
  }

  function showFormError(message, containerForm) {
    // global form-level error displayed on top of the form when no field chosen
    // create or reuse a small banner
    let banner = containerForm.querySelector('.form-error-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'form-error-banner';
      banner.style.color = '#ffffff';
      banner.style.background = 'linear-gradient(90deg, #ff5f6d, #ffc371)';
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
    }, 3000);
  }
});
