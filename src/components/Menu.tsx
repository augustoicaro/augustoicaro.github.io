import React from 'react';
import { ChevronRight } from 'lucide-react';

interface MenuItem {
    id: string;
    label: string;
}

interface MenuProps {
    items: MenuItem[];
    onSelect: (id: string) => void;
    activeId?: string;
}

const Menu: React.FC<MenuProps> = ({ items, onSelect, activeId }) => {
    return (
        <div className="flex flex-col space-y-2 mt-4">
            {items.map((item, index) => {
                const isActive = item.id === activeId;
                return (
                    <button
                        key={item.id}
                        onClick={(e) => {
                            e.currentTarget.blur();
                            onSelect(item.id);
                        }}
                        className={`
              group flex items-center space-x-2 text-left p-2 rounded-sm transition-all duration-200 focus:outline-none w-full border
              ${isActive
                                ? 'bg-matrix-green/20 border-matrix-dark-green'
                                : 'border-transparent hover:bg-matrix-green/20 hover:border-matrix-dark-green focus:bg-matrix-green/30'
                            }
            `}
                    >
                        <span className={`
              transition-colors font-mono
              ${isActive ? 'text-matrix-green' : 'text-matrix-dark-green group-hover:text-matrix-green'}
            `}>
                            {`[${index + 1}]`}
                        </span>
                        <span className={`
              font-bold transition-colors tracking-wide
              ${isActive ? 'text-white' : 'text-matrix-green group-hover:text-white'}
            `}>
                            {item.label}
                        </span>
                        <ChevronRight
                            size={16}
                            className={`
                transition-all transform text-matrix-green ml-auto
                ${isActive ? 'opacity-100 translate-x-1' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}
              `}
                        />
                    </button>
                );
            })}
        </div>
    );
};

export default Menu;
