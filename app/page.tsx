"use client";

import { Skill } from "@/components/skill";
import { ModelCard } from "@/components/model-card";
import { LayoutGroup, motion, Variants } from "motion/react";
import styles from "./page.module.css";
import { projects } from "@/constants/projects";
import { preloadModel } from "@/components/project-scene";
import { ThemeSwitch } from "@/components/theme-switch";
import { SpotifyPlayer } from "@/components/spotify-player";
import { Footer } from "@/components/footer";
import { socialLinks } from "@/constants/social";

projects.forEach(project => preloadModel(project.objPath, project.mtlPath));

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.25
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1]
    }
  }
};

export default function Home() {
  return (
    <div className={styles.intro}>
      <header className={styles.header}>
        <h1>Charis Oyerinde</h1>
        <ThemeSwitch />
      </header>

      <LayoutGroup>
        <motion.p
          className={styles.intro_text}
          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.8,
            ease: [0.215, 0.61, 0.355, 1],
            delay: 0.08
          }}
        >
          I'm a<Skill label="Mechatronics engineering student" />and a curious learner who enjoys
          the mathematics behind systems. I have worked with<Skill label="Fusion 360" />for engineering drawings,<Skill label="Python" />for data analysis,<Skill label="MATLAB" />for simulation,
          and<Skill label="C++" />for<Skill label="Robot Operating System" />and<Skill label="Arduino" />projects.
        </motion.p>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.8,
            ease: [0.215, 0.61, 0.355, 1],
            delay: 0.16
          }}
        >
          <a
            href={socialLinks.linkedin.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <img src={socialLinks.linkedin.icon} alt="LinkedIn Profile" className={styles.icon} />
            {socialLinks.linkedin.label}
          </a>
          <a
            href={socialLinks.resume.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <img src={socialLinks.resume.icon} alt="Download Resume" className={styles.icon} />
            {socialLinks.resume.label}
          </a>
          <a
            href={socialLinks.email.href}
            className="btn-secondary"
          >
            <img src={socialLinks.email.icon} alt="Send Email" className={styles.icon} />
            {socialLinks.email.label}
          </a>
        </motion.div>
      </LayoutGroup>

      <section className={styles.grid_section} aria-labelledby="projects-heading">
        <h2 id="projects-heading" className={styles.section_title}>Featured Mechatronics Projects</h2>
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
            >
              <ModelCard
                id={project.id}
                title={project.title}
                description={project.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <SpotifyPlayer />

      <Footer />
    </div>
  );
}
