(function () {
  'use strict';

  const header = document.querySelector('[data-header]');
  const menu = document.querySelector('[data-menu]');
  const menuButton = document.querySelector('[data-menu-button]');

  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  if (menu && menuButton) {
    menuButton.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const revealItems = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -48px 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));

  const timelines = document.querySelectorAll('[data-timeline]');
  if (timelines.length) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        timelineObserver.unobserve(entry.target);
      });
    }, { threshold: 0.35 });

    timelines.forEach((timeline) => timelineObserver.observe(timeline));
  }

  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const target = Number(element.dataset.count || 0);
      const start = performance.now();
      const duration = 1600;

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.round(target * eased) + (target === 3 ? 'x' : '%');
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      countObserver.unobserve(element);
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => countObserver.observe(counter));

  const board = document.querySelector('.signal-board');
  if (board && matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 8;
      const y = (event.clientY / window.innerHeight - 0.5) * 8;
      board.style.transform = `perspective(1000px) rotateX(${3 - y}deg) rotateY(${-5 + x}deg)`;
    }, { passive: true });
  }

  const chatWidget = document.querySelector('[data-chat-widget]');
  const chatToggle = document.querySelector('[data-chat-toggle]');
  const chatClose = document.querySelector('[data-chat-close]');
  const chatMessages = document.querySelector('[data-chat-messages]');
  const phone = '5513997270611';
  let selectedSubject = 'Quero informações sobre os serviços da DPM Mídia Digital.';

  const answers = {
    'Quero criar uma marca para minha empresa.': 'Perfeito. Criamos uma identidade visual pensada para posicionar sua empresa com mais profissionalismo e lembrança. Para continuar, preencha seus dados abaixo.',
    'Quero criativos para redes sociais.': 'Ótimo. Desenvolvemos criativos alinhados ao visual da marca e ao objetivo da comunicação. Para continuar, preencha seus dados abaixo.',
    'Quero criar um site, loja virtual ou landing page.': 'Excelente. Criamos páginas, sites e lojas com foco em apresentação, velocidade e conversão. Para continuar, preencha seus dados abaixo.',
    'Quero um sistema de gestão para minha empresa.': 'Certo. Sistemas de gestão ajudam a organizar processos, clientes, vendas e relatórios da empresa. Para continuar, preencha seus dados abaixo.'
  };

  const addMessage = (text, type) => {
    if (!chatMessages) return;
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${type}`;
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const addLeadForm = () => {
    if (!chatMessages) return;

    chatMessages.querySelectorAll('.chat-form-bubble').forEach((form) => form.remove());

    const form = document.createElement('form');
    form.className = 'chat-form-bubble';
    form.innerHTML = `
      <label for="chat-name">Nome completo</label>
      <input id="chat-name" name="name" type="text" placeholder="Seu nome" autocomplete="name" required>
      <label for="chat-phone">WhatsApp / Telefone</label>
      <input id="chat-phone" name="phone" type="tel" placeholder="(11) 9 9999-9999" autocomplete="tel" maxlength="16" required>
      <button type="submit">Enviar Dados</button>
    `;

    const phoneInput = form.querySelector('#chat-phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        const digits = phoneInput.value.replace(/\D/g, '').slice(0, 11);
        const area = digits.slice(0, 2);
        const first = digits.slice(2, 3);
        const middle = digits.slice(3, 7);
        const last = digits.slice(7, 11);

        let formatted = area ? `(${area}` : '';
        if (area.length === 2) formatted += ')';
        if (first) formatted += ` ${first}`;
        if (middle) formatted += ` ${middle}`;
        if (last) formatted += `-${last}`;

        phoneInput.value = formatted;
      });
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const contact = String(data.get('phone') || '').trim();

      if (!name || !contact) return;

      const message = [
        'Olá, vim pelo site da DPM Mídia Digital.',
        `Assunto: ${selectedSubject}`,
        `Nome: ${name}`,
        `Telefone: ${contact}`
      ].join('\n');

      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    });

    chatMessages.appendChild(form);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  if (chatWidget && chatToggle) {
    chatToggle.addEventListener('click', () => {
      const isOpen = chatWidget.classList.toggle('is-open');
      chatToggle.setAttribute('aria-expanded', String(isOpen));
    });

    if (chatClose) {
      chatClose.addEventListener('click', () => {
        chatWidget.classList.remove('is-open');
        chatToggle.setAttribute('aria-expanded', 'false');
      });
    }

    document.querySelectorAll('[data-chat-question]').forEach((button) => {
      button.addEventListener('click', () => {
        const question = button.dataset.chatQuestion || '';
        const answer = answers[question] || 'Vamos continuar pelo WhatsApp para entender melhor seu projeto.';
        selectedSubject = question;

        addMessage(question, 'user');
        window.setTimeout(() => {
          addMessage(answer, 'bot');
          addLeadForm();
        }, 360);
      });
    });
  }
})();
