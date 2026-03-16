import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
              Twende_Org
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <span className="font-mono text-[11px] uppercase tracking-label text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Projects
            </span>
            <span className="font-mono text-[11px] uppercase tracking-label text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              About
            </span>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-[15vh] md:py-[20vh]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="font-mono text-[10px] uppercase tracking-label text-primary">
              Open Source Infrastructure
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-black tracking-[-0.03em] font-display text-foreground max-w-3xl leading-[1.05]">
              Infrastructure for the next billion businesses.
            </h1>
            <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-muted-foreground">
              Building open-source tools that power East African commerce.
              Precise. Resilient. Community-driven.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="pb-[15vh] md:pb-[20vh]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
              Projects
            </span>
            <span className="h-px flex-1 bg-border" />
            <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
              01
            </span>
          </div>

          <ProjectCard />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
            © 2026 Twende
          </span>
          <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
            Dar es Salaam — Nairobi — Kampala
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
