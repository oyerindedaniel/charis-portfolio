"use client";

import { motion } from "motion/react";
import styles from "./spotify-player.module.css";

export function SpotifyPlayer() {
    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
        >
            <div className={styles.header}>
                <img src="/spotify.png" alt="Spotify" className={styles.icon} />
                <span className={styles.title}>Listening to</span>
            </div>

            <div className={styles.player_wrapper}>
                <iframe
                    data-testid="embed-iframe"
                    className={styles.iframe}
                    src="https://open.spotify.com/embed/playlist/3LQccQTuWkzv35NcMS3yKG?utm_source=generator"
                    width="100%"
                    height="352"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                />
            </div>
        </motion.div>
    );
}
