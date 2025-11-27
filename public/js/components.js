// components.js - categories, courses, testimonials + Business page link

// Local fallback image (you uploaded this earlier; it's used if remote images fail)
const LOCAL_FALLBACK = "/mnt/data/sa.png";

// Categories Data (using Unsplash URLs)
const categories = [
    {
        name: 'Business',
        courses: "4+",
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
        link: 'business.html' // 👉 when clicked, go to business page
    },
    
    {
        name: 'Artificial Intelligence',
        courses: "4+",
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
        link: 'ai.html'
    },
    
    {
        name: 'Data Science',
        courses: "4+",
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
        link: 'data-science.html' 
    },
    
    {
        name: 'Web Development',
        courses: "4+",
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
        link: 'web-development.html'
    },
    
    {
        name: 'Mobile Development',
        courses: "4+",
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c',
        link: 'mobile-development.html' 
    },
    
    { name: 'Design', courses: 920, image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5' },
    { name: 'Marketing', courses: 740, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f' },
    { name: 'Finance', courses: 580, image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e' },
    { name: 'Health & Wellness', courses: 450, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773' },
    { name: 'Languages', courses: 620, image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d' },
    { name: 'Photography', courses: 380, image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d' },
    { name: 'Music', courses: 340, image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d' }
];

// Trending & Featured sample data (price fields removed intentionally)
const trendingCourses = [
    { title: 'Machine Learning Specialization', instructor: 'Andrew Ng', category: 'AI', rating: 4.9, reviews: 25000, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995' },
    { title: 'Full Stack Web Development', instructor: 'Angela Yu', category: 'Web Dev', rating: 4.8, reviews: 18000, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085' },
    { title: 'Data Science Professional Certificate', instructor: 'IBM', category: 'Data Science', rating: 4.7, reviews: 15000, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71' },
    { title: 'UX/UI Design Bootcamp', instructor: 'Sarah Chen', category: 'Design', rating: 4.9, reviews: 12000, image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5' }
];

const featuredCourses = [
    { title: 'Python for Everybody', instructor: 'Dr. Charles Severance', category: 'Programming', rating: 4.8, reviews: 50000, image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935' },
    { title: 'Digital Marketing Masterclass', instructor: 'Neil Patel', category: 'Marketing', rating: 4.7, reviews: 22000, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f' },
    { title: 'iOS App Development', instructor: 'Angela Yu', category: 'Mobile', rating: 4.8, reviews: 16000, image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c' },
    { title: 'Financial Markets', instructor: 'Yale University', category: 'Finance', rating: 4.9, reviews: 35000, image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e' }
];

const testimonials = [
    { name: 'Sarah Johnson', role: 'Data Analyst at Tech Corp', image: 'https://images.unsplash.com/photo-1649589244330-09ca58e4fa64', testimonial: 'SkillLoop helped me transition into data analytics...' , rating: 5 },
    { name: 'Michael Chen', role: 'Software Developer', image: 'https://images.unsplash.com/photo-1701980889802-55ff39e2e973', testimonial: 'The flexibility to learn at my own pace...', rating: 5 },
    { name: 'Emma Williams', role: 'Product Manager', image: 'https://images.unsplash.com/photo-1762341116897-921e2a52f7ff', testimonial: 'The professional certificates from top universities...', rating: 5 }
];

function slugify(text) {
    return text.toString().toLowerCase()
        .trim()
        .replace(/&/g, '-and-')
        .replace(/[\s\W-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function safeImageUrl(baseUrl) {
    if (!baseUrl) return LOCAL_FALLBACK;
    const hasQuery = baseUrl.indexOf('?') !== -1;
    const params = 'auto=format&fit=crop&w=1200&q=80';
    return hasQuery ? baseUrl + '&' + params : baseUrl + '?' + params;
}

// Render categories
function renderCategories() {
    const grid = document.getElementById('categoryGrid');
    if (!grid) {
        console.warn('renderCategories: #categoryGrid not found');
        return;
    }

    grid.innerHTML = categories.map(cat => {
        const id = slugify(cat.name);
        const imgSrc = safeImageUrl(cat.image);
        const href = cat.link || '#';
        return `
            <a class="category-card" id="${id}" href="${href}">
                <img src="${imgSrc}" alt="${cat.name}" loading="lazy"
                    onerror="this.dataset.fallbackApplied ? null : (this.dataset.fallbackApplied='1', this.src='${LOCAL_FALLBACK}')">
                <div class="category-overlay">
                    <h3>${cat.name}</h3>
                    <p>${cat.courses.toLocaleString()} courses</p>
                </div>
            </a>
        `;
    }).join('');
}

// Render course lists
function renderCourses(courses, containerId) {
    const grid = document.getElementById(containerId);
    if (!grid) {
        console.warn(`renderCourses: #${containerId} not found`);
        return;
    }

    grid.innerHTML = courses.map(course => {
        const imgSrc = safeImageUrl(course.image);
        return `
            <div class="course-card">
                <img src="${imgSrc}" alt="${escapeHtml(course.title)}"
                     class="course-image" loading="lazy"
                     onerror="this.dataset.fallbackApplied ? null : (this.dataset.fallbackApplied='1', this.src='${LOCAL_FALLBACK}')">
                <div class="course-content">
                    <span class="course-category">${escapeHtml(course.category)}</span>
                    <h3>${escapeHtml(course.title)}</h3>
                    <p class="course-instructor">By ${escapeHtml(course.instructor)}</p>
                    <div class="course-footer">
                        <div class="course-rating">
                            <span class="stars">
                                ${'★'.repeat(Math.floor(course.rating))}${'☆'.repeat(5 - Math.floor(course.rating))}
                            </span>
                            <span>${course.rating} (${course.reviews.toLocaleString()})</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderTestimonials() {
    const grid = document.getElementById('testimonialGrid');
    if (!grid) {
        console.warn('renderTestimonials: #testimonialGrid not found');
        return;
    }

    grid.innerHTML = testimonials.map(t => {
        const imgSrc = safeImageUrl(t.image);
        return `
            <div class="testimonial-card">
                <div class="quote-icon">"</div>
                <div class="testimonial-profile">
                    <img src="${imgSrc}" alt="${escapeHtml(t.name)}"
                         class="profile-image" loading="lazy"
                         onerror="this.dataset.fallbackApplied ? null : (this.dataset.fallbackApplied='1', this.src='${LOCAL_FALLBACK}')">
                    <div class="profile-info">
                        <h4>${escapeHtml(t.name)}</h4>
                        <p>${escapeHtml(t.role)}</p>
                    </div>
                </div>
                <div class="testimonial-rating">${'★'.repeat(t.rating)}</div>
                <p class="testimonial-text">"${escapeHtml(t.testimonial)}"</p>
            </div>
        `;
    }).join('');
}

// small helper to avoid XSS in templates
function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Auto-render on pages that have the grids
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('categoryGrid')) {
        renderCategories();
    }
    if (document.getElementById('trendingGrid')) {
        renderCourses(trendingCourses, 'trendingGrid');
    }
    if (document.getElementById('featuredGrid')) {
        renderCourses(featuredCourses, 'featuredGrid');
    }
    if (document.getElementById('testimonialGrid')) {
        renderTestimonials();
    }
});
