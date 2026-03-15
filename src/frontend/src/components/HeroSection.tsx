import { ArrowDown, Github, Linkedin, Twitter } from "lucide-react";
import { motion } from "motion/react";
import type { SocialLink } from "../hooks/useQueries";

interface HeroSectionProps {
  name: string;
  tagline: string;
  socialLinks: SocialLink[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  github: <Github className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
};

export function HeroSection({ name, tagline, socialLinks }: HeroSectionProps) {
  const words = name.split(" ");

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-primary text-xs tracking-[0.35em] uppercase mb-6 font-body font-semibold"
        >
          ✦ &nbsp; Portfolio &nbsp; ✦
        </motion.p>

        <h1 className="font-display leading-none mb-6 overflow-hidden">
          {words.map((word) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 100, rotateX: 40 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.9,
                delay: words.indexOf(word) * 0.18,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              className="block text-[clamp(4rem,13vw,11rem)] font-bold hero-gradient-text text-glow"
              style={{ display: "block", perspective: "600px" }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="text-muted-foreground font-body text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10"
        >
          {tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.85 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-7 py-3 bg-primary/10 border border-primary/30 text-primary rounded-full font-body font-semibold text-sm tracking-wide hover:bg-primary/20 hover:border-primary/60 transition-all duration-300 glow-primary hover:glow-primary-strong"
            data-ocid="hero.primary_button"
          >
            View My Work
          </button>
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-7 py-3 border border-border text-muted-foreground rounded-full font-body font-semibold text-sm tracking-wide hover:border-primary/40 hover:text-primary transition-all duration-300"
            data-ocid="hero.secondary_button"
          >
            Get in Touch
          </button>
        </motion.div>

        {socialLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="flex justify-center gap-4 mt-8"
          >
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                data-ocid="hero.link"
              >
                {ICON_MAP[link.platform.toLowerCase()] ?? (
                  <span className="text-xs">{link.platform[0]}</span>
                )}
              </a>
            ))}
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-muted-foreground text-[10px] tracking-[0.25em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <ArrowDown className="h-4 w-4 text-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
