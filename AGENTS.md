# Portfolio Project - Plan & Architecture

Dokumen ini mencatat seluruh rencana awal, spesifikasi fitur, arsitektur data, alur media, dan log perubahan pada proyek website portfolio.

---

## 1. Ringkasan Proyek
- **Tujuan**: Website portofolio personal profesional dan dinamis dengan manajemen konten terintegrasi (Biodata, What I Do, Experiences/Organizations, Education, Skills, Projects), multi-bahasa (ID/EN), Cloudinary media management, dan PostgreSQL Supabase.
- **Platform Deployment**: Vercel.
- **Path Direktori**: `C:\Users\NITRO 5\Documents\GitHub\Portfolio`

---

## 2. Tech Stack Terpilih
- **Frontend / Framework**: Next.js (React + TypeScript + App Router)
- **Styling**: Tailwind CSS
- **Icon System**:
  - UI Navigasi & Aksi: `@phosphor-icons/react` / `lucide-react`
  - Tech & Tool Icons: Resolusi cerdas melalui Devicon CDN / Simple Icons CDN dengan fallback manual upload Cloudinary
- **Database**: PostgreSQL di Supabase
- **Media Storage**: Cloudinary (dengan folder prefix modular: `portfolio/*`)
- **Multi-language (i18n)**: EN (English) & ID (Bahasa Indonesia) pada UI static dan database fields

---

## 3. Struktur Entitas & Database Schema (Supabase PostgreSQL)

### 3.1. Tabel `profile` (Biodata & What I Do)
Menampung identitas personal dan highlight headline/fokus peran:
```sql
CREATE TABLE profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL, -- e.g. "Software Developer | PHP & Laravel Specialist"
  title_id VARCHAR(255) NOT NULL,
  bio_en TEXT NOT NULL,
  bio_id TEXT NOT NULL,
  what_i_do_en TEXT[] NOT NULL, -- list headline / bullet point kemampuan utama
  what_i_do_id TEXT[] NOT NULL,
  avatar_url TEXT,
  resume_url TEXT,
  email VARCHAR(255),
  linkedin_url VARCHAR(255),
  github_url VARCHAR(255),
  instagram_url VARCHAR(255),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2. Tabel `experiences` (Work, Organization, Committee)
Mencakup seluruh jejak karier, magang, freelance, organisasi, dan kepanitiaan:
```sql
CREATE TYPE experience_type AS ENUM (
  'internship',
  'working',
  'freelance',
  'organization',
  'committee'
);

CREATE TABLE experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type experience_type NOT NULL,
  organization_name VARCHAR(255) NOT NULL,
  role_en VARCHAR(255) NOT NULL,
  role_id VARCHAR(255) NOT NULL,
  description_en TEXT NOT NULL,
  description_id TEXT NOT NULL,
  logo_url TEXT,
  media_urls TEXT[],
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  location VARCHAR(255),
  technologies TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.3. Tabel `education`
Riwayat pendidikan formal / sertifikasi:
```sql
CREATE TABLE education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  institution VARCHAR(255) NOT NULL,
  degree_en VARCHAR(255) NOT NULL,
  degree_id VARCHAR(255) NOT NULL,
  field_of_study_en VARCHAR(255) NOT NULL,
  field_of_study_id VARCHAR(255) NOT NULL,
  description_en TEXT,
  description_id TEXT,
  logo_url TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  score_gpa VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.4. Tabel `skills` (Teknologi & Tool Umum)
Mendukung skill teknis (PHP, Laravel) maupun non-teknis/tool kantor (Excel, Word, dll):
```sql
CREATE TYPE skill_category AS ENUM ('programming', 'framework', 'tools_office', 'database', 'design', 'other');

CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  category skill_category DEFAULT 'other',
  icon_type VARCHAR(50) NOT NULL, -- 'web_devicon', 'web_simpleicon', 'url', 'cloudinary'
  icon_url TEXT NOT NULL,
  proficiency_level VARCHAR(50), -- optional ('beginner', 'intermediate', 'advanced')
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.5. Tabel `projects` (Multi-Photo, Cover Setting & Relasi Experience)
Dukungan banyak foto dengan salah satu ditunjuk sebagai thumbnail/cover, serta relasi opsional ke riwayat pengalaman:
```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_id UUID REFERENCES experiences(id) ON DELETE SET NULL, -- Relasi opsional ke tempat kerja/magang/organisasi
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description_en TEXT NOT NULL,
  description_id TEXT NOT NULL,
  cover_image_url TEXT NOT NULL, -- URL gambar cover utama
  gallery_urls TEXT[] DEFAULT '{}', -- Array URL gambar-gambar dokumentasi lainnya
  technologies TEXT[],
  project_url TEXT,
  repository_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Mekanisme Resolusi Icon Skill (Smart Icon Checker)
Pengguna tidak diwajibkan mengunggah file untuk setiap icon skill:
1. **Langkah 1 (Input Nama Skill)**: Pengguna mengetik nama (misal: `Laravel`, `PHP`, `Excel`, `Word`, `PostgreSQL`).
2. **Langkah 2 (Tombol "Check Icon")**:
   - Sistem melakukan pengecekan ke repositori icon publik populer (Devicon & Simple Icons via CDN):
     - Devicon: `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/{name}/{name}-original.svg`
     - Simple Icons: `https://cdn.simpleicons.org/{slug}` (mencakup tool seperti Microsoft Excel, Word, Figma, dsb).
   - Menampilkan visual preview icon secara instan di form sebelum disimpan.
3. **Langkah 3 (Pilihan Alternatif / Fallback)**:
   - Jika ditemukan: Pengguna klik konfirmasi, URL CDN disimpan ke database.
   - Jika pengguna memiliki link icon sendiri: Tersedia field input URL langsung + tombol preview.
   - Jika tidak ditemukan di web atau ingin icon kustom: Tersedia form upload file manual ke Cloudinary (`portfolio/skills`).

---

## 5. Rencana Arsitektur Cloudinary (Modular Prefix Folder)
Semua media yang diunggah ke Cloudinary dikelompokkan ke folder root `portfolio/` dengan subfolder sesuai modul:
- `portfolio/projects/` : Foto cover dan galeri proyek.
- `portfolio/experiences/` : Logo perusahaan, institusi, atau media kegiatan/sertifikat event.
- `portfolio/skills/` : Icon kustom jika diupload manual.
- `portfolio/profile/` : Foto biodata/avatar profil dan resume/CV.

Mekanisme Upload:
- Serverless API route Next.js (`/api/upload`) atau Cloudinary Signed Upload Widget yang menginjeksi parameter `folder: portfolio/{table_name}`.

---

## 6. Rencana Multi-Bahasa (EN / ID)
1. **Data Statis (UI Core)**:
   - File dictionary: `src/locales/en.json` dan `src/locales/id.json`.
   - Meliputi: teks menu navbar, judul bagian ("Work Experience", "Education", "Skills", "Let's Connect"), label filter, status empty/loading.
2. **Data Dinamis (Database)**:
   - Setiap tabel konten naratif memiliki pasangan kolom:
     - `bio_en` & `bio_id`
     - `what_i_do_en` & `what_i_do_id`
     - `role_en` & `role_id`
     - `description_en` & `description_id`
   - UI akan otomatis beralih memanggil field sesuai locale aktif saat switch EN/ID diklik.

---

## 7. Rencana Desain Layout & Footer "Let's Connect"
- **Header / Navbar**:
  - Logo / Nama Brand
  - Navigasi link (About, Experience, Education, Skills, Projects)
  - Language Switcher (ID / EN)
  - Theme Toggle (Light / Dark)
- **Halaman Depan (Homepage Layout Flow)**:
  1. **Hero Section**: Biodata singkat, nama, headline peran ("Software Developer, PHP, Laravel"), avatar, CTA kontak & download CV.
  2. **Experience & Organization Section**: Timeline interaktif dengan tab filter (`All`, `Working`, `Internship`, `Freelance`, `Organization`, `Committee`). Menampilkan item sorotan (misal 4-6 item terbaru) + tombol ekspansi `"View All Experiences"` (bisa inline accordion expand atau link ke `/experiences`).
  3. **Projects Section**: Showcase proyek unggulan (featured) dengan cover image, tech tags, direct link, dan modal galeri. Tersedia tombol `"View All Projects"` menuju katalog lengkap (`/projects`).
  4. **Education Section**: Riwayat studi formal, institusi, gelar, tahun, dan pencapaian.
  5. **What I Do Section**: Penjelasan mendalam mengenai pilar keahlian teknis dan spesialisasi solusi yang ditawarkan.
  6. **Skills Section**: Grid kartu skill dengan icon visual cerdas (Devicon/SimpleIcons) mencakup programming & office tools dengan filter kategori.
  7. **Footer "Let's Connect"**: Konsisten dengan form/akses cepat Email, LinkedIn, Instagram, GitHub.
