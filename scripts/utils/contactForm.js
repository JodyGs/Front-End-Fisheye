function displayModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "block";
    modal.setAttribute('aria-hidden', 'false');
    
    const firstInput = modal.querySelector('#first-name');
    if (firstInput) {
        firstInput.focus();
    }
    
    document.addEventListener('keydown', handleModalKeydown);
    
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', handleFormSubmit);
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    
    document.removeEventListener('keydown', handleModalKeydown);
    
    const form = document.getElementById('contact-form');
    form.removeEventListener('submit', handleFormSubmit);
    
    const contactButton = document.querySelector('.contact_button');
    if (contactButton) {
        contactButton.focus();
    }
}

function handleModalKeydown(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
    
    if (event.key === 'Tab') {
        const modal = document.getElementById("contact_modal");
        const focusableElements = modal.querySelectorAll('input, textarea, button, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const contactData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    console.log('Données du formulaire de contact:', contactData);
    
    closeModal();
    
    event.target.reset();
}
