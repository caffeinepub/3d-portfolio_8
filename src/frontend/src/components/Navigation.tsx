import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Menu, Settings, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface NavigationProps {
  onAdminClick: () => void;
  isAdmin: boolean;
  profileName?: string;
}

const NAV_LINKS = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];

export function Navigation({
  onAdminClick,
  isAdmin,
  profileName,
}: NavigationProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const isLoggedIn = loginStatus === "success" && !!identity;
  const initials = profileName
    ? profileName
        .split(" ")
        .map((w) => w[0])
        .join("")
    : "AC";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-500 ${
          scrolled
            ? "bg-card/80 backdrop-blur-2xl border border-primary/20 shadow-[0_8px_32px_rgba(0,229,255,0.08)]"
            : "bg-transparent"
        }`}
      >
        <button
          type="button"
          onClick={() => scrollTo("hero")}
          className="font-display font-bold text-lg tracking-tight group"
          data-ocid="nav.link"
        >
          <span className="text-primary transition-all">
            {profileName?.split(" ")[0]?.toUpperCase() ?? "ALEX"}
          </span>
          <span className="text-muted-foreground">.</span>
          <span className="text-foreground">DEV</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              type="button"
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200 tracking-[0.15em] uppercase font-medium"
              data-ocid="nav.link"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAdminClick}
              className="text-primary hover:bg-primary/10 border border-primary/20"
              data-ocid="nav.button"
            >
              <Settings className="h-3.5 w-3.5 mr-1" />
              Admin
            </Button>
          )}

          {isLoggedIn ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="text-muted-foreground hover:text-foreground"
              data-ocid="nav.button"
            >
              <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[9px] font-bold text-primary mr-1">
                {initials}
              </div>
              <LogOut className="h-3 w-3" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => login()}
              disabled={loginStatus === "logging-in"}
              className="text-muted-foreground hover:text-primary border border-transparent hover:border-primary/20"
              data-ocid="nav.button"
            >
              <LogIn className="h-3.5 w-3.5 mr-1" />
              {loginStatus === "logging-in" ? "Connecting..." : "Login"}
            </Button>
          )}

          <button
            type="button"
            className="md:hidden text-muted-foreground hover:text-primary ml-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.toggle"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </motion.div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mt-2 p-4 rounded-2xl bg-card/90 backdrop-blur-2xl border border-primary/20"
        >
          {NAV_LINKS.map((link) => (
            <button
              type="button"
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="block w-full text-left py-3 text-sm text-muted-foreground hover:text-primary transition-colors tracking-widest uppercase font-medium border-b border-border/30 last:border-0"
              data-ocid="nav.link"
            >
              {link.label}
            </button>
          ))}
        </motion.div>
      )}
    </nav>
  );
}