- **Footer "Let's Connect" (Konsisten di setiap halaman)**:
  - Heading ajakan kolaborasi: *"Let's Connect / Mari Terhubung"*
  - Akses cepat komunikasi:
    - Email (ikon + `mailto:`)
    - LinkedIn (ikon + link profil)
    - Instagram (ikon + link profil)
    - GitHub (ikon + link profil)
  - Hak cipta & status ketersediaan kerja (Open for work / freelance).

---

## 8. Standar UI/UX Design (Neo-Brutalism & Anti-Slop Craftsmanship)
- **Visual Style (Neo-Brutalism)**:
  - **Borders**: Garis tegas solid hitam/kontras pekat (`border-2 border-black dark:border-white` atau `border-[3px]`).
  - **Hard Drop Shadows**: Bayangan tegas tanpa blur (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]` dan mode dark `dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]`).
  - **Radius**: Sudut tegas terukur (`rounded-none` atau konsisten slight boxy `rounded-md` dengan border tebal).
  - **Palet Warna**: Kontras tinggi, aksen warna berani namun fungsional (misal: Yellow `#FACC15`, Electric Lime `#A3E635`, atau Vivid Cyan/Orange) dipadukan dengan background bersih (`#F4F4F0` / `#FAFAFA` di light mode, `#121212` / `#0A0A0A` di dark mode).
  - **Interaksi Tactile (Micro-feedback)**: Saat hover/active, tombol dan card memiliki efek menekan fisik (`active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-100`).
- **Dials Baseline**: VARIANCE 7, MOTION 4, DENSITY 5.
- **Tipografi**:
  - Headings: Heavy Grotesk Display (`Space Grotesk` / `Archivo` / `Outfit` Black/Bold uppercase tracking rapat).
  - Body & Telemetry: `Geist` / `Inter` yang sangat terbaca dengan `Geist Mono` / `JetBrains Mono` untuk metadata dan label.
- **Aksesibilitas (WCAG AA)**:
  - Kontras teks rasio minimal 4.5:1 untuk normal text, 3:1 untuk large text.
  - Target klik/touch minimal 44x44px di mobile.
  - State UI lengkap: Skeleton loader neo-brutalist (kotak berpola garis tegas), empty state, error feedback.
  - Navigasi keyboard penuh dengan focus ring kontras tinggi.

---

## 9. Rencana Struktur Folder
```text
Portfolio/
├── AGENT.md
├── .env.local
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── admin/
│   │   │   ├── page.tsx               (Dashboard kelola konten)
│   │   │   ├── experiences/page.tsx
│   │   │   ├── skills/page.tsx        (Icon checker & skill list)
│   │   │   └── projects/page.tsx      (Multi-photo gallery & cover picker)
│   │   └── api/
│   │       ├── upload/route.ts        (Cloudinary signed/folder upload)
│   │       ├── check-icon/route.ts    (Tester/verifier Devicon & SimpleIcons)
│   │       ├── experiences/route.ts
│   │       ├── skills/route.ts
│   │       └── projects/route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx             ("Let's Connect": Email, LinkedIn, IG)
│   │   ├── sections/
│   │   │   ├── Hero.tsx               (Bio & What I Do)
│   │   │   ├── ExperienceSection.tsx  (Tabs: Internship, Working, Freelance, Org, Committee)
│   │   │   ├── EducationSection.tsx
│   │   │   ├── SkillSection.tsx
│   │   │   └── ProjectSection.tsx     (Cover & Gallery Modal)
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Skeleton.tsx
│   │       └── IconPreview.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── cloudinary.ts
│   │   └── icon-checker.ts
│   └── locales/
│       ├── en.json
│       └── id.json
```

---

## 10. Log Perubahan Rencana (Changelog)
- **2026-10-30**: Inisiasi dokumen rencana awal (Next.js, Tailwind, Supabase, Cloudinary, EN/ID).
- **2026-10-30**: Penambahan kategori `organization` dan `committee` ke dalam enum pengalaman kerja.
- **2026-10-30**: Ekspansi spesifikasi lengkap:
  1. Penambahan entitas `profile` (Biodata & What I Do dengan input dwibahasa ID & EN).
  2. Penambahan entitas `education` dan `skills`.
  3. Fitur cerdas **Icon Checker** untuk skills (auto-detect Simple Icons/Devicon, custom URL, fallback manual Cloudinary).
  4. Penambahan entitas `projects` dengan multi-foto dan pemilihan cover utama.
  5. Konfigurasi folder prefix Cloudinary modular (`portfolio/projects`, `portfolio/experiences`, dll).
  6. Standarisasi Footer **"Let's Connect"** (Email, LinkedIn, Instagram).
