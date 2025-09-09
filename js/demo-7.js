const contactForm = document.getElementById('contact-form');
const contactFormContainer = contactForm.querySelector('.contact-form-container');
const contactFormLink = document.getElementById('contact-form-link');

contactFormLink.addEventListener('click', () => {
	contactForm.classList.add('show');
});

contactForm.addEventListener('click', () => {
	contactForm.classList.remove('show');
});

contactFormContainer.addEventListener('click', (e) => {
	e.stopPropagation();
});
