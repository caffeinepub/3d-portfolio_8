import {
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Twitter,
} from "lucide-react";
import { motion } from "motion/react";
import type { SocialLink } from "../hooks/useQueries";

interface ContactSectionProps {
  resumeUrl: string | null;
  socialLinks: SocialLink[];
  name: string;
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github: <Github className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  twitter: <Twitter className="h-5 w-5" />,
  email: <Mail className="h-5 w-5" />,
};

export function ContactSection({
  resumeUrl,
  socialLinks,
  name: _name,
}: ContactSectionProps) {
  return (
    <section id="contact" className="relative py-32 px-4">
      {/* Dramatic glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[300px] rounded-full bg-primary/6 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-primary text-xs tracking-[0.3em] uppercase mb-6 font-semibold"
        >
          Let's Connect
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="section-title font-display text-foreground mb-6"
        >
          Ready to build something{" "}
          <span className="hero-gradient-text">extraordinary?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          viewport={{ once: true }}
          className="text-muted-foreground font-body text-lg max-w-lg mx-auto mb-12 leading-relaxed"
        >
          I'm always open to interesting projects, collaborations, and
          opportunities. Based in Bengaluru, India.
        </motion.p>

        {/* Resume download */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-14"
        >
          {resumeUrl ? (
            <a
              href={resumeUrl}
              download
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary/10 border border-primary/40 text-primary font-semibold text-sm tracking-wide hover:bg-primary/20 hover:border-primary transition-all duration-300 glow-primary hover:glow-primary-strong animate-pulse_glow"
              data-ocid="contact.button"
            >
              <div className="absolute inset-0 rounded-full bg-primary/5 blur-xl group-hover:bg-primary/15 transition-all" />
              <Download className="h-4 w-4 group-hover:animate-bounce relative z-10" />
              <span className="relative z-10">Download Resume</span>
            </a>
          ) : (
            <div
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-border text-muted-foreground text-sm"
              data-ocid="contact.button"
            >
              <Download className="h-4 w-4" />
              Resume Coming Soon
            </div>
          )}

          <a
            href="mailto:amansinghhnm5567@gmail.com"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/40 font-semibold text-sm tracking-wide transition-all duration-300"
            data-ocid="contact.link"
          >
            <Mail className="h-4 w-4" />
            amansinghhnm5567@gmail.com
          </a>
        </motion.div>

        {/* Social links */}
        {socialLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex justify-center gap-4"
          >
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 group"
                data-ocid="contact.link"
              >
                <span className="group-hover:scale-110 transition-transform">
                  {SOCIAL_ICONS[link.platform.toLowerCase()] ?? (
                    <ExternalLink className="h-5 w-5" />
                  )}
                </span>
              </a>
            ))}
          </motion.div>
        )}

        {/* Phone */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          viewport={{ once: true }}
          className="text-muted-foreground text-sm mt-8"
        >
          +91 70911 88735
        </motion.p>
      </div>
    </section>
  );
}
