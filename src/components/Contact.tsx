import React from 'react';
import { Mail, Linkedin, Github } from 'lucide-react';

const Contact: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white border-b border-matrix-dark-green pb-2">
                ESTABLISH_CONNECTION
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <p className="text-matrix-green/90">
                        Initiate communication protocol. Send a transmission via the following channels:
                    </p>

                    <div className="space-y-2">
                        <a href="mailto:contact@augustoicaro.com" className="flex items-center space-x-3 hover:text-white transition-colors p-2 hover:bg-matrix-green/10 rounded-sm">
                            <Mail size={20} />
                            <span>contact@augustoicaro.com</span>
                        </a>
                        <a href="https://linkedin.com/in/augustoicaro" className="flex items-center space-x-3 hover:text-white transition-colors p-2 hover:bg-matrix-green/10 rounded-sm">
                            <Linkedin size={20} />
                            <span>/in/augustoicaro</span>
                        </a>
                        <a href="https://github.com/augustoicaro" className="flex items-center space-x-3 hover:text-white transition-colors p-2 hover:bg-matrix-green/10 rounded-sm">
                            <Github size={20} />
                            <span>@augustoicaro</span>
                        </a>
                    </div>
                </div>

                <div className="border-l border-matrix-dark-green pl-6 hidden md:block">
                    <div className="opacity-50 text-xs font-mono">
                        <p>{`> ENCRYPTING CHANNEL...`}</p>
                        <p>{`> HANDSHAKE INITIATED...`}</p>
                        <p>{`> WAITING FOR INPUT...`}</p>
                        <div className="mt-4 animate-pulse">_</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
