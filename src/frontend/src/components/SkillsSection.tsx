import { motion } from "motion/react";
import { SkillsOrbs } from "./SkillsOrbs";

interface SkillsSectionProps {
  skills: string[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section id="skills" className="relative py-24 px-4">
      {/* Background glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-primary/4 blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-semibold"
          >
            Technologies
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="section-title font-display text-foreground"
          >
            My <span className="hero-gradient-text">Skill</span> Constellation
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-muted-foreground mt-4 max-w-md mx-auto text-sm"
          >
            Hover over the orbs to explore. Drag to rotate.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <SkillsOrbs skills={skills} />
        </motion.div>
      </div>
    </section>
  );
}
