/* TradeDictatorCapital — shared scripts (page-aware)
   Each block is wrapped in a null-check so it only runs on pages that need it. */

(function () {
  'use strict';

  /* ── SERVICES MODAL (only on services.html) ── */
  const srvData = [
    {num:'01',title:'Institutional Trade Signals',tagline:'Access high-probability trade setups derived from deep market analysis and liquidity-based strategies.',items:['Clear entry, stop loss, and take profit levels','Focus on quality over quantity','Structured around market maker behavior','Designed for disciplined execution'],badge:null},
    {num:'02',title:'Market Analysis & Insights',tagline:'Stay aligned with the market through concise, high-level analysis.',items:['Daily/weekly market outlooks','Key levels and liquidity zones','Institutional concepts explained with clarity','Strategic positioning guidance'],badge:null},
    {num:'03',title:'Risk Management Framework',tagline:'Trade with control and confidence using a structured risk approach.',items:['Defined risk per trade','Capital preservation strategies','Guidance for account scaling','Consistency-focused execution model'],badge:null},
    {num:'04',title:'Private Trading Community',tagline:'Join a focused environment built for serious traders.',items:['Direct access to insights and updates','Like-minded, disciplined traders','Noise-free, high-quality discussions','Ongoing support and engagement'],badge:null},
    {num:'05',title:'Mentorship & Trading Development',tagline:'For traders seeking deeper understanding and long-term growth.',items:['Institutional trading concepts (market structure, liquidity)','Strategy breakdowns and execution models','Personalized guidance','Performance improvement focus'],badge:'Optional Premium'},
    {num:'06',title:'Copy Trading',tagline:'Automate execution while maintaining strategic alignment.',items:['Seamless trade replication','Consistent strategy execution','Reduced emotional decision-making','Suitable for hands-off participants'],badge:null}
  ];

  const srvModal = document.getElementById('srvModal');
  if (srvModal) {
    window.openSrv = function (i) {
      const d = srvData[i];
      document.getElementById('mNum').textContent = d.num + ' / 06';
      document.getElementById('mTitle').textContent = d.title;
      document.getElementById('mTagline').textContent = d.tagline;
      document.getElementById('mList').innerHTML = d.items.map(x => '<li>' + x + '</li>').join('');
      document.getElementById('mBadge').innerHTML = d.badge
        ? '<span style="display:inline-block;margin-top:0.75rem;font-size:0.62rem;letter-spacing:0.2em;text-transform:uppercase;padding:0.25rem 0.75rem;border:0.5px solid var(--gold);color:var(--gold);">' + d.badge + '</span>'
        : '';
      srvModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    window.closeSrvBtn = function () {
      srvModal.classList.remove('open');
      document.body.style.overflow = '';
    };
    window.closeSrv = function (e) {
      if (e.target === srvModal) window.closeSrvBtn();
    };
  }

  /* ── TERMS MODAL (only if a legacy in-page terms modal exists) ── */
  const termsModal = document.getElementById('termsModal');
  if (termsModal) {
    window.closeTerms = function (e) {
      if (e.target === termsModal) {
        termsModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    };
  }

  /* ── SLIDESHOW (only on index.html / pages with #slidesTrack) ── */
  const track = document.getElementById('slidesTrack');
  if (track) {
    const slides = track.querySelectorAll('.slide');
    const total = slides.length;
    let current = 0, autoTimer;
    const counter = document.getElementById('sliderCounter');
    const dotsWrap = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = [];

    if (dotsWrap) {
      for (let i = 0; i < total; i++) {
        const d = document.createElement('button');
        d.className = 'dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(d);
        dots.push(d);
      }
    }

    function goTo(n) {
      current = (n + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
      if (counter) counter.textContent = (current + 1) + ' / ' + total;
      resetAuto();
    }
    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    }
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
    resetAuto();
  }

  /* ── FAQ ACCORDION (any page with .faq-item) ── */
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length) {
    faqItems.forEach(item => {
      item.querySelector('.faq-q').addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ── CONTACT FORM (any page with .contact-form) ──
     Submits via FormSubmit AJAX so inquiries land in the inbox without leaving the page.
     First submission triggers a one-time confirmation email — must be clicked before live use. */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm && contactForm.tagName === 'FORM') {
    const statusEl = contactForm.querySelector('.form-status');
    const setStatus = (msg, tone) => {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.style.color = tone === 'ok' ? 'var(--gold)' : tone === 'err' ? '#d97a7a' : 'var(--muted)';
    };
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const data = new FormData(contactForm);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();
      if (!name || !email || !message) {
        setStatus('Please fill in all fields before submitting.', 'err');
        return;
      }
      const btn = contactForm.querySelector('button[type="submit"]');
      const btnText = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      setStatus('Sending…');
      try {
        const res = await fetch(contactForm.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          contactForm.reset();
          setStatus('Thank you. Your inquiry has been received — we will respond by email.', 'ok');
        } else {
          setStatus('Submission failed. Please email us directly at Tradedictatorcapital@gmail.com.', 'err');
        }
      } catch (_) {
        setStatus('Network error. Please email us directly at Tradedictatorcapital@gmail.com.', 'err');
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = btnText; }
      }
    });
  }
})();
