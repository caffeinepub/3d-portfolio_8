import { Code2, Cpu, Layers, Zap } from "lucide-react";
import { motion } from "motion/react";

interface AboutSectionProps {
  about: string;
  name: string;
}

const FEATURES = [
  {
    icon: Code2,
    label: "Clean Code",
    desc: "Maintainable, tested, production-ready",
  },
  { icon: Layers, label: "Full Stack", desc: "From pixel to infrastructure" },
  { icon: Cpu, label: "3D & WebGL", desc: "Immersive interactive experiences" },
  {
    icon: Zap,
    label: "Performance",
    desc: "Blazing fast, optimized at every layer",
  },
];

export function AboutSection({ about, name }: AboutSectionProps) {
  return (
    <section id="about" className="relative py-32 px-4">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-semibold"
            >
              About Me
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="section-title font-display text-foreground mb-6"
            >
              Crafting the <span className="hero-gradient-text">future</span>
              <br />
              one pixel at a time.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              viewport={{ once: true }}
              className="text-muted-foreground font-body leading-relaxed text-base md:text-lg"
            >
              {about}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-8 flex items-center gap-4"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
              <span className="text-muted-foreground text-xs tracking-widest uppercase">
                — {name}
              </span>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-5 rounded-2xl glass group hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 cursor-default"
                data-ocid="about.card"
              >
                <div className="mb-3 p-2 w-fit rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground text-sm mb-1">
                  {f.label}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
