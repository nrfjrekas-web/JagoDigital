const IC=['<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>','<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>','<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>','<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.5 11h11L21 7H6"/>','<path d="M4 21V5l8-2v18M12 9l8 2v10M3 21h18M8 9h1M8 13h1M8 17h1M16 15h1M16 18h1"/>','<path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>','<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>'].map(p=>`<svg viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`);

// ===== Data yang dikelola pemilik (isi bila sudah benar & disetujui) =====
const WA="6289601793889";
const APPS_SCRIPT_URL=""; // URL Web App Google Apps Script untuk simpan ke Spreadsheet
const PORTFOLIO=[]; // {nama,kategori,deskripsi,teknologi:[],demo,gambar:"assets/nama.webp"} (demo & gambar opsional)
const PACKAGES=[];  // {nama,harga,deskripsi,fitur:[],estimasi,unggulan}
const TESTIMONIALS=[]; // {nama,usaha,isi,rating,foto} hanya yang disetujui (rating & foto opsional)
const CATS=["Website Bisnis","Website Sekolah","Sistem Informasi","Aplikasi Administrasi","E-Commerce","Website Organisasi"];
const SERVICES=[
["Website Bisnis dan Organisasi","Website resmi untuk usaha, komunitas, dan organisasi Anda.",["Halaman profil dan layanan","Tampilan responsif","Tombol WhatsApp"]],
["Sistem Informasi dan Manajemen","Sistem untuk mengelola data dan informasi secara terpusat.",["Data tersimpan terpusat","Hak akses pengguna","Laporan sederhana"]],
["Aplikasi Administrasi dan Operasional","Aplikasi web untuk merapikan pekerjaan administrasi harian.",["Input dan rekap data","Dashboard admin","Ekspor data"]],
["Website Toko Online / E-Commerce","Etalase produk online dengan alur pemesanan.",["Katalog produk","Keranjang dan pesanan","Dashboard pesanan"]],
["Website Company Profile","Profil perusahaan yang rapi untuk membangun kepercayaan.",["Profil dan portofolio","Kontak dan peta","Dasar SEO"]],
["Aplikasi Custom Sesuai Kebutuhan","Aplikasi web yang dirancang khusus untuk alur kerja Anda.",["Analisis kebutuhan","Fitur sesuai permintaan","Pendampingan"]],
["Integrasi Payment Gateway dan QRIS","Pembayaran online terhubung ke website atau aplikasi Anda.",["Integrasi pembayaran","Dukungan QRIS","Status pembayaran"]]];
const FAQ=[
["Berapa biaya pembuatan website?","Biaya tergantung kebutuhan dan fitur. Konsultasikan lewat WhatsApp untuk mendapat penawaran."],
["Berapa lama proses pengerjaan?","Estimasi waktu disepakati bersama setelah kebutuhan dibahas."],
["Apakah website bisa dibuka melalui HP?","Ya, website dirancang responsif untuk HP, tablet, laptop, dan desktop."],
["Apakah tersedia domain dan hosting?","Tanyakan ketersediaan dan opsinya saat konsultasi."],
["Apakah bisa membuat aplikasi sesuai kebutuhan?","Bisa. Ceritakan alur kerja Anda dan kami bahas solusinya."],
["Apakah tersedia maintenance?","Tanyakan skema maintenance saat konsultasi."],
["Apakah website dapat dikembangkan kembali?","Ya, fitur dapat ditambah sesuai kebutuhan berikutnya."]];
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const wa=t=>`https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
const DEF="Halo JagoDigital, saya tertarik menggunakan jasa pembuatan website. Saya ingin berkonsultasi mengenai kebutuhan website saya.";
document.querySelectorAll("[data-wa]").forEach(a=>a.href=wa(DEF));
// nav
const nav=$("#nav"),bg=$("#burger");
bg.onclick=()=>{const o=nav.classList.toggle("open");bg.setAttribute("aria-expanded",o);bg.setAttribute("aria-label",o?"Tutup menu":"Buka menu")};
nav.addEventListener("click",e=>{if(e.target.closest("a")){nav.classList.remove("open");bg.setAttribute("aria-expanded",false)}});
// layanan
$("#svc").innerHTML=SERVICES.map((s,i)=>`<article class="card"><div class="n">${IC[i]}</div><h3>${esc(s[0])}</h3><p>${esc(s[1])}</p>
<details><summary>Detail</summary><ul>${s[2].map(f=>`<li>${esc(f)}</li>`).join("")}</ul></details>
<div class="act"><a class="btn btn-g btn-s" target="_blank" rel="noopener" href="${wa(`Halo JagoDigital, saya tertarik dengan layanan ${s[0]}. Saya ingin berkonsultasi.`)}">Konsultasi WhatsApp</a></div></article>`).join("");
$("#fl").innerHTML=SERVICES.map(s=>`<li><a href="#layanan">${esc(s[0])}</a></li>`).join("");
$("#js").innerHTML=SERVICES.map(s=>`<option>${esc(s[0])}</option>`).join("");
// portofolio
let cat="Semua";
function drawCats(){$("#cats").innerHTML=["Semua",...CATS].map(c=>`<button class="chip" aria-pressed="${c===cat}" data-c="${esc(c)}">${esc(c)}</button>`).join("")}
function drawPf(){const q=$("#q").value.toLowerCase().trim();
const r=PORTFOLIO.filter(p=>(cat==="Semua"||p.kategori===cat)&&p.nama.toLowerCase().includes(q));
$("#pf").innerHTML=r.length?r.map(p=>`<article class="card">${p.gambar?`<img class="thumb" src="${esc(p.gambar)}" alt="Tampilan proyek ${esc(p.nama)}" loading="lazy">`:""}<span class="pill">${esc(p.kategori)}</span><h3 style="margin-top:10px">${esc(p.nama)}</h3><p>${esc(p.deskripsi)}</p><p>${(p.teknologi||[]).map(t=>`<span class="pill">${esc(t)}</span>`).join(" ")}</p>${p.demo?`<div class="act"><a class="btn btn-o btn-s" target="_blank" rel="noopener" href="${esc(p.demo)}">Lihat Demo</a></div>`:""}</article>`).join(""):
`<div class="empty"><b>${PORTFOLIO.length?"Tidak ada proyek yang cocok.":"Portofolio sedang disiapkan."}</b><p>${PORTFOLIO.length?"Coba kata kunci atau kategori lain.":"Ingin melihat contoh pekerjaan? Minta lewat WhatsApp."}</p>${PORTFOLIO.length?"":`<a class="btn btn-o btn-s" target="_blank" rel="noopener" href="${wa("Halo JagoDigital, saya ingin melihat contoh portofolio Anda.")}">Minta contoh via WhatsApp</a>`}</div>`}
$("#cats").onclick=e=>{const b=e.target.closest("[data-c]");if(b){cat=b.dataset.c;drawCats();drawPf()}};$("#q").oninput=drawPf;drawCats();drawPf();
// harga
$("#pk").innerHTML=PACKAGES.length?PACKAGES.map(p=>`<article class="card" ${p.unggulan?'style="border-color:var(--g);border-width:2px"':""}>${p.unggulan?'<span class="pill">Unggulan</span>':""}<h3>${esc(p.nama)}</h3><p style="font-size:1.6rem;font-weight:800;color:var(--ink);margin:0">${esc(p.harga)}</p><p>${esc(p.deskripsi)}</p><ul>${p.fitur.map(f=>`<li>${esc(f)}</li>`).join("")}</ul><p><b>Estimasi:</b> ${esc(p.estimasi)}</p><div class="act"><a class="btn btn-g btn-s" target="_blank" rel="noopener" href="${wa(`Halo JagoDigital, saya ingin memesan paket ${p.nama}.`)}">Pesan Sekarang</a></div></article>`).join(""):
`<div class="empty"><b>Harga disesuaikan kebutuhan</b><p>Paket dan harga resmi akan ditampilkan di sini. Sementara itu, minta penawaran lewat WhatsApp.</p><a class="btn btn-g btn-s" target="_blank" rel="noopener" href="${wa("Halo JagoDigital, saya ingin meminta penawaran harga pembuatan website.")}">Minta Penawaran</a></div>`;
// testimoni
if(TESTIMONIALS.length){$("#testi").hidden=false;$("#navt").hidden=false;$("#tt").innerHTML=TESTIMONIALS.map(t=>`<article class="card">${t.foto?`<img class="ava" src="${esc(t.foto)}" alt="${esc(t.nama)}" loading="lazy">`:""}<p>“${esc(t.isi)}”</p><b>${esc(t.nama)}</b><span class="pill">${esc(t.usaha)}</span><p>${"★".repeat(t.rating||0)}</p></article>`).join("")}
// faq
$("#fq").innerHTML=FAQ.map(f=>`<details><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join("");
// form
const f=$("#f"),msg=$("#msg");
const setE=(k,t)=>document.querySelector(`[data-e="${k}"]`).textContent=t;
f.addEventListener("submit",async e=>{e.preventDefault();msg.className="";msg.textContent="";
const v={nm:$("#nm").value.trim(),us:$("#us").value.trim(),wan:$("#wan").value.trim(),em:$("#em").value.trim(),js:$("#js").value,bg:$("#bg").value.trim(),ds:$("#ds").value.trim()};
let ok=true;const chk=(k,c,t)=>{setE(k,c?"":t);if(c)ok=false};
chk("nm",v.nm.length<2,"Isi nama Anda.");chk("wan",!/^(\+?62|0)8[0-9]{7,12}$/.test(v.wan.replace(/[\s-]/g,"")),"Nomor WhatsApp tidak valid.");
chk("em",v.em&&!/^\S+@\S+\.\S+$/.test(v.em),"Format email tidak valid.");chk("ds",v.ds.length<10,"Jelaskan kebutuhan minimal 10 karakter.");chk("pv",!$("#pv").checked,"Persetujuan diperlukan.");
if(!ok)return;
const text=`Halo JagoDigital, saya ${v.nm}${v.us?` dari ${v.us}`:""}. Saya tertarik dengan layanan ${v.js}.${v.bg?` Anggaran: ${v.bg}.`:""}\nKebutuhan: ${v.ds}`;
const btn=$("#sb");btn.disabled=true;btn.textContent="Mengirim…";let saved=null;
if(APPS_SCRIPT_URL){try{const r=await fetch(APPS_SCRIPT_URL,{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify({...v,source:"website",created_at:new Date().toISOString()})});saved=r.ok}catch(_){saved=false}}
btn.disabled=false;btn.textContent="Kirim dan lanjut ke WhatsApp";
if(saved===false){msg.className="bad";msg.innerHTML=`Data belum tersimpan. Anda tetap bisa lanjut lewat WhatsApp: <a target="_blank" rel="noopener" href="${wa(text)}">buka WhatsApp</a>.`}
else{msg.className="ok";msg.innerHTML=`${saved?"Permintaan terkirim. ":""}Lanjutkan konsultasi: <a target="_blank" rel="noopener" href="${wa(text)}"><b>buka WhatsApp</b></a>.`;if(saved)f.reset()}
});

document.querySelectorAll("section h2,section .card,.faq details").forEach(e=>e.classList.add("rv"));
if("IntersectionObserver" in window){const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.1});document.querySelectorAll(".rv").forEach(e=>io.observe(e))}else document.querySelectorAll(".rv").forEach(e=>e.classList.add("in"));
