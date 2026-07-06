document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. STICKY HEADER & ACTIVE LINKS
     ========================================== */
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Toggle header style on scroll
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Dynamic active state based on section in viewport
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  /* ==========================================
     2. THEME SWITCHER (LIGHT / DARK)
     ========================================== */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = themeToggleBtn.querySelector('i');
  
  // Set theme on load
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.body.classList.add('dark');
    themeIcon.className = 'fa-solid fa-sun';
  } else {
    document.body.classList.remove('dark');
    themeIcon.className = 'fa-solid fa-moon';
  }

  themeToggleBtn.addEventListener('click', () => {
    if (document.body.classList.contains('dark')) {
      document.body.classList.remove('dark');
      themeIcon.className = 'fa-solid fa-moon';
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.add('dark');
      themeIcon.className = 'fa-solid fa-sun';
      localStorage.setItem('theme', 'dark');
    }
  });

  /* ==========================================
     3. MOBILE NAVIGATION MENU TOGGLE
     ========================================== */
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  mobileToggle.addEventListener('click', () => {
    const isVisible = navMenu.style.display === 'flex';
    if (isVisible) {
      navMenu.style.display = 'none';
      mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
    } else {
      navMenu.style.display = 'flex';
      navMenu.style.flexDirection = 'column';
      navMenu.style.position = 'absolute';
      navMenu.style.top = '100%';
      navMenu.style.left = '0';
      navMenu.style.width = '100%';
      navMenu.style.background = 'var(--surface)';
      navMenu.style.padding = '20px';
      navMenu.style.borderBottom = '1px solid var(--border)';
      mobileToggle.querySelector('i').className = 'fa-solid fa-xmark';
    }
  });

  // Close mobile nav on click
  navMenu.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
      if (window.innerWidth <= 768) {
        navMenu.style.display = 'none';
        mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
      }
    }
  });

  /* ==========================================
     4. TREATMENT PRICE CALCULATOR
     ========================================== */
  const calcOptions = document.querySelectorAll('.calc-option');
  const calcTotalDisplay = document.getElementById('calcTotalDisplay');

  calcOptions.forEach(option => {
    option.addEventListener('click', () => {
      option.classList.toggle('active');
      calculateCost();
    });
  });

  function calculateCost() {
    let total = 0;
    document.querySelectorAll('.calc-option.active').forEach(option => {
      total += parseInt(option.getAttribute('data-price'));
    });
    // Format price with commas
    calcTotalDisplay.textContent = `$${total.toLocaleString()}`;
  }

  /* ==========================================
     5. STEP-BY-STEP BOOKING LOGIC
     ========================================== */
  let bookingState = {
    step: 1,
    service: 'Cosmetic Consultation',
    doctor: 'Dr. Sarah Jenkins',
    date: null,
    time: null
  };

  const panels = [
    document.getElementById('panel1'),
    document.getElementById('panel2'),
    document.getElementById('panel3'),
    document.getElementById('panel4'),
    document.getElementById('panelSuccess')
  ];

  const indicators = [
    document.getElementById('stepIndicator1'),
    document.getElementById('stepIndicator2'),
    document.getElementById('stepIndicator3'),
    document.getElementById('stepIndicator4')
  ];

  const btnPrev = document.getElementById('btnBookingPrev');
  const btnNext = document.getElementById('btnBookingNext');
  const footerActions = document.getElementById('bookingActionsFooter');

  // STEP 1 & 2: Service / Doctor Card clicks
  setupChoiceCards('#panel1 .choice-card', 'service');
  setupChoiceCards('#panel2 .choice-card', 'doctor');

  function setupChoiceCards(selector, field) {
    const cards = document.querySelectorAll(selector);
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        bookingState[field] = card.getAttribute('data-value');
      });
    });
  }

  // STEP 3: Calendar & Time Slots
  const calendarGrid = document.getElementById('bookingCalendarGrid');
  const monthTitle = document.getElementById('calendarMonthTitle');
  const timeSlots = document.querySelectorAll('.time-slot');

  // Generate calendar for July 2026 (July 1, 2026 is a Wednesday)
  function renderCalendar() {
    calendarGrid.innerHTML = '';
    
    // Day Headers
    const headers = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    headers.forEach(h => {
      const headerDiv = document.createElement('div');
      headerDiv.className = 'cal-day-header';
      headerDiv.textContent = h;
      calendarGrid.appendChild(headerDiv);
    });

    // Dummy blanks before Wednesday (Wed index = 3)
    for (let i = 0; i < 3; i++) {
      const blank = document.createElement('div');
      calendarGrid.appendChild(blank);
    }

    // Days 1 to 31
    for (let day = 1; day <= 31; day++) {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'cal-day';
      dayDiv.textContent = day;

      // Disable Sundays (July 5, 12, 19, 26 are Sundays. Index offsets: 3 + day - 1 = day + 2. If (day + 2) % 7 === 0 -> Sunday)
      const dayOfWeek = (day + 2) % 7;
      if (dayOfWeek === 0) {
        dayDiv.classList.add('disabled');
      } else {
        // Handle selection
        dayDiv.addEventListener('click', () => {
          document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
          dayDiv.classList.add('selected');
          bookingState.date = `July ${day}, 2026`;
        });
      }
      calendarGrid.appendChild(dayDiv);
    }
  }
  renderCalendar();

  // Time slots click
  timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      timeSlots.forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      bookingState.time = slot.getAttribute('data-time');
    });
  });

  // Prev / Next Navigators
  btnNext.addEventListener('click', () => {
    if (bookingState.step === 3) {
      if (!bookingState.date || !bookingState.time) {
        alert('Please choose both a date and an available time slot.');
        return;
      }
    }

    if (bookingState.step === 4) {
      // Validate inputs
      const name = document.getElementById('bookName').value.trim();
      const phone = document.getElementById('bookPhone').value.trim();
      const email = document.getElementById('bookEmail').value.trim();
      
      if (!name || !phone || !email) {
        alert('Please fill out all contact fields to secure reservation.');
        return;
      }

      // Success processing
      bookingState.name = name;
      processBookingSuccess();
      return;
    }

    // Shift to next
    bookingState.step++;
    updateStepView();
  });

  btnPrev.addEventListener('click', () => {
    if (bookingState.step > 1) {
      bookingState.step--;
      updateStepView();
    }
  });

  function updateStepView() {
    // Show active panel
    panels.forEach((p, idx) => {
      if (idx + 1 === bookingState.step) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    // Update steps visual indicators
    indicators.forEach((ind, idx) => {
      if (idx + 1 < bookingState.step) {
        ind.className = 'booking-step completed';
      } else if (idx + 1 === bookingState.step) {
        ind.className = 'booking-step active';
      } else {
        ind.className = 'booking-step';
      }
    });

    // Prev visibility
    if (bookingState.step > 1) {
      btnPrev.style.visibility = 'visible';
    } else {
      btnPrev.style.visibility = 'hidden';
    }

    // Next Text
    if (bookingState.step === 4) {
      btnNext.innerHTML = 'Confirm Booking <i class="fa-solid fa-circle-check" style="margin-left: 6px;"></i>';
    } else {
      btnNext.innerHTML = 'Next Step <i class="fa-solid fa-arrow-right"></i>';
    }
  }

  function processBookingSuccess() {
    // Update confirmation text fields
    document.getElementById('confirmPatientName').textContent = bookingState.name;
    document.getElementById('confirmService').textContent = bookingState.service;
    document.getElementById('confirmDoctor').textContent = bookingState.doctor;
    document.getElementById('confirmDateTime').textContent = `${bookingState.date} at ${bookingState.time}`;

    // Add appointment dynamically to Patient Portal tab table
    const tableBody = document.getElementById('portalApptTableBody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${bookingState.date} - ${bookingState.time}</td>
      <td>${bookingState.service}</td>
      <td>${bookingState.doctor}</td>
      <td><span class="appt-status upcoming">Upcoming</span></td>
    `;
    tableBody.insertBefore(newRow, tableBody.firstChild);

    // Update portal "Next Treatment" card dynamically
    const portalNextCard = document.querySelector('.portal-stats-row .portal-stat-card:first-child');
    if (portalNextCard) {
      portalNextCard.querySelector('h4').textContent = bookingState.date;
      portalNextCard.querySelector('p').textContent = bookingState.doctor;
    }

    // Transition to Success panel
    panels.forEach(p => p.classList.remove('active'));
    document.getElementById('panelSuccess').classList.add('active');
    footerActions.style.display = 'none';
  }

  // Restart booking reset
  document.getElementById('btnRestartBooking').addEventListener('click', () => {
    bookingState = {
      step: 1,
      service: 'Cosmetic Consultation',
      doctor: 'Dr. Sarah Jenkins',
      date: null,
      time: null
    };

    // Reset UI selections
    document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    document.getElementById('bookName').value = '';
    document.getElementById('bookPhone').value = '';
    document.getElementById('bookEmail').value = '';
    document.getElementById('bookNotes').value = '';

    updateStepView();
    footerActions.style.display = 'flex';
  });


  /* ==========================================
     6. SMILE HUB PORTAL TABS SWITCHING
     ========================================== */
  const menuItems = document.querySelectorAll('.portal-menu-item');
  const tabPanels = document.querySelectorAll('.portal-tab-panel');

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active from all items
      menuItems.forEach(mi => mi.classList.remove('active'));
      item.classList.add('active');

      // Switch panels
      const targetTab = item.getAttribute('data-tab');
      tabPanels.forEach(panel => {
        if (panel.id === targetTab) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });


  /* ==========================================
     7. TESTIMONIALS SLIDER
     ========================================== */
  const track = document.getElementById('testimonialTrack');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');
  let currentSlide = 0;
  let autoSlideTimer;

  function updateSlider() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
  }

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
  });

  function startAutoSlide() {
    autoSlideTimer = setInterval(nextSlide, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  startAutoSlide();


  /* ==========================================
     8. FAQS ACCORDION
     ========================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all FAQs
      faqItems.forEach(fi => fi.classList.remove('active'));

      // If it wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* ==========================================
     10. INTERACTIVE TECHNOLOGY TOUR LOGIC
     ========================================== */
  const techCards = document.querySelectorAll('.tech-card');
  const techModal = document.getElementById('techModal');
  const techModalClose = document.getElementById('techModalClose');
  const modalTechIcon = document.getElementById('modalTechIcon');
  const modalTechTitle = document.getElementById('modalTechTitle');
  const modalTechDesc = document.getElementById('modalTechDesc');
  const modalTechSpecs = document.getElementById('modalTechSpecs');
  const modalTechCompOld = document.getElementById('modalTechCompOld');
  const modalTechCompNew = document.getElementById('modalTechCompNew');
  const modalTechBookBtn = document.getElementById('modalTechBookBtn');

  const techData = {
    cadcam: {
      title: "CAD/CAM Single-Day Crowns",
      icon: "fa-solid fa-microscope",
      desc: "Our in-office CAD/CAM milling system allows us to scan, design, and manufacture individual zirconia crowns in a single visit, avoiding the need for messy impressions or multiple appointments.",
      specs: [
        "1-Hour in-office ceramic milling",
        "High-definition 3D optical camera scanning",
        "Biocompatible ceramic and zirconia materials",
        "Custom color matching and glaze finishes"
      ],
      compOld: "Messy alginate clay mold impressions, 2-week wait time with a temporary plastic crown that frequently fractures or falls off.",
      compNew: "Immediate digital scan, immediate in-office computerized milling, permanent zirconium crown installed in 1 comfortable visit.",
      serviceChoice: "Cosmetic Consultation"
    },
    waterlase: {
      title: "WaterLase Laser Dentistry",
      icon: "fa-solid fa-bolt-lightning",
      desc: "By combining water and laser energy, the WaterLase system performs precise cuts in hard and soft tissues without generating the friction, heat, and vibration that cause pain, often eliminating the need for local anesthesia injections.",
      specs: [
        "Needle-free, drill-free cavity preparation",
        "Minimally invasive gum contouring",
        "90% less post-op bleeding and swelling",
        "Promotes faster natural tissue healing"
      ],
      compOld: "Loud mechanical drills, painful vibrations, heat friction, mandatory local anesthesia needles, and lingering facial numbness.",
      compNew: "Silent laser energy, friction-free water cooling, no needles needed for most cavities, and immediate recovery without numbness.",
      serviceChoice: "General Checkup"
    },
    cbct: {
      title: "CBCT 3D Digital Imaging",
      icon: "fa-solid fa-cube",
      desc: "Cone Beam Computed Tomography (CBCT) provides highly detailed 3D radiographic reconstructions of your jaw bones, teeth roots, nasal cavities, and nerve pathways, enabling precise virtual implant surgery planning.",
      specs: [
        "Sub-millimeter anatomical precision",
        "90% less radiation exposure than medical CT",
        "3D implant placement simulation",
        "Early detection of bone defects and infections"
      ],
      compOld: "Flat 2D X-rays with anatomical distortion, overlapping structures, and hidden nerve pathways requiring surgical exploratory cuts.",
      compNew: "Full 3D anatomical visualization, virtual implant pre-planning, custom surgical guides, and safe, low-dose digital exposure.",
      serviceChoice: "Dental Implant Check"
    },
    intraoral: {
      title: "Intraoral 3D Scanner",
      icon: "fa-solid fa-wand-magic-sparkles",
      desc: "Our digital scanner captures thousands of pictures per second to construct a highly accurate, interactive 3D virtual model of your mouth in real-time, displaying your current teeth alignment and bite dynamics.",
      specs: [
        "No gag-inducing chemical clay molds",
        "Instantly sent to dental labs via cloud",
        "Bite analysis and alignment tracking",
        "100% digital accuracy within micrometers"
      ],
      compOld: "Cold, gag-inducing chemical putty molds, 10-minute mouth-setting times, shipping delays, and risk of material distortion.",
      compNew: "Comfortable 2-minute digital wand scan, real-time 3D screen visualization, cloud transfer, and flawless fit accuracy.",
      serviceChoice: "Orthodontic Consult"
    }
  };

  techCards.forEach(card => {
    card.addEventListener('click', () => {
      const techKey = card.getAttribute('data-tech');
      const data = techData[techKey];
      if (!data) return;

      // Update Modal Contents
      modalTechIcon.innerHTML = `<i class="${data.icon}"></i>`;
      modalTechTitle.textContent = data.title;
      modalTechDesc.textContent = data.desc;
      modalTechCompOld.textContent = data.compOld;
      modalTechCompNew.textContent = data.compNew;

      // Update Inclusions specs list
      modalTechSpecs.innerHTML = '';
      data.specs.forEach(spec => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${spec}`;
        modalTechSpecs.appendChild(li);
      });

      // Tie booking CTA button to choice service
      modalTechBookBtn.onclick = (e) => {
        e.preventDefault();
        techModal.classList.remove('active');

        // Scroll to booking section
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });

        // Update step 1 booking choice option dynamically
        const serviceOptions = document.querySelectorAll('#panel1 .choice-card');
        serviceOptions.forEach(opt => {
          opt.classList.remove('selected');
          if (opt.getAttribute('data-value') === data.serviceChoice) {
            opt.classList.add('selected');
            bookingState.service = data.serviceChoice;
          }
        });
      };

      // Open Modal
      techModal.classList.add('active');
    });
  });

  // Modal Close Events
  techModalClose.addEventListener('click', () => {
    techModal.classList.remove('active');
  });

  techModal.addEventListener('click', (e) => {
    if (e.target === techModal) {
      techModal.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && techModal.classList.contains('active')) {
      techModal.classList.remove('active');
    }
  });

});
