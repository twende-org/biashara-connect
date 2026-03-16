import { motion } from "framer-motion";

const techStack = ["Next.js", "PostgreSQL", "Go", "MQTT"];

const metrics = [
  { label: "Status", value: "Production", live: true },
  { label: "Impact", value: "420+ Vendors" },
  { label: "Latency", value: "42ms avg" },
  { label: "Regions", value: "4 Active" },
];

const ProjectCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="group border border-border bg-card shadow-hard hover:shadow-hard-hover hover:translate-x-1 hover:translate-y-1 transition-all duration-300"
    >
      <div className="grid grid-cols-12 gap-0">
        {/* Visual Side */}
        <div className="col-span-12 md:col-span-7 border-b md:border-b-0 md:border-r border-border p-8 md:p-12 bg-secondary">
          <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
            Project_01
          </span>

          <h3 className="mt-4 text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] font-display text-foreground leading-[0.95]">
            Biashara
            <br />
            Connect
          </h3>

          <div className="mt-12 h-px w-full bg-border" />

          <p className="mt-8 max-w-md text-base md:text-lg leading-relaxed text-muted-foreground">
            Bridging the gap between local Tanzanian vendors and regional supply
            chains through real-time inventory synchronization.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
              v1.0.4
            </span>
            <span className="h-px flex-1 bg-border" />
            <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
              Last commit: 2d ago
            </span>
          </div>
        </div>

        {/* Data Side */}
        <div className="col-span-12 md:col-span-5 p-8 md:p-12 flex flex-col justify-between">
          <div className="space-y-8">
            {/* Tech Stack */}
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-label text-primary">
                Tech Stack
              </h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="border border-border px-2 py-1 font-mono text-[11px] text-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <h4 className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
                    {metric.label}
                  </h4>
                  <p className="mt-1 font-mono text-sm text-foreground flex items-center gap-2">
                    {metric.live && (
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    )}
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-label text-primary">
                Mission
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Biashara-Connect is not just a directory; it is a
                synchronization engine for the East African marketplace.
              </p>
            </div>
          </div>

          {/* CTA */}
          <motion.a
            href="https://github.com/twende-org/biashara-connect"
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.98 }}
            className="mt-12 block w-full bg-foreground text-card py-4 font-mono text-xs uppercase tracking-label text-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
          >
            View Infrastructure _→
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
