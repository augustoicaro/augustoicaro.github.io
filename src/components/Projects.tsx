import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
    {
        title: "Immersed-Linux-Virtual-Monitors",
        description: "A step-by-step guide and collection of scripts for configuring Linux virtual monitors for Immersed.",
        tech: ["Linux", "X11", "Wayland", "Shell"],
        github: "https://github.com/augustoicaro/Immersed-Linux-Virtual-Monitors"
    },
    {
        title: "Origami Typo & Origami Typo Dual Color",
        description: "Origami-inspired typefaces created with FontStruct, combining computational origami and experimental typography.",
        tech: ["FontStruct", "Typography", "Computational Origami"],
        link: "https://luc.devroye.org/fonts-79647.html"
    },
    {
        title: "SFD-CNN-TL",
        description: "Reproducible notebooks and models for seismic fault detection using transfer learning from a CNN pretrained on synthetic data.",
        tech: ["Python", "Jupyter", "CNN", "Transfer Learning"],
        github: "https://github.com/augustoicaro/SFD-CNN-TL"
    },
    {
        title: "vivaldi-matrix",
        description: "A web-based green code rain experience adapted as a Vivaldi browser start-page background.",
        tech: ["JavaScript", "WebGL", "WebGPU", "WGSL"],
        github: "https://github.com/augustoicaro/vivaldi-matrix"
    },
    {
        title: "HTC-Vive-Leap-Interaction-Engine-Integration",
        description: "Integration of the Leap Motion interaction engine with the HTC Vive hand-tracking SDK for Unity.",
        tech: ["C#", "Unity", "HTC Vive", "Leap Motion"],
        github: "https://github.com/augustoicaro/HTC-Vive-Leap-Interaction-Engine-Integration"
    },
    {
        title: "TwentySecondsCurriculumVitae-LaTex",
        description: "A LaTeX curriculum vitae template designed for a polished, quick-to-read presentation.",
        tech: ["LaTeX", "Font Awesome", "PDF"],
        github: "https://github.com/augustoicaro/TwentySecondsCurriculumVitae-LaTex"
    }
];

const Projects: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white border-b border-matrix-dark-green pb-2">
                PROJECT_DIRECTORY
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        className="border border-matrix-dark-green bg-matrix-dim/20 p-4 hover:bg-matrix-green/10 transition-colors group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-lg group-hover:text-white transition-colors">
                                {project.title}
                            </h4>
                            <div className="flex space-x-2">
                                {project.github && (
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`View ${project.title} on GitHub`}
                                        className="hover:text-white transition-colors"
                                    >
                                        <Github size={16} />
                                    </a>
                                )}
                                {project.link && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`View ${project.title} online`}
                                        className="hover:text-white transition-colors"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-matrix-green/80 mb-3">
                            {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {project.tech.map(t => (
                                <span key={t} className="text-xs border border-matrix-dark-green px-1 rounded-sm text-matrix-dark-green">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projects;
