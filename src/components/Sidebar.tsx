
import React from 'react';
import Menu from './Menu';
import meImg from '../assets/me.png';

interface SidebarProps {
    activeSection: string;
    onSelect: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSelect }) => {
    // Using activeSection to highlight current menu item (future enhancement)
    // For now, just suppressing the lint error by logging or using it in a class
    console.log('Active Section:', activeSection);
    return (
        <div className="w-64 border-r border-matrix-dark-green flex flex-col h-full">
            {/* Profile Image - Transparent Background */}
            <div className="w-full aspect-square flex items-center justify-center bg-transparent shrink-0 overflow-hidden relative group">
                <img
                    src={meImg}
                    alt="Augusto Icaro"
                    className="w-full h-full"
                />
            </div>

            {/* Navigation & Footer - Glass Background */}
            <div className="flex-1 flex flex-col p-4 pt-0 bg-matrix-black/90 backdrop-blur-sm border-t border-matrix-dark-green">
                <div className="flex-1 mt-4">
                    <h3 className="text-xs font-bold text-matrix-dark-green mb-4 uppercase tracking-wider">
                        Navigation
                    </h3>
                    <Menu
                        items={[
                            { id: 'about', label: 'ABOUT ME' },
                            { id: 'projects', label: 'PROJECTS' },
                            { id: 'contact', label: 'CONTACT' }
                        ]}
                        onSelect={onSelect}
                        activeId={activeSection}
                    />
                </div>

                <div className="mt-auto pt-4 border-t border-matrix-dark-green">
                    <div className="text-[10px] text-matrix-dark-green font-mono">
                        <p>SYSTEM: ONLINE</p>
                        <p>USER: GUEST</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

