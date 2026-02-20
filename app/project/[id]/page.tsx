import { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/constants/projects";
import { siteConfig } from "@/config/site";
import { ProjectDetailsClient } from "./project-details-client";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    return projects.map((project) => ({
        id: project.id,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const currentProject = projects.find((project) => project.id === id);

    if (!currentProject) {
        return {
            title: "Project Not Found",
        };
    }

    const title = `${currentProject.title} | ${siteConfig.name}`;
    const description = currentProject.description;
    const ogImage = `${siteConfig.url}/api/og?title=${encodeURIComponent(currentProject.title)}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: ogImage, width: 1200, height: 630 }],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
        },
    };
}

export default async function ProjectPage({ params }: Props) {
    const { id } = await params;
    const currentProject = projects.find((project) => project.id === id);

    if (!currentProject) {
        notFound();
    }

    return <ProjectDetailsClient project={currentProject} />;
}
