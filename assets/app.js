(() => {
  const body = document.body;

  const langMap = {
    en: '/index.html',
    de: '/de/index.html',
    fr: '/fr/index.html',
    es: '/es/index.html',
    it: '/it/index.html'
  };

  const langCurrent = body.dataset.lang || 'en';
  const langButton = document.querySelector('.lang-toggle');
  const langMenu = document.querySelector('.lang-menu');

  if (langButton && langMenu) {
    langButton.addEventListener('click', () => {
      const expanded = langButton.getAttribute('aria-expanded') === 'true';
      langButton.setAttribute('aria-expanded', String(!expanded));
      langMenu.classList.toggle('open', !expanded);
    });

    langMenu.querySelectorAll('a[data-lang]').forEach((link) => {
      if (link.dataset.lang === langCurrent) {
        link.classList.add('active');
      }
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const selectedLang = link.dataset.lang;
        if (langMap[selectedLang]) {
          window.location.href = `${window.location.origin}${langMap[selectedLang]}`;
        }
      });
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.lang-switcher')) {
        langButton.setAttribute('aria-expanded', 'false');
        langMenu.classList.remove('open');
      }
    });
  }

  const drawer = document.querySelector('.mobile-drawer');
  const burger = document.querySelector('.burger-btn');
  const closeDrawerBtn = document.querySelector('.drawer-close');

  const closeDrawer = () => {
    if (!drawer) return;
    drawer.classList.remove('open');
    document.body.classList.remove('drawer-open');
  };

  if (drawer && burger) {
    burger.addEventListener('click', () => {
      drawer.classList.add('open');
      document.body.classList.add('drawer-open');
    });

    closeDrawerBtn?.addEventListener('click', closeDrawer);

    drawer.addEventListener('click', (event) => {
      if (event.target.classList.contains('mobile-drawer')) {
        closeDrawer();
      }
    });

    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });
  }

  const modal = document.querySelector('.privacy-modal');
  const modalOpeners = document.querySelectorAll('.privacy-open');
  const modalCloseBtns = document.querySelectorAll('.privacy-close');

  const closeModal = () => {
    modal?.classList.remove('open');
    document.body.classList.remove('modal-open');
  };

  if (modal) {
    modalOpeners.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        modal.classList.add('open');
        document.body.classList.add('modal-open');
      });
    });

    modalCloseBtns.forEach((btn) => btn.addEventListener('click', closeModal));

    modal.addEventListener('click', (event) => {
      if (event.target.classList.contains('privacy-modal')) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeDrawer();
      closeModal();
      langButton?.setAttribute('aria-expanded', 'false');
      langMenu?.classList.remove('open');
    }
  });

  const revealItems = document.querySelectorAll('.reveal');
  const counters = document.querySelectorAll('[data-counter-target]');
  const bars = document.querySelectorAll('.bar-fill');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          if (entry.target.dataset.counterTarget) {
            animateCounter(entry.target);
          }

          if (entry.target.classList.contains('bar-fill')) {
            entry.target.style.width = `${entry.target.dataset.fill}%`;
          }

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => observer.observe(item));
  counters.forEach((counter) => observer.observe(counter));
  bars.forEach((bar) => observer.observe(bar));

  function animateCounter(element) {
    const target = Number(element.dataset.counterTarget || 0);
    const duration = 1300;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      const suffix = element.dataset.counterSuffix || '';
      element.textContent = `${value.toLocaleString()}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  document.querySelectorAll('.faq-item button').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const expanded = button.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-item button').forEach((btn) => btn.setAttribute('aria-expanded', 'false'));
      document.querySelectorAll('.faq-item').forEach((faq) => faq.classList.remove('open'));
      if (!expanded) {
        button.setAttribute('aria-expanded', 'true');
        item?.classList.add('open');
      }
    });
  });

  document.querySelectorAll('.lead-form').forEach((form) => {
    const message = form.querySelector('.form-message');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = form.querySelector('input[name="name"]')?.value.trim();
      const email = form.querySelector('input[name="email"]')?.value.trim();
      const phone = form.querySelector('input[name="phone"]')?.value.trim();

      if (!name || !email || !phone || !/^\S+@\S+\.\S+$/.test(email)) {
        message.textContent = form.dataset.error || 'Please enter valid contact details.';
        message.classList.add('error');
        return;
      }

      message.textContent = form.dataset.success || 'Request received. Our investment desk will contact you shortly.';
      message.classList.remove('error');
      form.reset();
    });
  });
})();
