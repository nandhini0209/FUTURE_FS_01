/**
 * Nandhini Pothunuri - Personal Portfolio JavaScript
 * Handles active navigation tabs, mobile sidebar toggle, animated skill bars,
 * certificate viewer modal, and contact form validation/mock submission.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     MOBILE SIDEBAR TOGGLE
     ========================================================================== */
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');

  if (sidebar && sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      sidebarToggle.classList.toggle('active');
    });
  }

  /* ==========================================================================
     NAVIGATION TABS (PAGE SWITCHING)
     ========================================================================== */
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const sections = document.querySelectorAll('.portfolio-section');

  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      const targetSectionId = this.getAttribute('data-nav-link');
      const targetSection = document.getElementById(targetSectionId);

      if (targetSection) {
        // Remove active class from all links and sections
        navLinks.forEach(item => item.classList.remove('active'));
        sections.forEach(sec => sec.classList.remove('active'));

        // Add active class to current elements
        this.classList.add('active');
        targetSection.classList.add('active');

        // Scroll page container back to top
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });

        // Close sidebar on mobile after clicking link
        if (sidebar && sidebar.classList.contains('active')) {
          sidebar.classList.remove('active');
          sidebarToggle.classList.remove('active');
        }

        // Trigger animation for skills if entering resume tab
        if (targetSectionId === 'resume') {
          triggerSkillsAnimation();
        }
      }
    });
  });

  /* ==========================================================================
     SKILLS PROGRESS BAR ANIMATION (INTERSECTION OBSERVER)
     ========================================================================== */
  const skillBars = document.querySelectorAll('.skill-progress-bar');
  const resumeSection = document.getElementById('resume');

  function triggerSkillsAnimation() {
    skillBars.forEach(bar => {
      const targetWidth = bar.getAttribute('data-progress');
      bar.style.width = targetWidth;
    });
  }

  // Use IntersectionObserver to animate skill bars automatically when scrolling to Resume on desktop/scroll layout
  if ('IntersectionObserver' in window && resumeSection) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          triggerSkillsAnimation();
          observer.unobserve(entry.target); // Animate once
        }
      });
    }, {
      threshold: 0.15 // Trigger when 15% of the section is visible
    });

    skillsObserver.observe(resumeSection);
  } else {
    // Fallback if observer is not supported or direct page access
    triggerSkillsAnimation();
  }

  /* ==========================================================================
     CERTIFICATE LIGHTBOX MODAL
     ========================================================================== */
  const certModal = document.getElementById('certModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalClose = document.getElementById('modalClose');
  const modalOverlay = document.getElementById('modalOverlay');
  const viewCertBtns = document.querySelectorAll('.view-cert-btn');

  function openModal(imgSrc, titleText) {
    if (certModal && modalImg && modalTitle) {
      modalImg.src = imgSrc;
      modalTitle.textContent = titleText;
      certModal.classList.add('active');
      certModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Lock body scroll
    }
  }

  function closeModal() {
    if (certModal) {
      certModal.classList.remove('active');
      certModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Release scroll
      
      // Clear image source after fadeout finishes
      setTimeout(() => {
        modalImg.src = '';
      }, 300);
    }
  }

  viewCertBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const src = this.getAttribute('data-cert-src');
      const title = this.getAttribute('data-cert-title');
      openModal(src, title);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal.classList.contains('active')) {
      closeModal();
    }
  });

  /* ==========================================================================
     CONTACT FORM VALIDATION & TOAST NOTIFICATION
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');
  
  const successToast = document.getElementById('successToast');
  const toastClose = document.getElementById('toastClose');
  let toastTimer;

  // Regex check for email
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Toast controls
  function showToast() {
    if (successToast) {
      successToast.classList.add('active');
      
      // Auto close after 5 seconds
      clearTimeout(toastTimer);
      toastTimer = setTimeout(hideToast, 5000);
    }
  }

  function hideToast() {
    if (successToast) {
      successToast.classList.remove('active');
    }
  }

  if (toastClose) {
    toastClose.addEventListener('click', hideToast);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      let isFormValid = true;

      // Validate Email
      const emailValue = emailInput.value.trim();
      if (!isValidEmail(emailValue)) {
        emailInput.classList.add('invalid');
        isFormValid = false;
      } else {
        emailInput.classList.remove('invalid');
      }

      // Validate Message
      const messageValue = messageInput.value.trim();
      if (messageValue === '') {
        messageInput.classList.add('invalid');
        isFormValid = false;
      } else {
        messageInput.classList.remove('invalid');
      }

      // Handle Submit Simulation
      if (isFormValid) {
        // Disable submit button and show loading state
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span>Sending...</span>
          <i class="fa-solid fa-circle-notch fa-spin"></i>
        `;

        // Mock Server Response (1.5s delay)
        setTimeout(() => {
          // Reset button and state
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;

          // Clear inputs
          emailInput.value = '';
          messageInput.value = '';

          // Show Toast Success
          showToast();

        }, 1500);
      }
    });

    // Real-time input cleaning (removes error glow as user edits)
    emailInput.addEventListener('input', function() {
      if (isValidEmail(this.value.trim())) {
        this.classList.remove('invalid');
      }
    });

    messageInput.addEventListener('input', function() {
      if (this.value.trim() !== '') {
        this.classList.remove('invalid');
      }
    });
  }

});
