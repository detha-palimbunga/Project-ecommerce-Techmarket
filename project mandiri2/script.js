// Script untuk menampilkan detail produk saat diklik dan menambahkannya ke keranjang (localStorage)

document.addEventListener('DOMContentLoaded', () => {
  // Ambil semua elemen produk (.pro) di halaman
  const proEls = document.querySelectorAll('.pro');

  // Elemen-elemen pada modal/section detail produk
  const detailSection = document.getElementById('product-detail'); // container overlay detail
  const pdCard = document.getElementById('pd-card');               // card dialog detail
  const pdBackdrop = document.getElementById('pd-backdrop');       // backdrop (latar gelap)
  const pdClose = document.getElementById('pd-close');             // tombol X atas
  const pdClose2 = document.getElementById('pd-close-2');          // tombol tutup kedua
  const pdAdd = document.getElementById('pd-add');                 // tombol "Tambah ke Keranjang"

  // Elemen yang akan diisi data produk
  const pdImg = document.getElementById('pd-img');
  const pdTitle = document.getElementById('pd-title');
  const pdCat = document.getElementById('pd-cat');
  const pdPrice = document.getElementById('pd-price');
  const pdDesc = document.getElementById('pd-desc');

  // Fungsi membuka detail: mengisi elemen dengan data dan menampilkan overlay
  function openDetail(data) {
    pdImg.src = data.img || '';                  // set gambar (atau kosong)
    pdImg.alt = data.title || 'Product';         // alt fallback
    pdTitle.textContent = data.title || '';      // judul produk
    pdCat.textContent = data.category || '';     // kategori produk
    pdPrice.textContent = data.price || '';      // harga produk
    pdDesc.textContent = data.desc || 'Tidak ada deskripsi.'; // deskripsi

    // Tampilkan section detail dengan mengatur atribut/visibility
    detailSection.hidden = false;                 // pastikan element terlihat oleh DOM
    detailSection.setAttribute('open','true');    // atribut ini bisa dipakai CSS untuk animasi
    pdCard.setAttribute('aria-hidden','false');   // aksesibilitas: dialog terlihat
    pdClose.focus();                              // fokus ke tombol tutup untuk keyboard users
  }

  // Fungsi menutup detail: sembunyikan overlay dengan animasi singkat
  function closeDetail() {
    detailSection.removeAttribute('open');        // hilangkan state "open" => CSS hide
    pdCard.setAttribute('aria-hidden','true');   // accessibility
    // tunggu transisi (sesuaikan durasi jika CSS berbeda), lalu sembunyikan dari DOM
    setTimeout(() => detailSection.hidden = true, 180);
  }

  // Parse data dari elemen produk (.pro) menjadi objek yang mudah digunakan
  function parseProduct(el) {
    const img = el.querySelector('img')?.getAttribute('src') || '';           // src gambar
    const title = el.querySelector('.des h5')?.textContent.trim() || '';      // judul
    const price = el.querySelector('.des h4')?.textContent.trim() || '';      // harga
    const category = el.querySelector('.des span')?.textContent.trim() || ''; // kategori
    // contoh deskripsi singkat yang dibuat dari data yang ada
    const desc = `${title} - Kategori: ${category}. Harga: ${price}. Spesifikasi lengkap bisa ditambahkan di sini.`;
    return { img, title, price, category, desc };
  }

  // Pasang event click pada setiap elemen produk untuk membuka detail
  proEls.forEach(pro => {
    pro.style.cursor = 'pointer';               // beri tanda bisa diklik
    pro.addEventListener('click', (e) => {
      // jika klik elemen <a> di dalam .pro, biarkan link bekerja (jangan buka modal)
      if (e.target.closest('a')) return;
      const data = parseProduct(pro);           // ambil data produk dari DOM
      openDetail(data);                         // buka dialog detail dengan data itu
    });
  });

  // Pasang handler untuk menutup dialog (klik backdrop atau tombol close)
  pdBackdrop.addEventListener('click', closeDetail);
  pdClose.addEventListener('click', closeDetail);
  pdClose2.addEventListener('click', closeDetail);

  // Tutup dialog saat user menekan Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !detailSection.hidden) closeDetail();
  });

  // Handler tombol "Tambah ke Keranjang" dalam dialog detail
  pdAdd.addEventListener('click', () => {
    // Buat objek item berdasarkan isi dialog
    const item = {
      id: pdTitle.textContent.trim().toLowerCase().replace(/\s+/g,'-'), // id sederhana dari judul
      title: pdTitle.textContent,
      price: pdPrice.textContent,
      img: pdImg.src
    };

    // Simpan di localStorage dengan key "techmarket_cart"
    const CART_KEY = 'techmarket_cart';
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]'); // baca cart sekarang
    const idx = cart.findIndex(i => i.id === item.id);

    if (idx > -1) {
      // jika item sudah ada, tambahkan quantity
      cart[idx].qty = (cart[idx].qty || 1) + 1;
    } else {
      // jika belum ada, masukkan item baru dengan qty default 1
      cart.push(Object.assign({ qty: 1 }, item));
    }

    // simpan kembali ke localStorage
    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    // notifikasi kecil di pojok bawah sebagai umpan balik
    const toast = document.createElement('div');
    toast.textContent = `"${item.title}" ditambahkan ke keranjang`;
    toast.style.cssText = 'position:fixed;right:20px;bottom:20px;padding:10px 14px;background:#222;color:#fff;border-radius:8px;z-index:1100;';
    document.body.appendChild(toast);

    // fade dan hapus notifikasi setelah beberapa waktu
    setTimeout(() => { toast.style.opacity = '0'; }, 1400);
    setTimeout(() => toast.remove(), 1800);
  });
});