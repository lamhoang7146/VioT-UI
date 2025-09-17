// Khởi tạo EmailJS với Public Key của bạn
(function () {
  emailjs.init({
    publicKey: "EfbZ0iczTDaXmkff_", // Thay thế bằng Public Key thực của bạn
  });
})();

// Cấu hình EmailJS
const EMAIL_CONFIG = {
  serviceID: "service_ohg2gah", // Thay thế bằng Service ID thực của bạn
  adminTemplateID: "template_7agc0up", // Template gửi cho admin (bạn)
  userTemplateID: "template_rjy2c0p", // Template gửi cho user
};

// Đảm bảo DOM đã load hoàn toàn
document.addEventListener("DOMContentLoaded", function () {
  // Lấy các elements
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitContactForm");
  const btnText = document.querySelector(".btn-text");
  const btnLoading = document.querySelector(".btn-loading");
  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage");

  // Kiểm tra xem các elements có tồn tại không
  if (!contactForm) {
    console.error("Contact form not found!");
    return;
  }

  // Validation functions
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

    // Nếu không có span thì tự tạo
    if (!errorSpan) {
      errorSpan = document.createElement("span");
      errorSpan.className = "error-message";
      field.parentElement.appendChild(errorSpan);
    }

    // Reset error state
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

  // Real-time validation
  contactForm.querySelectorAll(".form-control").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("error")) {
        validateField(field);
      }
    });
  });

  // Show/hide messages
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
    // Remove any error states
    contactForm.querySelectorAll(".form-control").forEach((field) => {
      field.classList.remove("error");
      field.nextElementSibling.classList.remove("show");
    });
  }

  // Main send email function
  function sendEmail() {
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Set loading state
    setLoadingState(true);

    // Get form data
    const formData = {
      name: document.getElementById("contactName").value.trim(),
      email: document.getElementById("contactEmail").value.trim(),
      phone: document.getElementById("contactPhone").value.trim(),
      message: document.getElementById("contactMessage").value.trim(),
      sentDate: new Date().toLocaleString("en-US"),
    };

    // Prepare email parameters for USER (confirmation email)
    const userParams = {
      to_email: formData.email, // Gửi đến email của user
      user_name: formData.name,
      user_email: formData.email,
      user_phone: formData.phone,
      user_message: formData.message,
      sent_date: formData.sentDate,
    };

    // Prepare email parameters for ADMIN (notification email)
    const adminParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      message: formData.message,
      sent_date: formData.sentDate,
      reply_to: formData.email,
    };

    // Send confirmation email to user FIRST
    emailjs
      .send(EMAIL_CONFIG.serviceID, EMAIL_CONFIG.userTemplateID, userParams)
      .then((userResponse) => {
        console.log(
          "User email sent successfully!",
          userResponse.status,
          userResponse.text
        );

        // After user email is sent, send notification to admin
        return emailjs.send(
          EMAIL_CONFIG.serviceID,
          EMAIL_CONFIG.adminTemplateID,
          adminParams
        );
      })
      .then((adminResponse) => {
        console.log(
          "Admin email sent successfully!",
          adminResponse.status,
          adminResponse.text
        );
        document.querySelector(".contact-form-container").style.display =
          "none";
        showMessage(successMessage);
        resetForm();
      })
      .catch((error) => {
        console.error("Email sending failed...", error);
        showMessage(errorMessage);
      })
      .finally(() => {
        setLoadingState(false);
      });
  }

  // Form submit event
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    sendEmail();
  });

  // Enter key support for textarea
  document
    .getElementById("contactMessage")
    .addEventListener("keydown", function (e) {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        sendEmail();
      }
    });
});
