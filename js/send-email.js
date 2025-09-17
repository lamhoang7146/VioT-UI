(function () {
  emailjs.init({
    publicKey: "EfbZ0iczTDaXmkff_",
  });
})();

const EMAIL_CONFIG = {
  serviceID: "service_ohg2gah",
  adminTemplateID: "template_7agc0up",
  userTemplateID: "template_rjy2c0p",
};

document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitContactForm");
  const btnText = document.querySelector(".btn-text");
  const btnLoading = document.querySelector(".btn-loading");
  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage");

  if (!contactForm) {
    console.error("Contact form not found!");
    return;
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, "").length >= 10;
  }

  function validateField(field) {
    const value = field.value.trim();
    let errorSpan = field.parentElement.querySelector(".error-message");
    let isValid = true;

    if (!errorSpan) {
      errorSpan = document.createElement("span");
      errorSpan.className = "error-message";
      field.parentElement.appendChild(errorSpan);
    }

    field.classList.remove("error");
    errorSpan.textContent = "";
    errorSpan.classList.remove("show");

    if (value === "") {
      isValid = false;
    } else {
      switch (field.type) {
        case "email":
          if (!validateEmail(value)) {
            isValid = false;
            errorSpan.textContent = "Please enter a valid email";
          }
          break;
        case "tel":
          if (!validatePhone(value)) {
            isValid = false;
            errorSpan.textContent =
              "Please enter a valid phone number (at least 10 digits)";
          }
          break;
        case "text":
          if (value.length < 2) {
            isValid = false;
            errorSpan.textContent = "Name must be at least 2 characters";
          }
          break;
      }
    }

    if (!isValid) {
      field.classList.add("error");
      errorSpan.classList.add("show");
    }

    return isValid;
  }

  function validateForm() {
    const fields = contactForm.querySelectorAll(".form-control");
    let isValid = true;

    fields.forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  contactForm.querySelectorAll(".form-control").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("error")) {
        validateField(field);
      }
    });
  });

  function showMessage(element, duration = 5000) {
    element.classList.add("show");
    setTimeout(() => {
      element.classList.remove("show");
    }, duration);
  }

  function setLoadingState(isLoading) {
    submitBtn.disabled = isLoading;
    if (isLoading) {
      btnText.style.display = "none";
      btnLoading.style.display = "inline-block";
    } else {
      btnText.style.display = "inline-block";
      btnLoading.style.display = "none";
    }
  }

  function resetForm() {
    contactForm.reset();
    contactForm.querySelectorAll(".form-control").forEach((field) => {
      field.classList.remove("error");
      const errorSpan = field.parentElement.querySelector(".error-message");
      if (errorSpan) errorSpan.classList.remove("show");
    });
  }

  function sendEmail() {
    if (!validateForm()) {
      return;
    }

    setLoadingState(true);

    const captchaResponse = grecaptcha.getResponse();
    if (!captchaResponse) {
      alert("⚠️ Please verify captcha before submitting.");
      setLoadingState(false);
      return;
    }

    const formData = {
      name: document.getElementById("contactName").value.trim(),
      email: document.getElementById("contactEmail").value.trim(),
      phone: document.getElementById("contactPhone").value.trim(),
      message: document.getElementById("contactMessage").value.trim(),
      sentDate: new Date().toLocaleString("en-US"),
    };

    const userParams = {
      to_email: formData.email,
      user_name: formData.name,
      user_email: formData.email,
      user_phone: formData.phone,
      user_message: formData.message,
      sent_date: formData.sentDate,
      "g-recaptcha-response": captchaResponse,
    };

    const adminParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      message: formData.message,
      sent_date: formData.sentDate,
      reply_to: formData.email,
    };

    emailjs
      .send(EMAIL_CONFIG.serviceID, EMAIL_CONFIG.userTemplateID, userParams)
      .then(() => {
        return emailjs.send(
          EMAIL_CONFIG.serviceID,
          EMAIL_CONFIG.adminTemplateID,
          adminParams
        );
      })
      .then(() => {
        document.querySelector(".contact-form-container").style.display =
          "none";

        successMessage.style.display = "block";
        successMessage.classList.add("show");

        resetForm();
        grecaptcha.reset();
      })
      .catch((error) => {
        console.error("Email sending failed...", error);
        showMessage(errorMessage);
      })
      .finally(() => {
        setLoadingState(false);
      });
  }

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    sendEmail();
  });

  document
    .getElementById("contactMessage")
    .addEventListener("keydown", function (e) {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        sendEmail();
      }
    });
});
