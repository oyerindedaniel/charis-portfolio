import { socialLinks } from "@/constants/social";
import { getBaseUrl } from "@/lib/site-url";

export const siteConfig = {
  name: "Charis Oyerinde",
  description:
    "Portfolio of Charis Oyerinde, a Mechatronics Engineering student focusing on robotics, control systems, and precision engineering.",
  url: getBaseUrl(),
  ogImage: "/og-main.png",
  links: {
    linkedin: socialLinks.linkedin.href,
    email: socialLinks.email.href,
    resume: socialLinks.resume.href,
  },
};
