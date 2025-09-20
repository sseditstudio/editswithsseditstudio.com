// SS Edit Studio - Professional Video Editing Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Loading animation
    const loader = document.getElementById('loader');
    
    // Hide loader after page loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    });

    // Navigation functionality
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    function smoothScroll(target, duration = 1000) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;

        const targetPosition = targetElement.offsetTop - 70; // Account for fixed navbar
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // Add smooth scrolling to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target && target.startsWith('#')) {
                smoothScroll(target);
            }
        });
    });

    // Hero CTA button smooth scroll
    const heroCta = document.querySelector('.hero-cta');
    if (heroCta) {
        heroCta.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-scroll');
            if (target && target.startsWith('#')) {
                smoothScroll(target);
            }
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Portfolio filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                } else {
                    item.classList.add('hidden');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Skill bars animation
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillsSection = document.getElementById('skills');

    function animateSkillBars() {
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        });
    }

    // Intersection Observer for skill bars
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
            }
        });
    }, { threshold: 0.3 });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // Form validation and submission
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form elements
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const projectType = document.getElementById('project-type');
        const budget = document.getElementById('budget');
        const message = document.getElementById('message');
        
        // Reset previous error states
        clearErrors();
        
        let isValid = true;
        
        // Validation with proper error display
        if (!name.value.trim()) {
            showError(name, 'Name is required');
            isValid = false;
        }
        
        if (!email.value.trim()) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!projectType.value) {
            showError(projectType, 'Please select a project type');
            isValid = false;
        }
        
        if (!budget.value) {
            showError(budget, 'Please select a budget range');
            isValid = false;
        }
        
        if (!message.value.trim()) {
            showError(message, 'Message is required');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError(message, 'Message must be at least 10 characters long');
            isValid = false;
        }
        
        if (isValid) {
            // Create mailto link with form data
            const subject = encodeURIComponent(`New Project Inquiry - ${projectType.value}`);
            const body = encodeURIComponent(
                `Hi SS Edit Studio,\n\n` +
                `Name: ${name.value}\n` +
                `Email: ${email.value}\n` +
                `Project Type: ${projectType.value}\n` +
                `Budget Range: ${budget.value}\n\n` +
                `Message:\n${message.value}\n\n` +
                `Best regards,\n${name.value}`
            );
            const mailtoLink = `mailto:editswithssedits@gmail.com?subject=${subject}&body=${body}`;
            
            // Open email client
            window.open(mailtoLink, '_blank');
            
            // Show success message
            showSuccessMessage();
            // Reset form
            contactForm.reset();
        } else {
            // Scroll to first error
            const firstError = contactForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    function showError(element, message) {
        element.classList.add('error');
        element.style.borderColor = '#ff6b35';
        element.style.backgroundColor = 'rgba(255, 107, 53, 0.05)';
        
        // Remove existing error message if any
        const existingError = element.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ff6b35;
            font-size: 12px;
            margin-top: 5px;
            display: block;
            font-weight: 500;
        `;
        element.parentNode.appendChild(errorDiv);
    }

    function clearErrors() {
        const errorElements = document.querySelectorAll('.error');
        const errorMessages = document.querySelectorAll('.error-message');
        
        errorElements.forEach(el => {
            el.classList.remove('error');
            el.style.borderColor = '';
            el.style.backgroundColor = '';
        });
        errorMessages.forEach(msg => msg.remove());
        
        // Clear any existing success messages
        const successMessages = document.querySelectorAll('.success-message');
        successMessages.forEach(msg => msg.remove());
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showSuccessMessage() {
        // Remove any existing success messages
        const existingSuccess = contactForm.querySelector('.success-message');
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div style="
                background: rgba(255, 107, 53, 0.1); 
                border: 1px solid rgba(255, 107, 53, 0.3); 
                color: #ff6b35; 
                padding: 15px; 
                border-radius: 8px; 
                margin-top: 20px; 
                text-align: center;
                animation: slideInUp 0.5s ease-out;
            ">
                <strong>✓ Thank you!</strong> Your email client should open shortly. If not, you can reach us directly at: 
                <a href="mailto:editswithssedits@gmail.com" style="color: #ff6b35; font-weight: bold;">editswithssedits@gmail.com</a>
            </div>
        `;
        
        contactForm.appendChild(successDiv);
        
        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove success message after 10 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 10000);
    }

    // Demo reel video placeholder interaction
    const demoVideo = document.querySelector('.video-placeholder');
    if (demoVideo) {
        demoVideo.addEventListener('click', function() {
            showDemoModal();
        });
    }

    function showDemoModal() {
        const modal = document.createElement('div');
        modal.className = 'demo-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>SS Edit Studio - Demo Reel</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="video-placeholder-modal">
                            <div class="play-icon" style="font-size: 60px; margin-bottom: 20px;">▶</div>
                            <p><strong>Professional Demo Reel</strong></p>
                            <p style="color: var(--color-text-secondary); font-size: 14px; margin-top: 15px;">This showcases SS Edit Studio's best work including:</p>
                            <ul style="text-align: left; color: var(--color-text-secondary); font-size: 14px; margin-top: 10px;">
                                <li>MS Production Logo Animation (4K)</li>
                                <li>Motion Graphics & Animations</li>
                                <li>Color Grading Examples</li>
                                <li>Social Media Content Creation</li>
                                <li>Commercial Projects</li>
                                <li>Audio Enhancement Work</li>
                            </ul>
                            <p style="color: var(--color-text-secondary); font-size: 12px; margin-top: 15px; font-style: italic;">
                                Contact us at editswithssedits@gmail.com to see our full portfolio
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const overlay = modal.querySelector('.modal-overlay');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        `;
        
        const content = modal.querySelector('.modal-content');
        content.style.cssText = `
            position: relative;
            background: var(--color-surface);
            border-radius: 15px;
            max-width: 600px;
            width: 90%;
            max-height: 90%;
            border: 1px solid var(--color-border);
            animation: modalSlideIn 0.3s ease-out;
        `;
        
        const header = modal.querySelector('.modal-header');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid var(--color-border);
        `;
        
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 30px;
            color: var(--color-text);
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.3s ease;
        `;
        
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.color = 'var(--color-primary)';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.color = 'var(--color-text)';
        });
        
        const body = modal.querySelector('.modal-body');
        body.style.cssText = `
            padding: 30px 20px;
            text-align: center;
        `;
        
        const videoPlaceholder = modal.querySelector('.video-placeholder-modal');
        videoPlaceholder.style.cssText = `
            width: 100%;
            min-height: 300px;
            background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 2px dashed var(--color-border);
            color: var(--color-text);
            padding: 20px;
        `;
        
        // Add modal slide-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-50px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(modal);
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    // Scroll animations for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply scroll animations to various elements
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card, .about-text, .about-image');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Parallax effect for background images (disabled on mobile for performance)
    function handleParallax() {
        if (window.innerWidth > 768) {
            const scrolled = window.pageYOffset;
            const heroBackground = document.querySelector('.hero-background');
            if (heroBackground && scrolled < window.innerHeight) {
                heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        }
    }

    window.addEventListener('scroll', handleParallax);

    // Active navigation highlight based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // Portfolio item hover effects and modal
    const portfolioItems2 = document.querySelectorAll('.portfolio-item');
    portfolioItems2.forEach(item => {
        const viewBtn = item.querySelector('.btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showPortfolioModal(item);
            });
        }
    });

    function showPortfolioModal(portfolioItem) {
        const title = portfolioItem.querySelector('h3').textContent;
        const description = portfolioItem.querySelector('p').textContent;
        const tags = Array.from(portfolioItem.querySelectorAll('.tag')).map(tag => tag.textContent);
        const category = portfolioItem.getAttribute('data-category');
        
        let projectDetails = '';
        switch(category) {
            case 'Logo Design':
                projectDetails = 'This logo animation project showcases dynamic motion graphics with professional 4K quality output, perfect for cinema and branding applications.';
                break;
            case 'Social Media':
                projectDetails = 'Complete social media content package optimized for various platforms including Instagram, YouTube, and TikTok with engaging visual elements.';
                break;
            case 'Commercial':
                projectDetails = 'Professional commercial video editing with advanced color grading, smooth transitions, and compelling storytelling for maximum impact.';
                break;
            case 'Motion Graphics':
                projectDetails = 'Creative motion graphics and animation work showcasing technical proficiency in After Effects and advanced animation techniques.';
                break;
            case 'Color Grading':
                projectDetails = 'Professional color grading and correction services to enhance visual appeal and achieve cinematic quality in your video content.';
                break;
            case 'Audio':
                projectDetails = 'Professional audio enhancement including cleanup, mixing, sound design, and post-production for crystal clear audio quality.';
                break;
            default:
                projectDetails = description;
        }
        
        const modal = document.createElement('div');
        modal.className = 'portfolio-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="project-placeholder">
                            <div style="width: 100%; height: 200px; background: linear-gradient(135deg, var(--color-primary), #ff8a50); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; margin-bottom: 20px;">
                                ${category} Project
                            </div>
                            <p style="font-size: 16px; color: var(--color-text); margin-bottom: 15px;"><strong>Project Overview:</strong></p>
                            <p style="color: var(--color-text-secondary); line-height: 1.6; margin-bottom: 15px;">${description}</p>
                            <p style="color: var(--color-text-secondary); line-height: 1.6;">${projectDetails}</p>
                            <div class="project-tags" style="display: flex; gap: 10px; flex-wrap: wrap; margin: 20px 0; justify-content: center;">
                                ${tags.map(tag => `<span class="tag" style="background: rgba(255, 107, 53, 0.1); color: var(--color-primary); padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: 500; border: 1px solid rgba(255, 107, 53, 0.2);">${tag}</span>`).join('')}
                            </div>
                            <div style="background: rgba(255, 107, 53, 0.05); padding: 15px; border-radius: 8px; margin-top: 20px;">
                                <p style="color: var(--color-text-secondary); font-size: 14px; margin: 0; font-style: italic;">
                                    Interested in similar work? Contact SS Edit Studio at 
                                    <a href="mailto:editswithssedits@gmail.com" style="color: var(--color-primary); font-weight: bold;">editswithssedits@gmail.com</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Apply modal styling
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const overlay = modal.querySelector('.modal-overlay');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        `;
        
        const content = modal.querySelector('.modal-content');
        content.style.cssText = `
            position: relative;
            background: var(--color-surface);
            border-radius: 15px;
            max-width: 600px;
            width: 90%;
            max-height: 90%;
            border: 1px solid var(--color-border);
            animation: modalSlideIn 0.3s ease-out;
        `;
        
        const header = modal.querySelector('.modal-header');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid var(--color-border);
        `;
        
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 30px;
            color: var(--color-text);
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.3s ease;
        `;
        
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.color = 'var(--color-primary)';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.color = 'var(--color-text)';
        });
        
        const body = modal.querySelector('.modal-body');
        body.style.cssText = `
            padding: 30px 20px;
            text-align: center;
            max-height: 60vh;
            overflow-y: auto;
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(modal);
            }
        });
        
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    // Initialize skill bars on page load if already in viewport
    const skillsRect = skillsSection?.getBoundingClientRect();
    if (skillsRect && skillsRect.top < window.innerHeight && skillsRect.bottom > 0) {
        setTimeout(animateSkillBars, 1500);
    }

    // Contact email links functionality
    const contactEmailLinks = document.querySelectorAll('a[href^="mailto:editswithssedits@gmail.com"]');
    contactEmailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Let the default mailto behavior work, but also show a subtle confirmation
            setTimeout(() => {
                console.log('Opening email client to contact SS Edit Studio...');
            }, 100);
        });
    });

    console.log('SS Edit Studio Portfolio Website Loaded Successfully!');
    console.log('Contact: editswithssedits@gmail.com');
});