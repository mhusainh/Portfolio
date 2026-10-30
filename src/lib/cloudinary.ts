import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const FOLDERS = {
  projects: "portfolio/projects",
  experiences: "portfolio/experiences",
  skills: "portfolio/skills",
  profile: "portfolio/profile",
  achievements: "portfolio/achievements",
} as const;

export type UploadModule = keyof typeof FOLDERS;

export default cloudinary;
