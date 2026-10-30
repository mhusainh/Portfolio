export interface IconCandidate {
  name: string;
  url: string;
  source: "devicon" | "simpleicons";
}

export function getDeviconUrl(skillName: string): string {
  const normalized = skillName.toLowerCase().trim().replace(/\s+/g, "");
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${normalized}/${normalized}-original.svg`;
}

export function getSimpleIconUrl(skillName: string): string {
  const slug = skillName
    .toLowerCase()
    .trim()
    .replace(/\+/g, "plus")
    .replace(/\./g, "dot")
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");

  return `https://cdn.simpleicons.org/${slug}`;
}

export async function checkIconCandidate(skillName: string): Promise<IconCandidate | null> {
  const devicon = getDeviconUrl(skillName);
  try {
    const resDev = await fetch(devicon, { method: "HEAD" });
    if (resDev.ok) {
      return { name: skillName, url: devicon, source: "devicon" };
    }
  } catch {
    // continue to simpleicons
  }

  const simpleIcon = getSimpleIconUrl(skillName);
  try {
    const resSimple = await fetch(simpleIcon, { method: "HEAD" });
    if (resSimple.ok) {
      return { name: skillName, url: simpleIcon, source: "simpleicons" };
    }
  } catch {
    // icon not found on CDN
  }

  return null;
}
