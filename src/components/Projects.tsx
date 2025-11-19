import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
    {
        title: "Project Alpha",
        description: "A neural network visualization tool built with WebGL.",
        tech: ["React", "Three.js", "TensorFlow.js"],
        link: "#",
        github: "#"
    },
    {
        title: "Cyber Commerce",
        description: "E-commerce platform with futuristic UI components.",
        tech: ["Next.js", "Stripe", "Tailwind"],
        link: "#",
        github: "#"
    },
    {
        title: "Data Stream",
        description: "Real-time data processing dashboard.",
        tech: ["Vue", "Socket.io", "D3.js"],
        link: "#",
        github: "#"
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
                                <a href={project.github} className="hover:text-white transition-colors"><Github size={16} /></a>
                                <a href={project.link} className="hover:text-white transition-colors"><ExternalLink size={16} /></a>
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
