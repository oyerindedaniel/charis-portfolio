"use client";

import { Skill } from "@/components/skill";
import { ModelCard } from "@/components/model-card";
import { LayoutGroup, motion, Variants } from "motion/react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

import { projects } from "@/constants/projects";

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
  const router = useRouter();

  return (
    <div className={styles.intro}>
      <header>
        <h1>Charis Oyerinde</h1>
      </header>

      <LayoutGroup>
        <motion.p
          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.8,
            ease: [0.215, 0.61, 0.355, 1],
            delay: 0.08
          }}
        >
          I'm a<Skill label="mechatronics engineering student." />
          I'm good at mathematics and use<Skill label="Fusion 360" />for engineering drawings.
          I also use<Skill label="Python" />for data analysis and
          visualization,<Skill label="MATLAB" />for simulation,
          and<Skill label="C++" />for<Skill label="ROS" />and<Skill label="Arduino" />development.
        </motion.p>
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
              onClick={() => router.push(`/project/${project.id}`)}
              style={{ cursor: "pointer" }}
            >
              <ModelCard
                id={project.id}
                title={project.title}
                description={project.description}
                layoutId={project.id}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
