(()=>{
const C=window.CFG||{},$=s=>document.querySelector(s);
const sb=(C.SUPABASE_URL&&C.SUPABASE_ANON_KEY&&window.supabase)?window.supabase.createClient(C.SUPABASE_URL,C.SUPABASE_ANON_KEY,{auth:{flowType:"pkce"}}):null;
let user=null,ready=false;
const main=$("main"),views={login:$("#v-login"),prd:$("#v-prd"),admin:$("#v-admin")};
const isAdmin=()=>!!(user&&C.ADMIN_EMAIL&&(user.email||"").toLowerCase()===C.ADMIN_EMAIL.toLowerCase());
const say=(el,t,ok)=>{el.textContent=t;el.style.color=ok?"var(--gd)":""};
const tgl=d=>new Date(d).toLocaleDateString("id-ID");

// ---------- tampilan & router ----------
function show(n){main.hidden=n!=="home";for(const k in views)views[k].hidden=k!==n}
function route(){if(!ready)return;const h=decodeURIComponent(location.hash.slice(1));
 if(h==="login"&&user){location.hash="prd";return}
 if(h==="prd"&&!user){sessionStorage.setItem("next","prd");location.hash="login";return}
 if(h==="admin"&&!isAdmin()){location.hash="beranda";return}
 if(views[h]){show(h);scrollTo(0,0);
  if(h==="login")say($("#lmsg"),sb?"":"Login belum dikonfigurasi (isi config.js).");
  if(h==="prd")loadHist();if(h==="admin")admList();return}
 const was=!main.hidden;show("home");
 const el=h&&document.getElementById(h);if(!was){el?el.scrollIntoView():scrollTo(0,0)}}
addEventListener("hashchange",route);

function renderAuth(){const b=$("#authbox");b.textContent="";
 if(!user){const a=document.createElement("a");a.className="l";a.href="#login";a.textContent="Masuk";b.append(a)}
 else{const m=user.user_metadata||{},s=document.createElement("span");s.className="ab";
  const u=m.avatar_url||m.picture;
  if(u&&safeUrl(u)){const i=new Image();i.className="av";i.alt="";i.referrerPolicy="no-referrer";i.src=u;s.append(i)}
  const n=document.createElement("span");n.className="an";n.textContent=m.full_name||m.name||user.email;s.append(n);
  const o=document.createElement("button");o.type="button";o.className="btn btn-o btn-s";o.textContent="Logout";
  o.onclick=async()=>{await sb.auth.signOut();location.hash="beranda"};s.append(o);b.append(s)}
 $("#navadm").hidden=!isAdmin()}

$("#gbtn").onclick=async()=>{const m=$("#lmsg");
 if(!sb)return say(m,"Login belum dikonfigurasi (isi config.js).");
 const {error}=await sb.auth.signInWithOAuth({provider:"google",options:{redirectTo:location.origin+location.pathname}});
 if(error)say(m,"Gagal membuka login Google: "+error.message)};

// ---------- portofolio publik dari Supabase ----------
const norm=r=>({id:r.id,nama:r.judul,kategori:r.kategori,deskripsi:r.deskripsi||"",demo:r.link_demo||"",gambar:r.link_gambar||""});
async function loadPortfolio(){if(!sb)return;
 const {data,error}=await sb.from("portfolios").select("*").order("created_at",{ascending:true});
 PORTFOLIO=error?SEED:data.map(norm);drawPf()}

// ---------- Buat PRD ----------
const PG={"Landing Page (1 halaman)":["Satu halaman: Hero, Penawaran/Produk, Keunggulan, Testimoni, Kontak"],
"Company Profile":["Beranda","Tentang Kami","Layanan","Portofolio","Kontak"],
"Toko Online / Katalog":["Beranda","Katalog Produk","Detail Produk","Testimoni","Kontak"],
"Website Sekolah":["Beranda","Profil Sekolah","Program dan Kegiatan","Berita","Pendaftaran","Kontak"],
"Sistem Informasi":["Login","Dashboard","Data Utama","Laporan","Pengaturan Pengguna"],
"Lainnya":["Beranda","Halaman utama sesuai kebutuhan","Kontak"]};
const FT={"Toko Online / Katalog":["Katalog produk dengan foto dan harga","Tombol pesan ke WhatsApp di tiap produk"],
"Sistem Informasi":["Login dan hak akses pengguna","Input dan rekap data","Laporan sederhana"],
"Website Sekolah":["Halaman berita","Info pendaftaran siswa baru"]};
const BASE=["Tampilan responsif di HP dan laptop","Tombol WhatsApp","Dasar SEO dan judul halaman jelas"];
$("#pj").innerHTML=Object.keys(PG).map(k=>`<option>${esc(k)}</option>`).join("");
function build(v){const ft=[...new Set([...BASE,...(FT[v.jenis]||[]),...v.fitur.split(/[\n,;]+/).map(x=>x.trim()).filter(Boolean)])];
return `PRD WEBSITE ${v.nama.toUpperCase()}

1. NAMA WEBSITE
${v.nama} (${v.jenis})

2. UNTUK SIAPA
Target pembeli/pengguna: ${v.target}

3. HALAMAN APA SAJA
${PG[v.jenis].map(x=>"- "+x).join("\n")}

4. FITUR WAJIB
${ft.map(x=>"- "+x).join("\n")}

5. WARNA DAN GAYA
Warna utama: ${v.warna||"belum ditentukan, pilih yang sesuai citra bisnis"}
Gaya: modern, bersih, mudah dibaca di HP, tombol besar dan mudah ditekan.

6. TOMBOL WA
Tombol WhatsApp melayang di kanan bawah semua halaman, ditambah tombol pesan di tiap produk/layanan dengan pesan otomatis sesuai produk/layanan.
Nomor WhatsApp bisnis: (isi nomor WA bisnis Anda)
`}
let lastPrd="",lastName="prd";
const showPrd=(t,n)=>{lastPrd=t;lastName=n;$("#pout").textContent=t};
$("#pf2").addEventListener("submit",async e=>{e.preventDefault();const m=$("#pmsg");say(m,"");
 const v={nama:$("#pn").value.trim(),jenis:$("#pj").value,target:$("#pt").value.trim(),fitur:$("#pfit").value.trim(),warna:$("#pw").value.trim()};
 if(v.nama.length<2||v.target.length<2)return say(m,"Isi nama bisnis dan target pembeli.");
 const t=build(v);showPrd(t,v.nama);
 if(sb&&user){const {error}=await sb.from("prd_history").insert({nama_bisnis:v.nama,input:v,hasil:t});
  if(error)say(m,"PRD jadi, tapi riwayat gagal disimpan: "+error.message);else loadHist()}});
$("#pcp").onclick=async()=>{if(!lastPrd)return;try{await navigator.clipboard.writeText(lastPrd);say($("#pmsg"),"PRD disalin.",true)}catch(_){say($("#pmsg"),"Gagal menyalin, blok teks lalu salin manual.")}};
$("#pdl").onclick=()=>{if(!lastPrd)return;const a=document.createElement("a");
 a.href=URL.createObjectURL(new Blob([lastPrd],{type:"text/markdown"}));
 a.download="PRD-"+(lastName.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"website")+".md";a.click();URL.revokeObjectURL(a.href)};
async function loadHist(){const box=$("#phist");if(!sb||!user){box.textContent="";return}
 const {data,error}=await sb.from("prd_history").select("id,nama_bisnis,hasil,created_at").order("created_at",{ascending:false}).limit(20);
 box.textContent="";if(error){box.textContent="Riwayat gagal dimuat.";return}
 if(!data.length){box.textContent="Belum ada riwayat.";return}
 data.forEach(r=>{const d=document.createElement("div");d.className="row";const s=document.createElement("span");s.textContent=`${r.nama_bisnis} (${tgl(r.created_at)})`;
  const b=document.createElement("button");b.type="button";b.className="btn btn-o btn-s";b.textContent="Lihat";b.onclick=()=>showPrd(r.hasil,r.nama_bisnis);d.append(s,b);box.append(d)})}

// ---------- Admin portofolio ----------
let editId=null;
$("#ak").innerHTML=CATS.map(c=>`<option>${esc(c)}</option>`).join("");
function resetForm(){editId=null;$("#af").reset();$("#acn").hidden=true}
$("#acn").onclick=()=>{resetForm();say($("#amsg"),"")};
async function admList(){const box=$("#alist");box.textContent="";if(!sb)return;
 const {data,error}=await sb.from("portfolios").select("*").order("created_at",{ascending:true});
 if(error){box.textContent="Gagal memuat: "+error.message;return}
 if(!data.length){box.textContent="Belum ada portofolio.";return}
 data.forEach(r=>{const d=document.createElement("div");d.className="row";const s=document.createElement("span");s.textContent=`${r.judul} (${r.kategori})`;
  const a=document.createElement("span");a.className="act";
  const e=document.createElement("button");e.type="button";e.className="btn btn-o btn-s";e.textContent="Edit";
  e.onclick=()=>{editId=r.id;$("#aj").value=r.judul;$("#ak").value=r.kategori;$("#ag").value=r.link_gambar||"";$("#ad").value=r.link_demo||"";$("#ax").value=r.deskripsi||"";$("#acn").hidden=false;say($("#amsg"),"Mengedit: "+r.judul,true);scrollTo(0,0)};
  const x=document.createElement("button");x.type="button";x.className="btn btn-o btn-s";x.textContent="Hapus";
  x.onclick=async()=>{if(!confirm(`Hapus "${r.judul}"?`))return;
   const {data:del,error:er}=await sb.from("portfolios").delete().eq("id",r.id).select();
   if(er||!del.length)return say($("#amsg"),"Gagal menghapus"+(er?": "+er.message:" (tidak diizinkan)."));
   if(editId===r.id)resetForm();say($("#amsg"),"Terhapus.",true);admList();loadPortfolio()};
  a.append(e,x);d.append(s,a);box.append(d)})}
$("#af").addEventListener("submit",async e=>{e.preventDefault();const m=$("#amsg");
 if(!isAdmin()||!sb)return say(m,"Hanya admin yang boleh menyimpan.");
 const p={judul:$("#aj").value.trim(),kategori:$("#ak").value,link_gambar:$("#ag").value.trim()||null,link_demo:$("#ad").value.trim()||null,deskripsi:$("#ax").value.trim()||null};
 if(!p.judul)return say(m,"Judul wajib diisi.");
 if((p.link_gambar&&!safeUrl(p.link_gambar))||(p.link_demo&&!safeUrl(p.link_demo)))return say(m,"Link harus diawali http:// atau https:// (atau path relatif untuk demo).");
 const q=editId?sb.from("portfolios").update(p).eq("id",editId).select():sb.from("portfolios").insert(p).select();
 const {data,error}=await q;
 if(error||!data.length)return say(m,"Gagal menyimpan"+(error?": "+error.message:" (tidak diizinkan)."));
 say(m,"Tersimpan.",true);resetForm();admList();loadPortfolio()});

// ---------- mulai ----------
(async()=>{
 if(sb){const {data}=await sb.auth.getSession();user=data.session?.user||null;
  sb.auth.onAuthStateChange((ev,s)=>{user=s?.user||null;setTimeout(()=>{renderAuth();route()},0)});
  loadPortfolio()}
 ready=true;renderAuth();
 const nx=sessionStorage.getItem("next");
 if(user&&nx&&!location.hash){sessionStorage.removeItem("next");location.hash=nx}else route();
})();
})();
