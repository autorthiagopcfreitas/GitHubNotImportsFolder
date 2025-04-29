// Animation effects for parallax sections
document.addEventListener('DOMContentLoaded', function() {
    // Animation options
    const animationOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px"
    };

    // Animation variations for different sections
    const animations = [
        // First section animations
        {
            heading: { class: 'flipInX', duration: '1.2s', delay: '0s' },
            subtext: { class: 'fadeInUp', duration: '1.5s', delay: '0.3s' },
            quote: { class: 'fadeIn', duration: '2s', delay: '0.8s' }
        },
        // Second section animations
        {
            heading: { class: 'bounceIn', duration: '1.3s', delay: '0s' },
            subtext: { class: 'fadeInLeft', duration: '1.4s', delay: '0.4s' },
            quote: { class: 'fadeInRight', duration: '1.6s', delay: '0.9s' }
        },
        // Third section animations
        {
            heading: { class: 'zoomIn', duration: '1.1s', delay: '0s' },
            subtext: { class: 'slideInUp', duration: '1.3s', delay: '0.3s' },
            quote: { class: 'fadeIn', duration: '1.8s', delay: '0.7s' }
        },
        // Fourth section animations
        {
            heading: { class: 'rotateIn', duration: '1.4s', delay: '0s' },
            subtext: { class: 'fadeInDown', duration: '1.5s', delay: '0.5s' },
            quote: { class: 'bounceIn', duration: '1.7s', delay: '1s' }
        }
    ];

    // Create an intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                const contentBox = section.querySelector('.content-box');
                
                if (!contentBox) return;
                
                const heading = contentBox.querySelector('h1');
                const subtext = contentBox.querySelector('.passions-subtext');
                const quote = contentBox.querySelector('.quote');
                
                // Get section index for animation variation
                const sections = Array.from(document.querySelectorAll('.parallax-section'));
                const sectionIndex = sections.indexOf(section);
                const animationSet = animations[sectionIndex % animations.length];
                
                // Apply different animations to each element
                if (heading && animationSet.heading) {
                    heading.classList.add('animate__animated', `animate__${animationSet.heading.class}`);
                    heading.style.animationDuration = animationSet.heading.duration;
                    heading.style.animationDelay = animationSet.heading.delay;
                    heading.style.opacity = '1';
                }
                
                if (subtext && animationSet.subtext) {
                    subtext.classList.add('animate__animated', `animate__${animationSet.subtext.class}`);
                    subtext.style.animationDuration = animationSet.subtext.duration;
                    subtext.style.animationDelay = animationSet.subtext.delay;
                    subtext.style.opacity = '1';
                }
                
                if (quote && animationSet.quote) {
                    quote.classList.add('animate__animated', `animate__${animationSet.quote.class}`);
                    quote.style.animationDuration = animationSet.quote.duration;
                    quote.style.animationDelay = animationSet.quote.delay;
                    quote.style.opacity = '1';
                }
                
                // Add a special effect to the content box
                contentBox.classList.add('animate__animated', 'animate__fadeIn');
                contentBox.style.animationDuration = '1s';
                
                // Stop observing after animation is applied
                observer.unobserve(section);
            }
        });
    }, animationOptions);

    // Observe all parallax sections
    document.querySelectorAll('.parallax-section').forEach(section => {
        observer.observe(section);
    });

    // Add special animation for the hero section
    const heroSection = document.getElementById('home');
    if (heroSection) {
        const heroContent = heroSection.querySelector('.hero-content');
        const heroImage = heroSection.querySelector('.hero-image');
        
        if (heroContent) {
            const heroHeading = heroContent.querySelector('h1');
            const heroLead = heroContent.querySelector('.lead');
            const heroButton = heroContent.querySelector('.whatsapp-btn');
            
            if (heroHeading) {
                heroHeading.classList.add('animate__animated', 'animate__fadeInDown');
                heroHeading.style.animationDuration = '1.2s';
            }
            
            if (heroLead) {
                heroLead.classList.add('animate__animated', 'animate__fadeInUp');
                heroLead.style.animationDuration = '1.2s';
                heroLead.style.animationDelay = '0.3s';
            }
            
            if (heroButton) {
                heroButton.classList.add('animate__animated', 'animate__pulse');
                heroButton.style.animationDuration = '1s';
                heroButton.style.animationDelay = '1s';
                heroButton.style.animationIterationCount = 'infinite';
            }
        }
        
        if (heroImage) {
            heroImage.classList.add('animate__animated', 'animate__fadeIn');
            heroImage.style.animationDuration = '1.5s';
        }
    }
});

// Add hover effects to content boxes
document.addEventListener('DOMContentLoaded', function() {
    const contentBoxes = document.querySelectorAll('.content-box');
    
    contentBoxes.forEach(box => {
        box.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.transition = 'transform 0.3s ease-out';
        });
        
        box.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.transition = 'transform 0.3s ease-out';
        });
    });
});