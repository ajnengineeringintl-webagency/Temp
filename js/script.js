// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.collection-item, .about-text, .contact-content').forEach(el => {
    observer.observe(el);
});

// Add animate-in class styles dynamically
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.8s ease-out;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Enhanced hover effects for collection items
document.querySelectorAll('.collection-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Button click animations
document.querySelectorAll('.cta-button, .add-to-cart, .submit-button').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 500);
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add loaded class styles
const loadedStyle = document.createElement('style');
loadedStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(loadedStyle);

// Enhanced Product Functionality
class ProductManager {
    constructor() {
        this.products = [];
        this.cart = [];
        this.init();
    }

    init() {
        this.setupProducts();
        this.setupProductInteractions();
        this.createQuickViewModal();
    }

    setupProducts() {
        // Initialize products from DOM
        const productElements = document.querySelectorAll('.collection-item');
        productElements.forEach((element, index) => {
            const product = {
                id: index + 1,
                name: element.querySelector('h3').textContent,
                price: element.querySelector('.price').textContent,
                image: element.querySelector('.product-img'),
                element: element
            };
            this.products.push(product);
        });
    }

    setupProductInteractions() {
        // Add to cart functionality
        document.querySelectorAll('.add-to-cart').forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.addToCart(this.products[index]);
            });
        });

        // Quick view functionality
        document.querySelectorAll('.quick-view').forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.showQuickView(this.products[index]);
            });
        });
    }

    addToCart(product) {
        // Add to cart logic
        this.cart.push(product);
        
        // Show success notification
        this.showNotification(`${product.name} added to cart!`, 'success');
        
        // Add cart animation
        const button = product.element.querySelector('.add-to-cart');
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.style.background = '#27ae60';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 1500);
    }

    showQuickView(product) {
        // Create modal if it doesn't exist
        if (!this.modal) {
            this.createQuickViewModal();
        }
        
        // Populate modal content
        this.populateQuickViewModal(product);
        
        // Show modal
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    createQuickViewModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'quick-view-modal';
        this.modal.innerHTML = `
            <div class="quick-view-content">
                <div class="quick-view-header">
                    <button class="close-quick-view">&times;</button>
                </div>
                <div class="quick-view-body">
                    <div class="quick-view-image">
                        <img src="" alt="Product Image">
                    </div>
                    <div class="quick-view-details">
                        <h2 class="product-name"></h2>
                        <p class="product-price"></p>
                        <p class="product-description">Premium quality fashion item with contemporary design and attention to detail.</p>
                        <div class="product-options">
                            <div class="size-selector">
                                <label>Size:</label>
                                <select class="size-select">
                                    <option value="XS">XS</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                </select>
                            </div>
                            <div class="quantity-selector">
                                <label>Quantity:</label>
                                <input type="number" class="quantity-input" min="1" value="1">
                            </div>
                        </div>
                        <button class="add-to-cart-modal">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);
        
        // Close modal functionality
        const closeBtn = this.modal.querySelector('.close-quick-view');
        closeBtn.addEventListener('click', () => this.closeQuickView());
        
        // Close on background click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeQuickView();
            }
        });
    }

    populateQuickViewModal(product) {
        const modalImage = this.modal.querySelector('.quick-view-image img');
        const modalName = this.modal.querySelector('.product-name');
        const modalPrice = this.modal.querySelector('.product-price');
        const addToCartBtn = this.modal.querySelector('.add-to-cart-modal');
        
        modalImage.src = product.image.src;
        modalImage.alt = product.name;
        modalName.textContent = product.name;
        modalPrice.textContent = product.price;
        
        // Add to cart from modal
        addToCartBtn.addEventListener('click', () => {
            const quantity = this.modal.querySelector('.quantity-input').value;
            const size = this.modal.querySelector('.size-select').value;
            
            for (let i = 0; i < quantity; i++) {
                this.addToCart(product);
            }
            
            this.closeQuickView();
            this.showNotification(`${quantity} x ${product.name} (Size: ${size}) added to cart!`, 'success');
        });
    }

    closeQuickView() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    showNotification(message, type) {
        // Create notification if it doesn't exist
        if (!this.notification) {
            this.notification = document.createElement('div');
            this.notification.className = 'notification';
            document.body.appendChild(this.notification);
        }
        
        this.notification.textContent = message;
        this.notification.className = `notification notification-${type}`;
        this.notification.style.display = 'block';
        
        setTimeout(() => {
            this.notification.style.display = 'none';
        }, 3000);
    }
}

// Enhanced Contact Form Validation and Feedback
class ContactFormManager {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.inputs = this.form.querySelectorAll('input, textarea');
        this.init();
    }

    init() {
        this.setupValidation();
        this.setupFormSubmission();
        this.setupInputValidation();
    }

    setupValidation() {
        const validationRules = {
            name: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Z\s]+$/
            },
            email: {
                required: true,
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 500
            }
        };

        this.validationRules = validationRules;
    }

    setupInputValidation() {
        this.inputs.forEach(input => {
            // Add real-time validation
            input.addEventListener('input', () => {
                this.validateInput(input);
            });

            // Add focus/blur effects
            input.addEventListener('focus', () => {
                this.addFocusStyles(input);
            });

            input.addEventListener('blur', () => {
                this.removeFocusStyles(input);
                this.validateInput(input);
            });
        });
    }

    validateInput(input) {
        const fieldName = this.getFieldName(input);
        const value = input.value.trim();
        const rules = this.validationRules[fieldName];
        let isValid = true;
        let errorMessage = '';

        if (!rules) return true;

        // Check required
        if (rules.required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Check pattern
        if (rules.pattern && value && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = this.getPatternError(fieldName);
        }

        // Check min length
        if (rules.minLength && value && value.length < rules.minLength) {
            isValid = false;
            errorMessage = `Minimum ${rules.minLength} characters required`;
        }

        // Check max length
        if (rules.maxLength && value && value.length > rules.maxLength) {
            isValid = false;
            errorMessage = `Maximum ${rules.maxLength} characters allowed`;
        }

        this.updateInputUI(input, isValid, errorMessage);
        return isValid;
    }

    getFieldName(input) {
        const placeholder = input.placeholder;
        if (placeholder.includes('Name')) return 'name';
        if (placeholder.includes('Email')) return 'email';
        if (placeholder.includes('Message')) return 'message';
        return input.name || input.type;
    }

    getPatternError(fieldName) {
        switch (fieldName) {
            case 'name':
                return 'Please enter a valid name (letters only)';
            case 'email':
                return 'Please enter a valid email address';
            default:
                return 'Invalid format';
        }
    }

    updateInputUI(input, isValid, errorMessage) {
        // Remove existing error messages
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Update input styles
        if (isValid) {
            input.classList.remove('error');
            input.classList.add('valid');
        } else {
            input.classList.add('error');
            input.classList.remove('valid');
            
            // Add error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            input.parentElement.appendChild(errorDiv);
        }
    }

    addFocusStyles(input) {
        input.parentElement.classList.add('focused');
    }

    removeFocusStyles(input) {
        input.parentElement.classList.remove('focused');
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                this.submitForm();
            } else {
                this.showNotification('Please check the form for errors', 'error');
            }
        });
    }

    validateForm() {
        let isValid = true;
        this.inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        return isValid;
    }

    submitForm() {
        const button = this.form.querySelector('.submit-button');
        const originalHTML = button.innerHTML;
        
        // Show loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        button.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Success state
            button.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            button.style.background = '#27ae60';
            
            // Show success notification
            this.showNotification('Thank you for your message! We will get back to you soon.', 'success');
            
            // Reset form after delay
            setTimeout(() => {
                this.resetForm();
                button.innerHTML = originalHTML;
                button.style.background = '';
                button.disabled = false;
            }, 3000);
            
        }, 1500);
    }

    resetForm() {
        this.form.reset();
        this.inputs.forEach(input => {
            input.classList.remove('valid', 'error');
            const errorMsg = input.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Initialize Product Manager
const productManager = new ProductManager();
console.log('Product Manager initialized');

// Initialize Contact Form Manager
const contactFormManager = new ContactFormManager();
console.log('Contact Form Manager initialized');

// Test functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    
    // Test collection items
    const collectionItems = document.querySelectorAll('.collection-item');
    console.log(`Found ${collectionItems.length} collection items`);
    
    // Test contact form
    const contactForm = document.querySelector('.contact-form');
    console.log(`Contact form: ${contactForm ? 'Found' : 'Not found'}`);
});