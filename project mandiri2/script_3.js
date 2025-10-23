document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const status = document.getElementById('contactStatus');

  console.log('contact script loaded', { contactForm: !!contactForm, status: !!status });
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    console.log('form submit', { name, email, subject, message });

    if (!name || !email || !subject || !message) {
      if (status) status.innerHTML = '<div style="background:#fdecea;color:#a33;padding:8px;border-radius:6px;">Pesan tidak berhasil — semua field harus diisi.</div>';
      console.warn('validation failed: missing fields');
      return;
    }

    if (status) status.innerHTML = '<div style="background:#e6f4ea;color:#1a7b3a;padding:8px;border-radius:6px;">Pesan berhasil dikirim. Terima kasih.</div>';
    console.log('message sent (simulated)');
    contactForm.reset();

    setTimeout(() => { if (status) status.innerHTML = ''; }, 3000);
  });
});