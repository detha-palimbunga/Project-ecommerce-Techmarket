// Konstanta: key yang dipakai untuk menyimpan/mengambil data keranjang di localStorage
const CART_KEY = 'techmarket_cart';

/*
  Fungsi loadCart:
  - Mengambil string JSON dari localStorage menggunakan CART_KEY.
  - Mengembalikan array objek keranjang; jika tidak ada atau gagal parse, kembalikan array kosong.
*/
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (err) {
    // Jika JSON corrupt atau terjadi error, jaga agar aplikasi tetap aman dengan mengembalikan array kosong
    return [];
  }
}

/*
  Fungsi saveCart:
  - Menyimpan array cart ke localStorage (stringify).
  - Memanggil renderCart() untuk memperbarui tampilan di halaman setelah perubahan.
*/
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
}

/*
  Helper formatCurrency:
  - Placeholder untuk pemformatan harga. Saat ini hanya mengembalikan string apa adanya.
  - Di masa depan bisa diubah untuk menambahkan pemformatan Rp, koma ribuan, dsb.
*/
function formatCurrency(text) {
  return text;
}

/*
  Fungsi renderCart:
  - Mengambil elemen #cart-wrapper dan data cart dari localStorage.
  - Jika cart kosong: tampilkan pesan "Keranjang kosong".
  - Jika ada item: buat elemen DOM untuk setiap item (gambar, judul, harga, qty, tombol hapus).
  - Pasang event listener untuk setiap tombol "Hapus".
*/
function renderCart() {
  const wrapper = document.getElementById('cart-wrapper');
  const cart = loadCart();
  wrapper.innerHTML = '';               // kosongkan kontainer sebelum render ulang
  const msg = document.getElementById('msg');
  if (msg) msg.innerHTML = '';          // bersihkan pesan notifikasi sebelumnya

  if (!cart.length) {
    // Tampilkan pesan kalau keranjang kosong
    wrapper.innerHTML = `<div class="empty">Keranjang kosong. Tambahkan produk terlebih dahulu.</div>`;
    return;
  }

  // Untuk setiap item di cart, buat elemen visual
  cart.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.img || 'no-image.png'}" alt="${item.title}">
      <div class="meta">
        <h5>${item.title}</h5>
        <div class="price">${formatCurrency(item.price || '')}</div>
        <div class="qty">Jumlah: ${item.qty || 1}</div>
      </div>
      <div class="actions d-flex flex-column align-items-end gap-2">
        <button class="btn-remove" data-idx="${idx}">Hapus</button>
      </div>
    `;
    wrapper.appendChild(div);
  });

  // Pasang event listener untuk semua tombol Hapus yang baru dibuat
  wrapper.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx);
      removeItemAt(idx);
    });
  });
}

/*
  Fungsi removeItemAt(index):
  - Menghapus item pada posisi index di array cart.
  - Menyimpan perubahan dan menampilkan pesan sukses.
*/
function removeItemAt(index) {
  const cart = loadCart();
  if (index < 0 || index >= cart.length) return;
  const removed = cart.splice(index, 1); // hapus item
  saveCart(cart);                         // simpan perubahan
  showMessage(`"${removed[0].title}" berhasil dihapus dari keranjang.`, 'success');
}

/*
  Fungsi clearCart:
  - Menghapus seluruh data keranjang dari localStorage.
  - Render ulang tampilan dan tampilkan pesan informasi.
*/
function clearCart() {
  localStorage.removeItem(CART_KEY);
  renderCart();
  showMessage('Keranjang telah dikosongkan.', 'info');
}

/*
  Fungsi checkout:
  - Jika keranjang kosong: tampilkan pesan error.
  - Jika ada item: simulasi pemesanan berhasil -> hapus cart dan tampilkan pesan sukses.
  - Di aplikasi nyata: di sini harus memanggil API/backend untuk memproses pesanan.
*/
function checkout() {
  const cart = loadCart();
  if (!cart.length) {
    showMessage('Pesan tidak berhasil — tidak ada product di keranjang.', 'danger');
    return;
  }

  // Simulasi pemesanan berhasil: hapus cart dan beri umpan balik
  localStorage.removeItem(CART_KEY);
  renderCart();
  showMessage('Pemesanan berhasil. Terima kasih — pesanan Anda sedang diproses.', 'success');
}

/*
  Fungsi showMessage:
  - Menampilkan notifikasi singkat di elemen #msg dengan kelas alert bootstrap.
  - Menghapus pesan setelah 3 detik.
  - Parameter type mengikuti kelas alert-<type> Bootstrap (info, success, danger, dll).
*/
function showMessage(text, type = 'info') {
  const msg = document.getElementById('msg');
  if (!msg) return;
  msg.innerHTML = `<div class="alert alert-${type}" role="alert">${text}</div>`;
  setTimeout(() => { msg.innerHTML = ''; }, 3000);
}

/*
  Inisialisasi:
  - Setelah DOM siap, render tampilan keranjang awal.
  - Pasang event listener untuk tombol "Kosongkan Keranjang" dan "Checkout" jika elemen tersebut ada.
*/
document.addEventListener('DOMContentLoaded', () => {
  renderCart(); // render awal

  const clearBtn = document.getElementById('clear-cart');
  if (clearBtn) clearBtn.addEventListener('click', clearCart);

  const checkoutBtn = document.getElementById('checkout');
  if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
});