import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, Plus } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import type { Project } from "../hooks/useQueries";

interface ProjectsSectionProps {
  projects: Project[];
  isAdmin: boolean;
  onAddProject: () => void;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);
  const springRX = useSpring(rotateX, { stiffness: 180, damping: 18 });
  const springRY = useSpring(rotateY, { stiffness: 180, damping: 18 });
  const spotLeft = useTransform(x, [-0.5, 0.5], ["10%", "90%"]);
  const spotTop = useTransform(y, [-0.5, 0.5], ["10%", "90%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      viewport={{ once: true }}
      style={{ perspective: "1200px" }}
      data-ocid={`projects.item.${index + 1}`}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX: springRX, rotateY: springRY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative p-6 md:p-8 rounded-2xl glass hover:border-primary/30 overflow-hidden group cursor-pointer h-full transition-colors duration-300"
      >
        {/* Spotlight */}
        <motion.div
          className="absolute w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            left: spotLeft,
            top: spotTop,
            marginLeft: "-6rem",
            marginTop: "-6rem",
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-start justify-between mb-5">
            <span className="text-primary/60 font-mono text-xs tracking-widest">
              {String(index + 1).padStart(2, "0")}
            </span>
            {project.link && (
              <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:text-primary" />
            )}
          </div>

          <h3 className="font-display font-bold text-foreground text-xl md:text-2xl mb-3 group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed flex-1">
            {project.description}
          </p>

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-6 inline-flex items-center gap-2 text-primary text-xs tracking-wider uppercase font-semibold hover:gap-3 transition-all duration-200"
            >
              View Project <ArrowRight className="h-3 w-3" />
            </a>
          )}
        </div>

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-4 right-4 w-px h-8 bg-gradient-to-b from-primary/60 to-transparent" />
          <div className="absolute top-4 right-4 h-px w-8 bg-gradient-to-r from-primary/60 to-transparent" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProjectsSection({
  projects,
  isAdmin,
  onAddProject,
}: ProjectsSectionProps) {
  return (
    <section id="projects" className="relative py-24 px-4">
      <div className="absolute left-0 bottom-0 w-80 h-80 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-semibold"
            >
              Selected Work
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="section-title font-display text-foreground"
            >
              Featured <span className="hero-gradient-text">Projects</span>
            </motion.h2>
          </div>

          {isAdmin && (
            <Button
              onClick={onAddProject}
              variant="outline"
              size="sm"
              className="border-primary/30 text-primary hover:bg-primary/10"
              data-ocid="projects.primary_button"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Project
            </Button>
          )}
        </div>

        {projects.length === 0 ? (
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="projects.empty_state"
          >
            <p className="text-lg">No projects yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <ProjectCard
                key={String(project.id)}
                project={project}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
