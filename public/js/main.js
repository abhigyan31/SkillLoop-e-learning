// main.js
// Initialization and UI behaviors (safe-calling render functions, smooth scroll + highlight)

function callWhenAvailable(fnName, callback, interval = 100, maxTries = 20) {
    let tries = 0;
    const id = setInterval(() => {
        tries++;
        if (typeof window[fnName] === 'function') {
            clearInterval(id);
            callback();
        } else if (tries >= maxTries) {
            clearInterval(id);
            console.error(`${fnName} not found after waiting. Check script order or errors in its file.`);
        }
    }, interval);
}

document.addEventListener('DOMContentLoaded', function () {
    // Safely run renderCategories (components.js)
    if (typeof renderCategories === 'function') {
        renderCategories();
    } else {
        callWhenAvailable('renderCategories', () => {
            try { renderCategories(); } catch (err) { console.error('Error executing renderCategories:', err); }
        });
    }

    // Render course blocks if available
    if (typeof renderCourses === 'function') {
        try {
            renderCourses(trendingCourses, 'trendingCoursesGrid');
            renderCourses(featuredCourses, 'featuredCoursesGrid');
        } catch (err) {
            console.error('Error executing renderCourses:', err);
        }
    } else {
        callWhenAvailable('renderCourses', () => {
            try {
                renderCourses(trendingCourses, 'trendingCoursesGrid');
                renderCourses(featuredCourses, 'featuredCoursesGrid');
            } catch (err) { console.error('Error executing renderCourses:', err); }
        });
    }

    // Testimonials
    if (typeof renderTestimonials === 'function') {
        try { renderTestimonials(); } catch (err) { console.error('Error executing renderTestimonials:', err); }
    } else {
        callWhenAvailable('renderTestimonials', () => {
            try { renderTestimonials(); } catch (err) { console.error('Error executing renderTestimonials:', err); }
        });
    }

    // Newsletter form handling (guarded)
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailEl = document.getElementById('newsletterEmail');
            const email = emailEl ? emailEl.value : '';
            alert(`Thank you for subscribing! We'll send updates to ${email}`);
            newsletterForm.reset();
        });
    }

    // Smooth scrolling for same-page hash links + highlight target card briefly
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || !href.startsWith('#')) return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            // Scroll into view and briefly highlight
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            target.classList.add('highlight');
            setTimeout(() => target.classList.remove('highlight'), 2000);

            // Optional: close dropdowns if you use JS to control them
            // const openMenu = document.querySelector('.dropdown-menu.show');
            // if (openMenu) openMenu.classList.remove('show');
        });
    });

    // Mobile menu toggle (optional) — fixed selector to .nav-links
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function () {
            document.querySelector('.nav-links')?.classList.toggle('open');
        });
    }

    // Header scroll shadow effect
    window.addEventListener('scroll', function () {
        const header = document.querySelector('.header');
        const currentScroll = window.pageYOffset;
        if (header) {
            if (currentScroll > 100) header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            else header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
    });
});