- **2026-10-30**: Integrasi protokol urutan pemanggilan skills UI/UX (Impeccable, Antislop, UI/UX Pro Max, antislop-ui/human/layoutmobile/copywriting/code, style skills).
- **2026-10-30**: Penetapan keputusan arsitektur UI/UX:
  1. Struktur: Single-page landing dengan deep anchor links (ramah recruiter dev & non-dev yang hanya punya waktu 10-30 detik untuk scanning).
  2. Tema: Dual-theme (Light & Dark mode toggle) dengan default mengikuti sistem OS pengguna untuk kenyamanan HR/Recruiter.
  3. Projects Preview: Modal Dialog / Drawer cepat dengan lazy-loading gambar galeri (data teks di-load ringan di awal, foto ukuran penuh di-fetch on-demand saat dibuka).
  4. Autentikasi Admin: Supabase Auth (Email & Password) resmi untuk keamanan dashboard `/admin`.
  5. Relasi Pengalaman & Proyek: Kolom `experience_id` pada tabel `projects` memungkinkan card pengalaman (kantor/magang/organisasi) secara otomatis menampilkan sub-badge/thumbnail proyek yang dikerjakan saat periode tersebut. Mengklik proyek tersebut langsung memicu preview modal tanpa meninggalkan riwayat kerja.
- **2026-10-30**: Mandat Wajib Penggunaan Skill UI/UX: AI Agent diwajibkan selalu memanggil dan mematuhi seluruh skill UI/UX yang tersedia (`impeccable`, `antislop` mode during, `ui-ux-pro-max`, `antislop-ui`, `antislop-human`, `antislop-layoutmobile`, `antislop-copywriting`, `antislop-code`, dan `industrial-brutalist-ui`) pada setiap iterasi perencanaan, review, pembuatan komponen, styling, copywriting, hingga delivery kode.

---

## 11. Mandat & Aturan Wajib UI/UX (Standing Directive)
AI Agent **HARUS SELALU** menggunakan seluruh skill UI/UX yang tersedia di sistem dalam setiap tahapan pengerjaan frontend, tanpa terkecuali:
1. **Impeccable**: Kualitas craft level director, standar `craft-floor.md`, mode Experience untuk portfolio dan Operate untuk admin, verifikasi bounded pass.
2. **Antislop (Mode: During)**: Mencegah dan memfilter AI slop, no generic gradients, no em-dash (`—`), no fake metrics, no dead links, wajib delivery gate pass.
3. **UI/UX Pro Max**: Pemanfaatan database rules desain (kontras, aksesibilitas, responsive touch target 44px, spacing, semantic tokens).
4. **Antislop Sub-Skills**:
   - `antislop-ui`: Variasi visual, komponen, kontrol dosis glow/shadow/radius.
   - `antislop-human`: Aksesibilitas WCAG AA (4.5:1), keyboard navigation (Tab/Enter/Escape), visual focus outline.
   - `antislop-layoutmobile`: Mobile-first responsive, zero horizontal overflow, thumb tap area.
   - `antislop-copywriting`: Copy natural, humanis, spesifik, jujur tanpa buzzwords kosong.
   - `antislop-code`: Komentar kode bersih dan esensial, tanpa AI boilerplate.
5. **Style Skill (Neo-Brutalism & Industrial Brutalist)**: Border 2px solid, hard drop shadows tanpa blur, tactile active state, micro-typography monospace untuk tag/metadata.

---

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read `antislop.md` (core) and then the skill for the task:
- UI / visual: `skills/antislop-ui/SKILL.md`
- Copy & text: `skills/antislop-copywriting/SKILL.md`
- People: `skills/antislop-human/SKILL.md`
- Mobile / responsive: `skills/antislop-layoutmobile/SKILL.md`
- Code comments: `skills/antislop-code/SKILL.md`
Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits, using the actual mode and source. Acknowledging the user's request without naming the source does not replace this notice.
Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.
If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept. For read-only tasks, put the active-mode notice only at the start of the final answer, never in progress messages. For editing tasks, announce before the first edit and omit it from the final answer.
To update antislop later: download `antislop.md` again, or run `npx antislop-ai --update` if it was installed as skill folders.
<!-- antislop:end -->

