# PRODUCT.md — Personal Developer Portfolio

## 1. Product Truth
- **What this is**: Dynamic, high-craft personal portfolio web application highlighting Software Development capabilities (PHP, Laravel, modern web architectures).
- **Primary Audience**: Technical recruiters, engineering managers, and non-technical HR/talent acquisition professionals seeking reliable proof of work.
- **Surface Mode**: **Experience** (leading with proof of work, projects, and career milestones) combined with **Operate** for the authenticated admin CMS (`/admin`).

## 2. Core Value Proposition
- Clear, immediate scanning of who the developer is and what they build within 15–30 seconds.
- Interactive showcase linking real-world work/internship/organization experiences directly to specific projects delivered.
- Smart icon resolution for technical skills and productivity tools (Devicon + Simple Icons + Cloudinary manual fallback).
- Full bilingual experience (EN / ID) across all static UI and dynamic content.

## 3. Key Entities & Capabilities
1. **Profile / Hero**: Bio, headline role, avatar, CV download, social communication links.
2. **Experience & Organization**: Filterable timeline (Working, Internship, Freelance, Organization, Committee) with linked project previews.
3. **Projects Showcase**: Multi-image support with cover photo designation and lazy-loaded modal galleries.
4. **Education**: Formal background, degree, dates, and achievements.
5. **What I Do**: Core technical competencies and solution focus.
6. **Skills Matrix**: Auto-checked CDN icons + manual fallback for software and office tools.
7. **Let's Connect (Footer)**: Fast direct contact via Email, LinkedIn, Instagram, and GitHub.
8. **Admin CMS (`/admin`)**: Protected via Supabase Auth for live CRUD and Cloudinary modular media uploads (`portfolio/*`).

## 4. Technical Constraints & Targets
- **Stack**: Next.js (App Router, Server Components, TypeScript), Tailwind CSS.
- **Database**: PostgreSQL on Supabase.
- **Media**: Cloudinary signed uploads with dedicated prefixes.
- **Performance & a11y**: WCAG AA compliance (4.5:1 text contrast), touch targets min 44x44px, zero horizontal overflow, Lighthouse score targets: LCP < 2.5s, CLS < 0.1.
