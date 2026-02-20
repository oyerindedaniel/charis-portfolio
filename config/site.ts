import { socialLinks } from "@/constants/social";

export const siteConfig = {
    name: "Charis Oyerinde",
    description: "Portfolio of Charis Oyerinde, a Mechatronics Engineering student focusing on robotics, control systems, and precision engineering.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ogImage: "/og-main.png",
    links: {
        linkedin: socialLinks.linkedin.href,
        email: socialLinks.email.href,
        resume: socialLinks.resume.href,
    }
};
