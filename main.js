/* ============================================
   Angelo Perone - Personal Branding Website
   JavaScript Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all modules
  Navigation.init();
  ScrollAnimations.init();
  ContactForm.init();
  NewsletterForm.init();
  SmoothScroll.init();
});

/* ============================================
   Navigation Module
   ============================================ */
const Navigation = {
  init() {
    this.nav = document.querySelector('.nav');
    this.toggle = document.querySelector('.nav-toggle');
    this.links = document.querySelector('.nav-links');
    this.navLinks = document.querySelectorAll('.nav-link');
    
    if (this.toggle && this.links) {
      this.bindEvents();
    }
    
    this.setActiveLink();
    this.handleScroll();
  },
  
  bindEvents() {
    // Mobile menu toggle
    this.toggle.addEventListener('click', () => this.toggleMenu());
    
    // Close menu when clicking a link
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.nav.contains(e.target) && this.links.classList.contains('active')) {
        this.closeMenu();
      }
    });
    
    // Handle scroll for nav background
    window.addEventListener('scroll', () => this.handleScroll());
  },
  
  toggleMenu() {
    this.toggle.classList.toggle('active');
    this.links.classList.toggle('active');
    document.body.style.overflow = this.links.classList.contains('active') ? 'hidden' : '';
  },
  
  closeMenu() {
    this.toggle.classList.remove('active');
    this.links.classList.remove('active');
    document.body.style.overflow = '';
  },
  
  setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  },
  
  handleScroll() {
    if (window.scrollY > 50) {
      this.nav.style.background = 'rgba(10, 10, 12, 0.95)';
    } else {
      this.nav.style.background = 'rgba(10, 10, 12, 0.85)';
    }
  }
};

/* ============================================
   Scroll Animations Module
   ============================================ */
const ScrollAnimations = {
  init() {
    this.elements = document.querySelectorAll('.fade-in');
    
    if (this.elements.length === 0) return;
    
    // Create intersection observer
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
      }
    );
    
    // Observe all elements
    this.elements.forEach(el => this.observer.observe(el));
  },
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        this.observer.unobserve(entry.target);
      }
    });
  }
};

/* ============================================
   Contact Form Module
   ============================================ */
const ContactForm = {
  init() {
    this.form = document.getElementById('contact-form');
    this.success = document.querySelector('.form-success');
    
    if (!this.form) return;
    
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  },
  
  handleSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);
    
    // Validate
    if (!this.validate(data)) return;
    
    // Simulate form submission
    this.showLoading();
    
    setTimeout(() => {
      this.hideLoading();
      this.showSuccess();
      this.form.reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        this.hideSuccess();
      }, 5000);
    }, 1500);
  },
  
  validate(data) {
    let isValid = true;
    
    // Clear previous errors
    this.clearErrors();
    
    // Validate name
    if (!data.name || data.name.trim().length < 2) {
      this.showError('name', 'Please enter your name');
      isValid = false;
    }
    
    // Validate email
    if (!data.email || !this.isValidEmail(data.email)) {
      this.showError('email', 'Please enter a valid email address');
      isValid = false;
    }
    
    // Validate message
    if (!data.message || data.message.trim().length < 10) {
      this.showError('message', 'Please enter a message (at least 10 characters)');
      isValid = false;
    }
    
    return isValid;
  },
  
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },
  
  showError(fieldName, message) {
    const field = this.form.querySelector(`[name="${fieldName}"]`);
    if (field) {
      field.style.borderColor = '#ef4444';
      
      const errorEl = document.createElement('span');
      errorEl.className = 'form-error';
      errorEl.style.color = '#ef4444';
      errorEl.style.fontSize = '0.85rem';
      errorEl.style.marginTop = '4px';
      errorEl.textContent = message;
      
      field.parentNode.appendChild(errorEl);
    }
  },
  
  clearErrors() {
    const errors = this.form.querySelectorAll('.form-error');
    errors.forEach(error => error.remove());
    
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => input.style.borderColor = '');
  },
  
  showLoading() {
    const btn = this.form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span class="loading-spinner"></span> Sending...';
  },
  
  hideLoading() {
    const btn = this.form.querySelector('button[type="submit"]');
    btn.disabled = false;
    btn.innerHTML = 'Send Message <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
  },
  
  showSuccess() {
    if (this.success) {
      this.success.classList.add('show');
    }
  },
  
  hideSuccess() {
    if (this.success) {
      this.success.classList.remove('show');
    }
  }
};

/* ============================================
   Newsletter Form Module
   ============================================ */
const NewsletterForm = {
  init() {
    this.forms = document.querySelectorAll('.newsletter-form');
    
    this.forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubmit(e, form));
    });
  },
  
  handleSubmit(e, form) {
    e.preventDefault();
    
    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button');
    
    if (!input || !input.value || !this.isValidEmail(input.value)) {
      input.style.borderColor = '#ef4444';
      return;
    }
    
    // Simulate submission
    btn.disabled = true;
    btn.textContent = 'Subscribing...';
    
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Subscribed!';
      btn.style.background = '#14b8a6';
      input.value = '';
      input.style.borderColor = '';
      
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.style.background = '';
      }, 3000);
    }, 1500);
  },
  
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
};

/* ============================================
   Smooth Scroll Module
   ============================================ */
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
          const navHeight = document.querySelector('.nav').offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
};

/* ============================================
   Utility Functions
   ============================================ */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
