'use strict';

// ============================================
// EMAILJS CONFIGURATION
// ============================================

const EMAILJS_CONFIG = {
    PUBLIC_KEY: '6vXIb6WfmdxQw5h-s',
    SERVICE_ID: 'service_d6exzqc',
    TEMPLATE_ID: 'template_9s321iq'
};

// ============================================
// EMAILJS CONTACT FORM - FIXED VERSION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS is not loaded!');
        return;
    }
    
    console.log('✅ EmailJS SDK loaded');
    
    // Initialize EmailJS
    try {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('✅ EmailJS initialized');
    } catch (error) {
        console.error('❌ Failed to initialize EmailJS:', error);
        return;
    }
    
    // Get the contact form
    const contactForm = document.querySelector("[data-form]");
    
    if (!contactForm) {
        console.error('❌ Contact form not found!');
        return;
    }
    
    console.log('✅ Contact form found');
    
    // Create status div
    const statusDiv = document.createElement('div');
    statusDiv.id = 'form-status';
    statusDiv.style.marginTop = '15px';
    statusDiv.style.display = 'none';
    statusDiv.style.padding = '12px';
    statusDiv.style.borderRadius = '8px';
    statusDiv.style.fontWeight = '500';
    contactForm.parentNode.insertBefore(statusDiv, contactForm.nextSibling);
    
    const formBtn = document.querySelector("[data-form-btn]");
    
    // Handle form submission
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        console.log('📤 Form submitted');
        
        if (!this.checkValidity()) {
            console.log('❌ Form validation failed');
            this.reportValidity();
            return;
        }
        
        // Get form data - FIXED: properly extract values
        const formData = new FormData(this);
        const fullname = formData.get('fullname');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Debug: Log the raw form data
        console.log('📤 Raw form data:', {
            fullname: fullname,
            email: email,
            message: message
        });
        
        // Show sending status
        statusDiv.style.display = 'block';
        statusDiv.innerHTML = '📤 Sending message...';
        statusDiv.style.backgroundColor = '#f0f7ff';
        statusDiv.style.color = '#0066cc';
        statusDiv.style.border = '1px solid #b3d4ff';
        
        if (formBtn) {
            formBtn.disabled = true;
            formBtn.innerHTML = '<ion-icon name="paper-plane"></ion-icon><span>Sending...</span>';
        }
        
        // Template parameters - using the correct variable names for EmailJS
        const templateParams = {
            from_name: fullname,    // This maps to {{from_name}} in template
            from_email: email,      // This maps to {{from_email}} in template
            message: message        // This maps to {{message}} in template
        };
        
        console.log('📤 Sending to EmailJS with params:', templateParams);
        
        // Send email using sendForm
        emailjs.sendForm(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            contactForm,
            EMAILJS_CONFIG.PUBLIC_KEY
        )
        .then(function(response) {
            console.log('✅ SUCCESS!', response);
            statusDiv.innerHTML = '✅ Message sent successfully! Check your email for a confirmation.';
            statusDiv.style.backgroundColor = '#f0fff4';
            statusDiv.style.color = '#2d8a4e';
            statusDiv.style.border = '1px solid #b3e6c6';
            contactForm.reset();
            
            if (formBtn) {
                formBtn.disabled = true;
                formBtn.innerHTML = '<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>';
            }
            
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 10000);
        })
        .catch(function(error) {
            console.error('❌ Error:', error);
            console.error('❌ Status:', error.status);
            console.error('❌ Text:', error.text);
            
            let errorMessage = '❌ ';
            if (error.status === 403 || error.message === 'Failed to fetch') {
                errorMessage += 'CORS error. Please add your domain to EmailJS allowed list.';
            } else if (error.status === 422) {
                errorMessage += 'Recipient email missing. Please set "To Email" in your EmailJS template.';
            } else if (error.text) {
                errorMessage += error.text;
            } else {
                errorMessage += 'Failed to send. Please try again.';
            }
            
            statusDiv.innerHTML = errorMessage;
            statusDiv.style.backgroundColor = '#fff5f5';
            statusDiv.style.color = '#c53030';
            statusDiv.style.border = '1px solid #feb2b2';
            
            if (formBtn) {
                formBtn.disabled = false;
                formBtn.innerHTML = '<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>';
            }
        });
    });
});

// ============================================
// YOUR ORIGINAL CODE - KEEP EVERYTHING BELOW
// ============================================

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
    testimonialsModalFunc();
  });
}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);
    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}

console.log('✅ Portfolio script loaded successfully!');