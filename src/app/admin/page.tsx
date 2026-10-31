"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { SmartIconChecker } from "@/components/admin/SmartIconChecker";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import {
  User,
  Briefcase,
  FolderGit2,
  Trophy,
  Cpu,
  GraduationCap,
  LogOut,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  ExternalLink,
  Star,
  GripVertical,
} from "lucide-react";

type Tab = "profile" | "experiences" | "projects" | "achievements" | "skills" | "education";

export default function AdminDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Data states
  const [profile, setProfile] = useState<any>({});
  const [experiences, setExperiences] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);

  // Check Auth & Fetch Data
  useEffect(() => {
    async function init() {
      const loggedIn = localStorage.getItem("admin_logged_in") === "true";
      if (!loggedIn) {
        router.push("/login");
        return;
      }
      const savedUser = localStorage.getItem("admin_username") || "naish";
      setUserEmail(`@${savedUser}`);
      await fetchAllData();
      setLoading(false);
    }
    init();
  }, []);

  const fetchAllData = async () => {
    try {
      const [pRes, eRes, prRes, aRes, sRes, edRes] = await Promise.all([
        fetch("/api/profile").then((r) => r.json()),
        fetch("/api/experiences").then((r) => r.json()),
        fetch("/api/projects").then((r) => r.json()),
        fetch("/api/achievements").then((r) => r.json()),
        fetch("/api/skills").then((r) => r.json()),
        fetch("/api/education").then((r) => r.json()),
      ]);

      if (pRes) setProfile(pRes);
      if (Array.isArray(eRes)) setExperiences(eRes);
      if (Array.isArray(prRes)) setProjects(prRes);
      if (Array.isArray(aRes)) setAchievements(aRes);
      if (Array.isArray(sRes)) setSkills(sRes);
      if (Array.isArray(edRes)) setEducation(edRes);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/login", { method: "DELETE" });
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_username");
    router.push("/login");
  };

  const flashMessage = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Drag and drop reordering handler
  const [draggedItemIdx, setDraggedItemIdx] = useState<number | null>(null);

  const handleReorder = async (
    entity: "skills" | "projects" | "experiences" | "achievements" | "education",
    sourceIdx: number,
    targetIdx: number
  ) => {
    if (sourceIdx === targetIdx) return;

    let updatedList: any[] = [];
    if (entity === "skills") updatedList = [...skills];
    else if (entity === "projects") updatedList = [...projects];
    else if (entity === "experiences") updatedList = [...experiences];
    else if (entity === "achievements") updatedList = [...achievements];
    else if (entity === "education") updatedList = [...education];

    const [moved] = updatedList.splice(sourceIdx, 1);
    updatedList.splice(targetIdx, 0, moved);

    // Update local state immediately for snappy UX
    if (entity === "skills") setSkills(updatedList);
    else if (entity === "projects") setProjects(updatedList);
    else if (entity === "experiences") setExperiences(updatedList);
    else if (entity === "achievements") setAchievements(updatedList);
    else if (entity === "education") setEducation(updatedList);

    // Persist to database
    try {
      const itemsPayload = updatedList.map((item, idx) => ({ id: item.id, display_order: idx }));
      const res = await fetch("/api/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity, items: itemsPayload }),
      });
      if (res.ok) {
        flashMessage("Urutan berhasil diperbarui & disimpan!");
      }
    } catch (e) {
      console.error("Reorder save error:", e);
    }
  };

  // 1. Profile Handlers
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (res.ok) flashMessage("Profil berhasil disimpan!");
  };

  // 2. Experience Handlers (Add & Edit)
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [newExp, setNewExp] = useState({
    type: "working",
    organization_name: "",
    role_en: "",
    role_id: "",
    description_en: "",
    description_id: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    is_current: false,
    location: "",
    technologies: "",
  });

  const handleStartEditExp = (exp: any) => {
    setEditingExpId(exp.id);
    setNewExp({
      type: exp.type,
      organization_name: exp.organization_name,
      role_en: exp.role_en,
      role_id: exp.role_id,
      description_en: exp.description_en,
      description_id: exp.description_id,
      start_date: exp.start_date ? exp.start_date.split("T")[0] : "",
      end_date: exp.end_date ? exp.end_date.split("T")[0] : "",
      is_current: Boolean(exp.is_current),
      location: exp.location || "",
      technologies: Array.isArray(exp.technologies) ? exp.technologies.join(", ") : "",
    });
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleCancelEditExp = () => {
    setEditingExpId(null);
    setNewExp({
      type: "working",
      organization_name: "",
      role_en: "",
      role_id: "",
      description_en: "",
      description_id: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
      is_current: false,
      location: "",
      technologies: "",
    });
  };

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...newExp,
      technologies: newExp.technologies.split(",").map((t) => t.trim()).filter(Boolean),
      id: editingExpId || undefined,
    };

    const method = editingExpId ? "PUT" : "POST";
    const res = await fetch("/api/experiences", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      flashMessage(editingExpId ? "Pengalaman berhasil diperbarui!" : "Pengalaman baru ditambahkan!");
      handleCancelEditExp();
      fetchAllData();
    }
  };

  const handleDeleteExp = async (id: string) => {
    if (!confirm("Hapus pengalaman ini?")) return;
    await fetch(`/api/experiences?id=${id}`, { method: "DELETE" });
    fetchAllData();
  };

  // 3. Project Handlers (Add & Edit)
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [newProj, setNewProj] = useState({
    title: "",
    slug: "",
    description_en: "",
    description_id: "",
    cover_image_url: "",
    gallery_urls: [] as string[],
    technologies: "",
    project_url: "",
    repository_url: "",
    experience_id: "",
    achievement_id: "",
    isFeatured: true,
  });

  const handleStartEditProj = (proj: any) => {
    setEditingProjId(proj.id);
    const linkedAch = Array.isArray(proj.achievements) && proj.achievements.length > 0
      ? proj.achievements[0].id
      : achievements.find((a: any) => a.project_id === proj.id)?.id || "";

    setNewProj({
      title: proj.title,
      slug: proj.slug,
      description_en: proj.description_en,
      description_id: proj.description_id,
      cover_image_url: proj.cover_image_url,
      gallery_urls: Array.isArray(proj.gallery_urls) ? proj.gallery_urls : [],
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(", ") : "",
      project_url: proj.project_url || "",
      repository_url: proj.repository_url || "",
      experience_id: proj.experience_id || "",
      achievement_id: linkedAch,
      isFeatured: Boolean(proj.isFeatured),
    });
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleCancelEditProj = () => {
    setEditingProjId(null);
    setNewProj({
      title: "",
      slug: "",
      description_en: "",
      description_id: "",
      cover_image_url: "",
      gallery_urls: [],
      technologies: "",
      project_url: "",
      repository_url: "",
      experience_id: "",
      achievement_id: "",
      isFeatured: true,
    });
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...newProj,
      technologies: newProj.technologies.split(",").map((t) => t.trim()).filter(Boolean),
      experience_id: newProj.experience_id || null,
      id: editingProjId || undefined,
    };

    const method = editingProjId ? "PUT" : "POST";
    const res = await fetch("/api/projects", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      flashMessage(editingProjId ? "Proyek berhasil diperbarui!" : "Proyek baru berhasil disimpan!");
      handleCancelEditProj();
      fetchAllData();
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Hapus proyek ini?")) return;
    await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
    fetchAllData();
  };

  // 4. Skills Handlers (Add & Edit)
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState({
    name: "",
    category: "programming",
    icon_type: "web_devicon",
    iconUrl: "",
    display_order: 0,
  });

  const handleStartEditSkill = (s: any) => {
    setEditingSkillId(s.id);
    setNewSkill({
      name: s.name,
      category: s.category || "programming",
      icon_type: s.icon_type,
      iconUrl: s.iconUrl,
      display_order: s.display_order || 0,
    });
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleCancelEditSkill = () => {
    setEditingSkillId(null);
    setNewSkill({
      name: "",
      category: "programming",
      icon_type: "web_devicon",
      iconUrl: "",
      display_order: 0,
    });
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...newSkill,
      id: editingSkillId || undefined,
    };

    const method = editingSkillId ? "PUT" : "POST";
    const res = await fetch("/api/skills", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      flashMessage(editingSkillId ? "Skill berhasil diperbarui!" : "Skill baru berhasil ditambahkan!");
      handleCancelEditSkill();
      fetchAllData();
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Hapus skill ini?")) return;
    await fetch(`/api/skills?id=${id}`, { method: "DELETE" });
    fetchAllData();
  };

  // 5. Achievement Handlers (Add & Edit)
  const [editingAchId, setEditingAchId] = useState<string | null>(null);
  const [newAch, setNewAch] = useState({
    title_en: "",
    title_id: "",
    issuer: "",
    issue_date: new Date().toISOString().split("T")[0],
    description_en: "",
    description_id: "",
    certificate_url: "",
    credential_url: "",
  });

  const handleStartEditAch = (ach: any) => {
    setEditingAchId(ach.id);
    setNewAch({
      title_en: ach.title_en,
      title_id: ach.title_id,
      issuer: ach.issuer,
      issue_date: ach.issue_date ? ach.issue_date.split("T")[0] : "",
      description_en: ach.description_en || "",
      description_id: ach.description_id || "",
      certificate_url: ach.certificate_url || "",
      credential_url: ach.credential_url || "",
    });
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleCancelEditAch = () => {
    setEditingAchId(null);
    setNewAch({
      title_en: "",
      title_id: "",
      issuer: "",
      issue_date: new Date().toISOString().split("T")[0],
      description_en: "",
      description_id: "",
      certificate_url: "",
      credential_url: "",
    });
  };

  const handleAddAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...newAch,
      id: editingAchId || undefined,
    };

    const method = editingAchId ? "PUT" : "POST";
    const res = await fetch("/api/achievements", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      flashMessage(editingAchId ? "Prestasi berhasil diperbarui!" : "Prestasi baru berhasil disimpan!");
      handleCancelEditAch();
      fetchAllData();
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    if (!confirm("Hapus prestasi ini?")) return;
    await fetch(`/api/achievements?id=${id}`, { method: "DELETE" });
    fetchAllData();
  };

  // 6. Education Handlers (Add & Edit)
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [newEdu, setNewEdu] = useState({
    institution: "",
    degreeEn: "",
    degreeId: "",
    fieldOfStudyEn: "",
    fieldOfStudyId: "",
    descriptionEn: "",
    descriptionId: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    isCurrent: false,
    scoreGpa: "",
  });

  const handleStartEditEdu = (edu: any) => {
    setEditingEduId(edu.id);
    setNewEdu({
      institution: edu.institution,
      degreeEn: edu.degreeEn || edu.degreeId,
      degreeId: edu.degreeId,
      fieldOfStudyEn: edu.fieldOfStudyEn || edu.fieldOfStudyId,
      fieldOfStudyId: edu.fieldOfStudyId,
      descriptionEn: edu.descriptionEn || "",
      descriptionId: edu.descriptionId || "",
      startDate: edu.startDate ? edu.startDate.split("T")[0] : "",
      endDate: edu.endDate ? edu.endDate.split("T")[0] : "",
      isCurrent: Boolean(edu.isCurrent),
      scoreGpa: edu.scoreGpa || "",
    });
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleCancelEditEdu = () => {
    setEditingEduId(null);
    setNewEdu({
      institution: "",
      degreeEn: "",
      degreeId: "",
      fieldOfStudyEn: "",
      fieldOfStudyId: "",
      descriptionEn: "",
      descriptionId: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      isCurrent: false,
      scoreGpa: "",
    });
  };

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...newEdu,
      id: editingEduId || undefined,
    };

    const method = editingEduId ? "PUT" : "POST";
    const res = await fetch("/api/education", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      flashMessage(editingEduId ? "Riwayat pendidikan berhasil diperbarui!" : "Riwayat pendidikan berhasil disimpan!");
      handleCancelEditEdu();
      fetchAllData();
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm("Hapus riwayat pendidikan ini?")) return;
    await fetch(`/api/education?id=${id}`, { method: "DELETE" });
    fetchAllData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#FFFFFF] dark:bg-[#000000]">
        <div className="p-8 bg-[#FFFFFF] dark:bg-[#000000] border-4 border-black dark:border-white rounded-2xl shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#FFFFFF] flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-[#E2FF00] border-2 border-black rounded-lg flex items-center justify-center animate-spin">
            <Cpu className="w-6 h-6 text-black" />
          </div>
          <span className="font-mono font-black text-sm uppercase tracking-wider text-black dark:text-white">
            MEMUAT ADMIN CONSOLE...
          </span>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "profile", label: "Biodata / Profile", icon: User },
    { key: "experiences", label: "Pengalaman & Organisasi", icon: Briefcase },
    { key: "projects", label: "Proyek & Portofolio", icon: FolderGit2 },
    { key: "achievements", label: "Prestasi & Sertifikat", icon: Trophy },
    { key: "skills", label: "Skills & Icon Checker", icon: Cpu },
    { key: "education", label: "Pendidikan", icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#000000] flex flex-col">
      {/* Top Bar */}
      <header className="bg-[#FFFFFF] dark:bg-[#000000] border-b-2 border-black dark:border-white px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-[#E2FF00] text-black font-black font-mono text-sm border-2 border-black rounded-md shadow-[2px_2px_0px_0px_#000]">
            ADMIN CONSOLE
          </span>
          <span className="text-xs font-mono font-bold hidden sm:inline text-black/70 dark:text-white/70">
            {userEmail}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {saveStatus && (
            <span className="flex items-center gap-1 text-xs font-mono font-bold text-black bg-[#E2FF00] px-3 py-1 border-2 border-black rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5" /> {saveStatus}
            </span>
          )}

          <a
            href="/"
            target="_blank"
            className="px-3 py-1.5 bg-[#FFFFFF] dark:bg-[#000000] text-black dark:text-white font-mono font-bold text-xs uppercase border-2 border-black dark:border-white rounded-md shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] neo-lift-hover flex items-center gap-1"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 bg-[#FF6B35] text-white font-mono font-bold text-xs uppercase border-2 border-black dark:border-white rounded-md flex items-center gap-1 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] neo-lift-hover"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="max-w-6xl w-full mx-auto p-4 md:p-8 flex-1 flex flex-col gap-6">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b-2 border-black dark:border-white pb-3">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as Tab)}
                className={`px-4 py-2 border-2 border-black dark:border-white rounded-md font-mono font-black text-xs uppercase flex items-center gap-2 transition-all neo-lift-hover ${
                  active
                    ? "bg-[#635BFF] text-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF]"
                    : "bg-[#FFFFFF] dark:bg-[#000000] text-black dark:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] hover:bg-[#E2FF00] hover:text-black dark:hover:bg-[#E2FF00] dark:hover:text-black"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: PROFILE & BIODATA */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-xl p-6 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] flex flex-col gap-4">
            <h2 className="text-xl font-black uppercase text-black dark:text-white border-b-2 border-black dark:border-white pb-2">
              KONTEN BIODATA & WHAT I DO
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold mb-1">NAMA LENGKAP</label>
                <input
                  type="text"
                  value={profile.fullName || ""}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-sm font-mono text-black dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold mb-1">EMAIL KONTAK</label>
                <input
                  type="email"
                  value={profile.email || ""}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-sm font-mono text-black dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold mb-1">TITLE PERAN (EN)</label>
                <input
                  type="text"
                  value={profile.title_en || ""}
                  onChange={(e) => setProfile({ ...profile, title_en: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-sm font-mono text-black dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold mb-1">TITLE PERAN (ID)</label>
                <input
                  type="text"
                  value={profile.title_id || ""}
                  onChange={(e) => setProfile({ ...profile, title_id: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-sm font-mono text-black dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MarkdownEditor
                label="BIODATA DESKRIPSI (EN)"
                value={profile.bio_en || ""}
                onChange={(val) => setProfile({ ...profile, bio_en: val })}
                rows={4}
              />
              <MarkdownEditor
                label="BIODATA DESKRIPSI (ID)"
                value={profile.bio_id || ""}
                onChange={(val) => setProfile({ ...profile, bio_id: val })}
                rows={4}
              />
            </div>

            {/* Cloudinary Media Uploader for Avatar & Resume */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-lg">
              <div>
                <MediaUploader
                  module="profile"
                  label="Unggah Foto Avatar / Profil"
                  onUploadSuccess={(url) => setProfile({ ...profile, avatar_url: url })}
                />
                {profile.avatar_url && (
                  <span className="text-[10px] font-mono break-all mt-1 block">URL: {profile.avatar_url}</span>
                )}
              </div>

              <div>
                <MediaUploader
                  module="profile"
                  label="Unggah Resume / CV (PDF)"
                  accept="application/pdf"
                  onUploadSuccess={(url) => setProfile({ ...profile, resume_url: url })}
                />
                {profile.resume_url && (
                  <span className="text-[10px] font-mono break-all mt-1 block">URL: {profile.resume_url}</span>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold mb-1">LINKEDIN URL</label>
                <input
                  type="text"
                  value={profile.linkedin_url || ""}
                  onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold mb-1">GITHUB URL</label>
                <input
                  type="text"
                  value={profile.github_url || ""}
                  onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold mb-1">INSTAGRAM URL</label>
                <input
                  type="text"
                  value={profile.instagram_url || ""}
                  onChange={(e) => setProfile({ ...profile, instagram_url: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 px-6 py-3 bg-[#E2FF00] text-black font-black uppercase text-sm border-2 border-black dark:border-white rounded-lg shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] self-start flex items-center gap-2 neo-lift-hover"
            >
              <Save className="w-4 h-4" />
              <span>SIMPAN PERUBAHAN BIODATA</span>
            </button>
          </form>
        )}

        {/* TAB 2: EXPERIENCES */}
        {activeTab === "experiences" && (
          <div className="flex flex-col gap-6">
            {/* Add/Edit Form */}
            <form onSubmit={handleAddExperience} className="bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-xl p-6 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] flex flex-col gap-4">
              <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2">
                <h3 className="text-lg font-black uppercase text-black dark:text-white">
                  {editingExpId ? "✏️ EDIT PENGALAMAN" : "+ TAMBAH PENGALAMAN / ORGANISASI"}
                </h3>
                {editingExpId && (
                  <button
                    type="button"
                    onClick={handleCancelEditExp}
                    className="text-xs font-mono font-bold text-[#FF6B35] underline"
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold mb-1">TIPE</label>
                  <select
                    value={newExp.type}
                    onChange={(e) => setNewExp({ ...newExp, type: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono font-bold text-black dark:text-white"
                  >
                    <option value="working">Working</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                    <option value="organization">Organization</option>
                    <option value="committee">Committee</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold mb-1">NAMA INSTANSI / ORGANISASI</label>
                  <input
                    type="text"
                    required
                    value={newExp.organization_name}
                    onChange={(e) => setNewExp({ ...newExp, organization_name: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold mb-1">LOKASI (KOTA/NEGARA)</label>
                  <input
                    type="text"
                    value={newExp.location}
                    onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold mb-1">JABATAN / ROLE (EN)</label>
                  <input
                    type="text"
                    required
                    value={newExp.role_en}
                    onChange={(e) => setNewExp({ ...newExp, role_en: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold mb-1">JABATAN / ROLE (ID)</label>
                  <input
                    type="text"
                    required
                    value={newExp.role_id}
                    onChange={(e) => setNewExp({ ...newExp, role_id: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                  />
                </div>
              </div>

              {/* Tanggal Masuk & Tanggal Keluar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end p-3 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-lg">
                <div>
                  <label className="block text-xs font-mono font-bold mb-1">TANGGAL MASUK / MULAI</label>
                  <input
                    type="date"
                    required
                    value={newExp.start_date}
                    onChange={(e) => setNewExp({ ...newExp, start_date: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold mb-1">TANGGAL KELUAR / SELESAI</label>
                  <input
                    type="date"
                    disabled={newExp.is_current}
                    value={newExp.end_date}
                    onChange={(e) => setNewExp({ ...newExp, end_date: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white disabled:opacity-40"
                  />
                </div>

                <div className="flex items-center gap-2 pb-2">
                  <input
                    type="checkbox"
                    id="exp_is_current"
                    checked={newExp.is_current}
                    onChange={(e) => setNewExp({ ...newExp, is_current: e.target.checked, end_date: e.target.checked ? "" : newExp.end_date })}
                    className="w-4 h-4 accent-[#635BFF]"
                  />
                  <label htmlFor="exp_is_current" className="text-xs font-mono font-bold cursor-pointer">
                    Masih Aktif / Sekarang
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <MarkdownEditor
                  label="DESKRIPSI PENGALAMAN (EN)"
                  required
                  rows={4}
                  value={newExp.description_en}
                  onChange={(val) => setNewExp({ ...newExp, description_en: val })}
                />
                <MarkdownEditor
                  label="DESKRIPSI PENGALAMAN (ID)"
                  required
                  rows={4}
                  value={newExp.description_id}
                  onChange={(val) => setNewExp({ ...newExp, description_id: val })}
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold mb-1">TECHNOLOGIES (Pisahkan Koma, misal: PHP, Laravel, Docker)</label>
                <input
                  type="text"
                  value={newExp.technologies}
                  onChange={(e) => setNewExp({ ...newExp, technologies: e.target.value })}
                  placeholder="PHP, Laravel, PostgreSQL"
                  className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#635BFF] text-white font-black text-xs uppercase border-2 border-black dark:border-white rounded-lg shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] self-start flex items-center gap-2 neo-lift-hover"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingExpId ? "SIMPAN PERUBAHAN" : "TAMBAH PENGALAMAN"}</span>
                </button>
                {editingExpId && (
                  <button
                    type="button"
                    onClick={handleCancelEditExp}
                    className="px-4 py-2.5 bg-[#FFFFFF] dark:bg-[#000000] text-black dark:text-white font-black text-xs uppercase border-2 border-black dark:border-white rounded-lg neo-lift-hover"
                  >
                    BATAL
                  </button>
                )}
              </div>
            </form>

            {/* List */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black uppercase font-mono">
                  DAFTAR PENGALAMAN TERSIMPAN ({experiences.length})
                </h3>
                <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                  <GripVertical className="w-3.5 h-3.5" /> Drag & drop baris untuk mengubah urutan
                </span>
              </div>
              {experiences.map((exp, idx) => (
                <div
                  key={exp.id}
                  draggable
                  onDragStart={() => setDraggedItemIdx(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedItemIdx !== null) {
                      handleReorder("experiences", draggedItemIdx, idx);
                      setDraggedItemIdx(null);
                    }
                  }}
                  className="p-4 bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-xl shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing hover:border-[#635BFF] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-gray-400 hover:text-black dark:hover:text-white" />
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-[#9D93FF] text-black font-bold border border-black uppercase mr-2 rounded-sm">
                        {exp.type}
                      </span>
                      <span className="font-black text-sm uppercase">{exp.role_id}</span>
                      <span className="text-xs text-[#FF6B35] font-bold block">{exp.organization_name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEditExp(exp)}
                      className="px-3 py-1.5 bg-[#E2FF00] text-black font-mono font-bold text-xs uppercase border-2 border-black rounded-md shadow-[2px_2px_0px_0px_#000] neo-lift-hover"
                      title="Edit"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDeleteExp(exp.id)}
                      className="p-2 bg-[#FF6B35] text-white border-2 border-black dark:border-white rounded-md shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] neo-lift-hover"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROJECTS */}
        {activeTab === "projects" && (
          <div className="flex flex-col gap-6">
            {/* Add/Edit Form with Multi-photo and Cover picker */}
            <form onSubmit={handleAddProject} className="bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-xl p-6 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] flex flex-col gap-4">
              <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2">
                <h3 className="text-lg font-black uppercase text-black dark:text-white">
                  {editingProjId ? "✏️ EDIT PROYEK" : "+ TAMBAH PROYEK (MULTI-FOTO & RELASI EXPERIENCE)"}
                </h3>
                {editingProjId && (
                  <button
                    type="button"
                    onClick={handleCancelEditProj}
                    className="text-xs font-mono font-bold text-[#FF6B35] underline"
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold mb-1">JUDUL PROYEK</label>
                  <input
                    type="text"
                    required
                    value={newProj.title}
                    onChange={(e) => setNewProj({ ...newProj, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold mb-1">SLUG (URL AUTO-GENERATE)</label>
                  <input
                    type="text"
                    required
                    value={newProj.slug}
                    onChange={(e) => setNewProj({ ...newProj, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold mb-1">TERKAIT PENGALAMAN (OPSIONAL)</label>
                  <select
                    value={newProj.experience_id}
                    onChange={(e) => setNewProj({ ...newProj, experience_id: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono font-bold text-black dark:text-white"
                  >
                    <option value="">-- Proyek Pribadi / Non-Perusahaan --</option>
                    {experiences.map((exp) => (
                      <option key={exp.id} value={exp.id}>
                        {exp.organization_name} ({exp.role_id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold mb-1">PRESTASI/SERTIFIKAT (OPSIONAL)</label>
                  <select
                    value={newProj.achievement_id}
                    onChange={(e) => setNewProj({ ...newProj, achievement_id: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono font-bold text-black dark:text-white"
                  >
                    <option value="">-- Tanpa Prestasi / Sertifikat --</option>
                    {achievements.map((ach) => (
                      <option key={ach.id} value={ach.id}>
                        {ach.title_id || ach.title_en} ({ach.issuer})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <MarkdownEditor
                  label="DESKRIPSI PROYEK (EN)"
                  required
                  rows={4}
                  value={newProj.description_en}
                  onChange={(val) => setNewProj({ ...newProj, description_en: val })}
                />
                <MarkdownEditor
                  label="DESKRIPSI PROYEK (ID)"
                  required
                  rows={4}
                  value={newProj.description_id}
                  onChange={(val) => setNewProj({ ...newProj, description_id: val })}
                />
              </div>

              {/* Cloudinary Multi-Photo Upload & Cover Setter */}
              <div className="p-4 bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-lg flex flex-col gap-3">
                <MediaUploader
                  module="projects"
                  label="Unggah Foto Proyek (Otomatis masuk portfolio/projects)"
                  onUploadSuccess={(url) => {
                    if (!newProj.cover_image_url) {
                      setNewProj((prev) => ({ ...prev, cover_image_url: url, gallery_urls: [...prev.gallery_urls, url] }));
                    } else {
                      setNewProj((prev) => ({ ...prev, gallery_urls: [...prev.gallery_urls, url] }));
                    }
                  }}
                />

                {newProj.gallery_urls.length > 0 && (
                  <div className="flex flex-col gap-1.5 mt-2">
                    <span className="text-xs font-mono font-bold uppercase text-black dark:text-white">
                      FOTO PROYEK (Klik foto untuk jadikan COVER UTAMA, klik tombol X merah untuk HAPUS):
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {newProj.gallery_urls.map((photo, i) => {
                        const isCover = newProj.cover_image_url === photo;
                        return (
                          <div
                            key={photo + i}
                            className={`relative w-28 h-20 border-2 rounded-md overflow-hidden group/thumb ${
                              isCover ? "border-[#FF6B35] shadow-[3px_3px_0px_0px_#FF6B35]" : "border-black dark:border-white opacity-85"
                            }`}
                          >
                            <img
                              src={photo}
                              alt=""
                              onClick={() => setNewProj({ ...newProj, cover_image_url: photo })}
                              className="w-full h-full object-cover cursor-pointer"
                              title="Klik untuk jadikan Cover Utama"
                            />

                            {/* Delete single photo button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const updatedGallery = newProj.gallery_urls.filter((p) => p !== photo);
                                let updatedCover = newProj.cover_image_url;
                                if (isCover) {
                                  updatedCover = updatedGallery.length > 0 ? updatedGallery[0] : "";
                                }
                                setNewProj({
                                  ...newProj,
                                  gallery_urls: updatedGallery,
                                  cover_image_url: updatedCover,
                                });
                              }}
                              className="absolute top-1 right-1 w-5 h-5 bg-[#FF6B35] text-white border border-black rounded flex items-center justify-center font-mono font-bold text-xs hover:scale-110 transition-transform shadow-[1px_1px_0px_0px_#000] z-10"
                              title="Hapus foto ini"
                            >
                              ✕
                            </button>

                            {isCover && (
                              <span className="absolute bottom-0 inset-x-0 bg-[#FF6B35] text-white text-[9px] font-mono font-black text-center py-0.5 pointer-events-none">
                                COVER UTAMA
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold mb-1">TECH STACK (Koma)</label>
                  <input
                    type="text"
                    value={newProj.technologies}
                    onChange={(e) => setNewProj({ ...newProj, technologies: e.target.value })}
                    placeholder="Laravel, Next.js, PostgreSQL"
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold mb-1">LIVE DEMO URL (OPSIONAL)</label>
                  <input
                    type="text"
                    value={newProj.project_url}
                    onChange={(e) => setNewProj({ ...newProj, project_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold mb-1">REPOSITORY URL (OPSIONAL)</label>
                  <input
                    type="text"
                    value={newProj.repository_url}
                    onChange={(e) => setNewProj({ ...newProj, repository_url: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!newProj.cover_image_url}
                  className="px-5 py-2.5 bg-[#E2FF00] text-black font-black text-xs uppercase border-2 border-black dark:border-white rounded-lg shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] self-start flex items-center gap-2 neo-lift-hover disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingProjId ? "SIMPAN PERUBAHAN" : "SIMPAN PROYEK"}</span>
                </button>
                {editingProjId && (
                  <button
                    type="button"
                    onClick={handleCancelEditProj}
                    className="px-4 py-2.5 bg-[#FFFFFF] dark:bg-[#000000] text-black dark:text-white font-black text-xs uppercase border-2 border-black dark:border-white rounded-lg neo-lift-hover"
                  >
                    BATAL
                  </button>
                )}
              </div>
            </form>

            {/* List */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black uppercase font-mono">
                  DAFTAR PROYEK ({projects.length})
                </h3>
                <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                  <GripVertical className="w-3.5 h-3.5" /> Drag & drop baris untuk mengubah urutan
                </span>
              </div>
              {projects.map((proj, idx) => (
                <div
                  key={proj.id}
                  draggable
                  onDragStart={() => setDraggedItemIdx(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedItemIdx !== null) {
                      handleReorder("projects", draggedItemIdx, idx);
                      setDraggedItemIdx(null);
                    }
                  }}
                  className="p-4 bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-xl shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing hover:border-[#635BFF] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-gray-400 hover:text-black dark:hover:text-white" />
                    <img src={proj.cover_image_url} alt="" className="w-14 h-10 object-cover border-2 border-black dark:border-white rounded-md" />
                    <div>
                      <span className="font-black text-sm uppercase">{proj.title}</span>
                      {proj.experiences && (
                        <span className="text-xs text-[#FF6B35] font-mono block">
                          Terkait: {proj.experiences.organization_name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEditProj(proj)}
                      className="px-3 py-1.5 bg-[#E2FF00] text-black font-mono font-bold text-xs uppercase border-2 border-black rounded-md shadow-[2px_2px_0px_0px_#000] neo-lift-hover"
                      title="Edit"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-2 bg-[#FF6B35] text-white border-2 border-black dark:border-white rounded-md shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] neo-lift-hover"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ACHIEVEMENTS */}
        {activeTab === "achievements" && (
          <div className="flex flex-col gap-6">
            <form onSubmit={handleAddAchievement} className="bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-xl p-6 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] flex flex-col gap-4">
              <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2">
                <h3 className="text-lg font-black uppercase text-black dark:text-white">
                  {editingAchId ? "✏️ EDIT PRESTASI / PENGHARGAAN" : "+ TAMBAH PRESTASI / PENGHARGAAN"}
                </h3>
                {editingAchId && (
                  <button
                    type="button"
                    onClick={handleCancelEditAch}
                    className="text-xs font-mono font-bold text-[#FF6B35] underline"
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold mb-1">NAMA PRESTASI (EN)</label>
                  <input
                    type="text"
                    required
                    value={newAch.title_en}
                    onChange={(e) => setNewAch({ ...newAch, title_en: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold mb-1">NAMA PRESTASI (ID)</label>
                  <input
                    type="text"
                    required
                    value={newAch.title_id}
                    onChange={(e) => setNewAch({ ...newAch, title_id: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold mb-1">PENYELENGGARA / ISSUER</label>
                  <input
                    type="text"
                    required
                    value={newAch.issuer}
                    onChange={(e) => setNewAch({ ...newAch, issuer: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold mb-1">TANGGAL PEROLEHAN</label>
                  <input
                    type="date"
                    required
                    value={newAch.issue_date}
                    onChange={(e) => setNewAch({ ...newAch, issue_date: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                  />
                </div>
              </div>

              {/* Cloudinary Image or PDF Uploader for Achievements */}
              <div className="p-4 bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-lg flex flex-col gap-2">
                <MediaUploader
                  module="achievements"
                  label="Unggah File Sertifikat / Foto Piagam (Gambar atau PDF)"
                  accept="image/*,application/pdf"
                  onUploadSuccess={(url) => setNewAch((prev) => ({ ...prev, certificate_url: url }))}
                />
                {newAch.certificate_url && (
                  <span className="text-[10px] font-mono break-all text-[#635BFF] dark:text-[#9D93FF]">
                    File tersimpan: {newAch.certificate_url}
                  </span>
                )}
              </div>

              {/* Deskripsi Markdown ID & EN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <MarkdownEditor
                  label="DESKRIPSI PRESTASI (EN)"
                  rows={3}
                  value={newAch.description_en}
                  onChange={(val) => setNewAch({ ...newAch, description_en: val })}
                  placeholder="Ceritakan tentang penghargaan ini (opsional)..."
                />
                <MarkdownEditor
                  label="DESKRIPSI PRESTASI (ID)"
                  rows={3}
                  value={newAch.description_id}
                  onChange={(val) => setNewAch({ ...newAch, description_id: val })}
                  placeholder="Ceritakan tentang penghargaan ini (opsional)..."
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold mb-1">LINK KREDENSIAL / WEBSITE PENYELENGGARA (OPSIONAL)</label>
                <input
                  type="text"
                  value={newAch.credential_url}
                  onChange={(e) => setNewAch({ ...newAch, credential_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#9D93FF] text-black font-black text-xs uppercase border-2 border-black dark:border-white rounded-lg shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] self-start flex items-center gap-2 neo-lift-hover"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingAchId ? "SIMPAN PERUBAHAN" : "SIMPAN PRESTASI"}</span>
                </button>
                {editingAchId && (
                  <button
                    type="button"
                    onClick={handleCancelEditAch}
                    className="px-4 py-2.5 bg-[#FFFFFF] dark:bg-[#000000] text-black dark:text-white font-black text-xs uppercase border-2 border-black dark:border-white rounded-lg neo-lift-hover"
                  >
                    BATAL
                  </button>
                )}
              </div>
            </form>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black uppercase font-mono">
                  DAFTAR PRESTASI ({achievements.length})
                </h3>
                <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                  <GripVertical className="w-3.5 h-3.5" /> Drag & drop baris untuk mengubah urutan
                </span>
              </div>
              {achievements.map((ach, idx) => (
                <div
                  key={ach.id}
                  draggable
                  onDragStart={() => setDraggedItemIdx(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedItemIdx !== null) {
                      handleReorder("achievements", draggedItemIdx, idx);
                      setDraggedItemIdx(null);
                    }
                  }}
                  className="p-4 bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-xl shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing hover:border-[#635BFF] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-gray-400 hover:text-black dark:hover:text-white" />
                    <div>
                      <span className="font-black text-sm uppercase">{ach.title_id}</span>
                      <span className="text-xs text-[#635BFF] dark:text-[#9D93FF] font-bold block">{ach.issuer}</span>
                      {ach.project && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-[#E2FF00] text-black text-[10px] font-mono font-bold border border-black rounded">
                          PROYEK: {ach.project.title}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEditAch(ach)}
                      className="px-3 py-1.5 bg-[#E2FF00] text-black font-mono font-bold text-xs uppercase border-2 border-black rounded-md shadow-[2px_2px_0px_0px_#000] neo-lift-hover"
                      title="Edit"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDeleteAchievement(ach.id)}
                      className="p-2 bg-[#FF6B35] text-white border-2 border-black dark:border-white rounded-md shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] neo-lift-hover"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SKILLS & SMART ICON CHECKER */}
        {activeTab === "skills" && (
          <div className="flex flex-col gap-6">
            <form onSubmit={handleAddSkill} className="bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-xl p-6 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] flex flex-col gap-4">
              <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2">
                <h3 className="text-lg font-black uppercase text-black dark:text-white">
                  {editingSkillId ? "✏️ EDIT SKILL / TOOL" : "+ TAMBAH SKILL DENGAN SMART ICON CHECKER"}
                </h3>
                {editingSkillId && (
                  <button
                    type="button"
                    onClick={handleCancelEditSkill}
                    className="text-xs font-mono font-bold text-[#FF6B35] underline"
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold mb-1">NAMA SKILL / TOOL</label>
                  <input
                    type="text"
                    required
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    placeholder="misal: Laravel, PHP, Excel, Word, Docker"
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold mb-1">KATEGORI</label>
                  <select
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono font-bold text-black dark:text-white"
                  >
                    <option value="programming">Programming Language</option>
                    <option value="framework">Framework / Library</option>
                    <option value="database">Database</option>
                    <option value="tools_office">Tools & Office (Excel, Word, dll)</option>
                    <option value="design">Design</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Smart Icon Checker Component */}
              <SmartIconChecker
                initialSkillName={newSkill.name}
                onSelectIcon={(url, type) => {
                  setNewSkill((prev) => ({ ...prev, iconUrl: url, icon_type: type }));
                }}
              />

              {/* Fallback Cloudinary Upload */}
              <div className="p-3 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md">
                <MediaUploader
                  module="skills"
                  label="Atau Upload File Icon Manual (portfolio/skills)"
                  onUploadSuccess={(url) => {
                    setNewSkill((prev) => ({ ...prev, iconUrl: url, icon_type: "cloudinary" }));
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold mb-1">FINAL ICON URL</label>
                <input
                  type="text"
                  required
                  value={newSkill.iconUrl}
                  onChange={(e) => setNewSkill({ ...newSkill, iconUrl: e.target.value })}
                  placeholder="URL icon terdeteksi..."
                  className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!newSkill.name || !newSkill.iconUrl}
                  className="px-5 py-2.5 bg-[#E2FF00] text-black font-black text-xs uppercase border-2 border-black dark:border-white rounded-lg shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] self-start flex items-center gap-2 neo-lift-hover disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingSkillId ? "SIMPAN PERUBAHAN" : "SIMPAN SKILL"}</span>
                </button>
                {editingSkillId && (
                  <button
                    type="button"
                    onClick={handleCancelEditSkill}
                    className="px-4 py-2.5 bg-[#FFFFFF] dark:bg-[#000000] text-black dark:text-white font-black text-xs uppercase border-2 border-black dark:border-white rounded-lg neo-lift-hover"
                  >
                    BATAL
                  </button>
                )}
              </div>
            </form>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black uppercase font-mono">
                  DAFTAR SKILL TERSIMPAN ({skills.length})
                </h3>
                <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                  <GripVertical className="w-3.5 h-3.5" /> Drag & drop kartu skill untuk geser urutan
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {skills.map((s, idx) => (
                  <div
                    key={s.id}
                    draggable
                    onDragStart={() => setDraggedItemIdx(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggedItemIdx !== null) {
                        handleReorder("skills", draggedItemIdx, idx);
                        setDraggedItemIdx(null);
                      }
                    }}
                    className="p-3 bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-xl shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] flex flex-col items-center text-center relative group neo-lift-hover cursor-grab active:cursor-grabbing hover:border-[#635BFF] transition-all"
                  >
                    <GripVertical className="w-3.5 h-3.5 text-gray-400 absolute top-2 right-2 opacity-50 group-hover:opacity-100" />
                    <img src={s.iconUrl} alt={s.name} className="w-8 h-8 object-contain mb-1" />
                    <span className="font-mono font-bold text-xs">{s.name}</span>
                    <div className="flex items-center gap-1 mt-2">
                      <button
                        onClick={() => handleStartEditSkill(s)}
                        className="px-2 py-0.5 bg-[#E2FF00] text-black text-[10px] font-mono font-bold rounded border border-black"
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(s.id)}
                        className="p-1 bg-[#FF6B35] text-white rounded border border-black"
                        title="Hapus"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: EDUCATION */}
        {activeTab === "education" && (
          <div className="flex flex-col gap-6">
            <form onSubmit={handleAddEducation} className="bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-xl p-6 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] flex flex-col gap-4">
              <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2">
                <h3 className="text-lg font-black uppercase text-black dark:text-white">
                  {editingEduId ? "✏️ EDIT RIWAYAT PENDIDIKAN" : "+ TAMBAH RIWAYAT PENDIDIKAN"}
                </h3>
                {editingEduId && (
                  <button
                    type="button"
                    onClick={handleCancelEditEdu}
                    className="text-xs font-mono font-bold text-[#FF6B35] underline"
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold mb-1">NAMA INSTITUSI</label>
                  <input
                    type="text"
                    required
                    value={newEdu.institution}
                    onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold mb-1">IPK / GPA (OPSIONAL)</label>
                  <input
                    type="text"
                    value={newEdu.scoreGpa}
                    onChange={(e) => setNewEdu({ ...newEdu, scoreGpa: e.target.value })}
                    placeholder="3.75 / 4.00"
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold mb-1">GELAR / DEGREE (ID)</label>
                  <input
                    type="text"
                    required
                    value={newEdu.degreeId}
                    onChange={(e) => setNewEdu({ ...newEdu, degreeId: e.target.value, degreeEn: e.target.value })}
                    placeholder="Sarjana Komputer"
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold mb-1">JURUSAN (ID)</label>
                  <input
                    type="text"
                    required
                    value={newEdu.fieldOfStudyId}
                    onChange={(e) => setNewEdu({ ...newEdu, fieldOfStudyId: e.target.value, fieldOfStudyEn: e.target.value })}
                    placeholder="Sistem Informasi"
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                  />
                </div>
              </div>

              {/* Tanggal Masuk & Tanggal Lulus/Keluar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end p-3 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-lg">
                <div>
                  <label className="block text-xs font-mono font-bold mb-1">TANGGAL MASUK / MULAI</label>
                  <input
                    type="date"
                    required
                    value={newEdu.startDate}
                    onChange={(e) => setNewEdu({ ...newEdu, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold mb-1">TANGGAL LULUS / KELUAR</label>
                  <input
                    type="date"
                    disabled={newEdu.isCurrent}
                    value={newEdu.endDate}
                    onChange={(e) => setNewEdu({ ...newEdu, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white disabled:opacity-40"
                  />
                </div>

                <div className="flex items-center gap-2 pb-2">
                  <input
                    type="checkbox"
                    id="edu_is_current"
                    checked={newEdu.isCurrent}
                    onChange={(e) => setNewEdu({ ...newEdu, isCurrent: e.target.checked, endDate: e.target.checked ? "" : newEdu.endDate })}
                    className="w-4 h-4 accent-[#E2FF00]"
                  />
                  <label htmlFor="edu_is_current" className="text-xs font-mono font-bold cursor-pointer">
                    Masih Menempuh Studi (Aktif)
                  </label>
                </div>
              </div>

              {/* Deskripsi Pendidikan Markdown ID & EN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <MarkdownEditor
                  label="DESKRIPSI PENDIDIKAN (EN)"
                  rows={3}
                  value={newEdu.descriptionEn}
                  onChange={(val) => setNewEdu({ ...newEdu, descriptionEn: val })}
                  placeholder="Aktivitas, konsentrasi studi, atau pencapaian akademik (opsional)..."
                />
                <MarkdownEditor
                  label="DESKRIPSI PENDIDIKAN (ID)"
                  rows={3}
                  value={newEdu.descriptionId}
                  onChange={(val) => setNewEdu({ ...newEdu, descriptionId: val })}
                  placeholder="Aktivitas, konsentrasi studi, atau pencapaian akademik (opsional)..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#E2FF00] text-black font-black text-xs uppercase border-2 border-black dark:border-white rounded-lg shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] self-start flex items-center gap-2 neo-lift-hover"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingEduId ? "SIMPAN PERUBAHAN" : "SIMPAN PENDIDIKAN"}</span>
                </button>
                {editingEduId && (
                  <button
                    type="button"
                    onClick={handleCancelEditEdu}
                    className="px-4 py-2.5 bg-[#FFFFFF] dark:bg-[#000000] text-black dark:text-white font-black text-xs uppercase border-2 border-black dark:border-white rounded-lg neo-lift-hover"
                  >
                    BATAL
                  </button>
                )}
              </div>
            </form>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black uppercase font-mono">
                  DAFTAR PENDIDIKAN ({education.length})
                </h3>
                <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                  <GripVertical className="w-3.5 h-3.5" /> Drag & drop baris untuk mengubah urutan
                </span>
              </div>
              {education.map((ed, idx) => (
                <div
                  key={ed.id}
                  draggable
                  onDragStart={() => setDraggedItemIdx(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedItemIdx !== null) {
                      handleReorder("education", draggedItemIdx, idx);
                      setDraggedItemIdx(null);
                    }
                  }}
                  className="p-4 bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-xl shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing hover:border-[#635BFF] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-gray-400 hover:text-black dark:hover:text-white" />
                    <div>
                      <span className="font-black text-sm uppercase">{ed.institution}</span>
                      <span className="text-xs text-[#FF6B35] font-bold block">{ed.degreeId} - {ed.fieldOfStudyId}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEditEdu(ed)}
                      className="px-3 py-1.5 bg-[#E2FF00] text-black font-mono font-bold text-xs uppercase border-2 border-black rounded-md shadow-[2px_2px_0px_0px_#000] neo-lift-hover"
                      title="Edit"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDeleteEducation(ed.id)}
                      className="p-2 bg-[#FF6B35] text-white border-2 border-black dark:border-white rounded-md shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] neo-lift-hover"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
