// Basic interactions: hamburger, scroll animations, booking behavior and success modal

document.addEventListener('DOMContentLoaded', function () {
    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
  
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.classList.toggle('open');
      navLinks.classList.toggle('show');
      hamburger.setAttribute('aria-expanded', hamburger.classList.contains('open'));
    });
  
    // Close nav when clicking a link (mobile)
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('show');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  
    // IntersectionObserver for fade-up animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.12 });
  
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  
    // Book-now buttons auto-fill package and scroll to form
    document.querySelectorAll('.book-now').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pkg = e.currentTarget.getAttribute('data-package');
        const packageSelect = document.getElementById('package');
        // attempt to set value if option exists, otherwise set as a new option
        let found = Array.from(packageSelect.options).some(opt => opt.text === pkg);
        if (!found) {
          const newOpt = new Option(pkg, pkg, true, true);
          packageSelect.add(newOpt);
        } else {
          packageSelect.value = pkg;
        }
        // smooth scroll and focus
        document.getElementById('book').scrollIntoView({behavior: 'smooth', block: 'center'});
        packageSelect.focus({preventScroll:true});
      });
    });
  
    // Booking form: show modal on submit, open FormSubmit target in new tab (form has target="_blank")
    const bookingForm = document.getElementById('bookingForm');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');
    const okBtn = document.getElementById('okBtn');
  
    bookingForm.addEventListener('submit', function (e) {
      // basic client-side validation (HTML will also validate)
      if (!bookingForm.checkValidity()) {
        // let browser show validation messages
        return;
      }
      // show success modal (submission will open FormSubmit in new tab because of target="_blank")
      successModal.setAttribute('aria-hidden', 'false');
      e.preventDefault(); // prevent immediate navigation so modal appears
      // open the form in a new tab manually so we can remain on page
      const formData = new FormData(bookingForm);
      const action = bookingForm.getAttribute('action');
      // Build a form to post in new tab (works without CORS)
      const tempForm = document.createElement('form');
      tempForm.action = action;
      tempForm.method = bookingForm.method || 'POST';
      tempForm.target = '_blank';
      // append inputs
      for (let [k, v] of formData.entries()) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = k;
        input.value = v;
        tempForm.appendChild(input);
      }
      document.body.appendChild(tempForm);
      tempForm.submit();
      tempForm.remove();
    });
  
    function closeSuccess() {
      successModal.setAttribute('aria-hidden', 'true');
    }
    closeModal.addEventListener('click', closeSuccess);
    okBtn.addEventListener('click', closeSuccess);
  
    // accessibility: close modal with Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        successModal.setAttribute('aria-hidden', 'true');
      }
    });
  
    // mobile image optimization hint: on small screens you could swap background images dynamically (left as an exercise)
    // lazy images are already enabled via loading="lazy"
  });
  