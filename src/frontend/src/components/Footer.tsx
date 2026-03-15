import { Heart } from "lucide-react";
import { motion } from "motion/react";

export function Footer() {
  const year = new Date().getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="relative py-12 px-4 border-t border-border/30">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground"
      >
        <p>© {year} All rights reserved.</p>
        <a
          href={utm}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-primary transition-colors"
        >
          Built with <Heart className="h-3 w-3 text-primary fill-primary" />{" "}
          using <span className="font-semibold text-primary">caffeine.ai</span>
        </a>
      </motion.div>
    </footer>
  );
}
