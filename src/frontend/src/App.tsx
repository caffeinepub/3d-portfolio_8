import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { AboutSection } from "./components/AboutSection";
import { AdminPanel } from "./components/AdminPanel";
import { BackgroundScene } from "./components/BackgroundScene";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { Navigation } from "./components/Navigation";
import { ProjectsSection } from "./components/ProjectsSection";
import { SkillsSection } from "./components/SkillsSection";
import {
  useIsAdmin,
  usePortfolio,
  useProjects,
  useResume,
} from "./hooks/useQueries";
import type { Project, SocialLink } from "./hooks/useQueries";

const SAMPLE_PORTFOLIO = {
  name: "Aman Kumar Singh",
  tagline: "Software Engineer · DevOps · Cloud Infrastructure · Full Stack",
  about:
    "Software Engineer with strong experience in DevOps, Cloud Infrastructure, and Full Stack development. Skilled in building scalable applications, deploying cloud-native solutions, and automating infrastructure using modern DevOps practices. Hands-on experience with AWS, Docker, CI/CD pipelines, Linux systems, and Java-based development. Proven ability to troubleshoot production systems, optimize performance, and collaborate with cross-functional teams to deliver reliable software solutions.",
  skills: [
    "Java",
    "JavaScript",
    "React.js",
    "SQL",
    "Shell Scripting",
    "AWS",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "GitHub Actions",
    "Jenkins",
    "Linux",
    "MySQL",
    "MongoDB",
    "Git",
    "Nginx",
    "REST APIs",
    "Excel VBA",
  ],
  socialLinks: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/aman-singhhnm5567" },
    { platform: "Email", url: "mailto:amansinghhnm5567@gmail.com" },
  ] as SocialLink[],
};

const SAMPLE_PROJECTS: Project[] = [
  {
    id: 1n,
    title: "RentUs",
    description:
      "Developed and optimized frontend architecture for a rental platform using React.js. Improved application performance and resolved UI issues across development and production environments. Documented deployment workflows and debugging procedures.",
    link: "",
  },
  {
    id: 2n,
    title: "ASOS (Clothing Website)",
    description:
      "Designed responsive web interfaces using ReactJS with a focus on performance and user experience. Implemented AWS-based deployment and monitored application performance. Debugged frontend issues and improved stability of production environments.",
    link: "",
  },
  {
    id: 3n,
    title: "Excel Automation Tools",
    description:
      "Developed advanced Excel automation tools using Macros, VBA, and Power Query at Amazon to significantly improve reporting efficiency and reduce manual effort across operational workflows.",
    link: "",
  },
];

export default function App() {
  const [adminOpen, setAdminOpen] = useState(false);

  const portfolioQuery = usePortfolio();
  const projectsQuery = useProjects();
  const resumeQuery = useResume();
  const isAdminQuery = useIsAdmin();

  const portfolio = portfolioQuery.data ?? null;
  const projects = projectsQuery.data ?? [];
  const resumeUrl = resumeQuery.data?.url ?? null;
  const isAdmin = isAdminQuery.data ?? false;

  const displayName = portfolio?.name || SAMPLE_PORTFOLIO.name;
  const displayTagline = portfolio?.tagline || SAMPLE_PORTFOLIO.tagline;
  const displayAbout = portfolio?.about || SAMPLE_PORTFOLIO.about;
  const displaySkills =
    portfolio?.skills && portfolio.skills.length > 0
      ? portfolio.skills
      : SAMPLE_PORTFOLIO.skills;
  const displaySocialLinks =
    portfolio?.socialLinks && portfolio.socialLinks.length > 0
      ? portfolio.socialLinks
      : SAMPLE_PORTFOLIO.socialLinks;
  const displayProjects = projects.length > 0 ? projects : SAMPLE_PROJECTS;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <BackgroundScene />

      <div className="relative z-10">
        <Navigation
          onAdminClick={() => setAdminOpen(true)}
          isAdmin={isAdmin}
          profileName={displayName}
        />

        <main>
          <HeroSection
            name={displayName}
            tagline={displayTagline}
            socialLinks={displaySocialLinks}
          />

          <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <AboutSection about={displayAbout} name={displayName} />

          <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <SkillsSection skills={displaySkills} />

          <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <ProjectsSection
            projects={displayProjects}
            isAdmin={isAdmin}
            onAddProject={() => setAdminOpen(true)}
          />

          <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <ContactSection
            resumeUrl={resumeUrl}
            socialLinks={displaySocialLinks}
            name={displayName}
          />
        </main>

        <Footer />
      </div>

      <AdminPanel
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        portfolio={portfolio}
        projects={projects}
      />

      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.10 0.018 245 / 0.95)",
            border: "1px solid oklch(0.78 0.18 195 / 0.3)",
            color: "oklch(0.94 0.012 240)",
          },
        }}
      />
    </div>
  );
}
