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

const collaborate = document.getElementById('collaborate');
const collaborateLink = document.querySelectorAll('.collab-btn');

collaborateLink.forEach(link => {
	link.addEventListener('click', () => {
		contactForm.classList.add('show');
	});
});
