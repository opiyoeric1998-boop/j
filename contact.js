// Contact Form Handling with Formspree
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const currentYear = new Date().getFullYear();
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submitBtn');
    
    // Update copyright year
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
    
    // Set the email subject dynamically based on selected subject
    const subjectSelect = document.getElementById('subject');
    const emailSubject = document.getElementById('emailSubject');
    const replyTo = document.getElementById('replyTo');
    
    if (subjectSelect && emailSubject) {
        subjectSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const subjectText = selectedOption.text;
            emailSubject.value = `Jets Elementary: ${subjectText} Inquiry`;
        });
    }
    
    // Set reply-to email dynamically
    const emailInput = document.getElementById('email');
    if (emailInput && replyTo) {
        emailInput.addEventListener('input', function() {
            replyTo.value = this.value;
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form elements
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();
            
            // Validation
            if (!name || !email || !subject || !message) {
                showMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // Prepare form data
                const formData = new FormData(contactForm);
                
                // Send to Formspree
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success message
                    showMessage('Thank you for contacting Jets Elementary School! Your message has been sent successfully. We will get back to you shortly.', 'success');
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset the select to its default state
                    if (subjectSelect) {
                        subjectSelect.selectedIndex = 0;
                        emailSubject.value = 'New Message from Jets Elementary Contact Form';
                    }
                    
                    // Reset reply-to field
                    if (replyTo) {
                        replyTo.value = '';
                    }
                } else {
                    // Handle Formspree errors
                    const errorData = await response.json();
                    if (errorData.errors && errorData.errors.length > 0) {
                        showMessage('Error: ' + errorData.errors.map(error => error.message).join(', '), 'error');
                    } else {
                        showMessage('There was an error sending your message. Please try again later.', 'error');
                    }
                    console.error('Formspree error:', errorData);
                }
            } catch (error) {
                // Network error
                showMessage('Network error. Please check your internet connection and try again.', 'error');
                console.error('Network error:', error);
            } finally {
                // Reset button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Function to show messages
    function showMessage(text, type) {
        if (!formMessage) return;
        
        formMessage.textContent = text;
        formMessage.style.display = 'block';
        
        // Style based on message type
        if (type === 'success') {
            formMessage.style.backgroundColor = '#d4edda';
            formMessage.style.color = '#155724';
            formMessage.style.border = '1px solid #c3e6cb';
        } else if (type === 'error') {
            formMessage.style.backgroundColor = '#f8d7da';
            formMessage.style.color = '#721c24';
            formMessage.style.border = '1px solid #f5c6cb';
        }
        
        // Hide message after 8 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 8000);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});