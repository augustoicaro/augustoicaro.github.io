import React from 'react';
import { X, Minus, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import terminalImg from '../assets/terminal.png';

interface TerminalWindowProps {
    title: string;
    children: React.ReactNode;
    onClose?: () => void;
    className?: string;
}

const TerminalWindow: React.FC<TerminalWindowProps> = ({ title, children, onClose, className = '' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`
        relative
        border border-matrix-dark-green shadow-[0_0_15px_rgba(0,255,65,0.2)]
        rounded-sm overflow-hidden flex flex-col
        ${className}
      `}
        >
            {/* Header Bar */}
            <div className="flex items-center justify-between px-2 py-1 bg-matrix-black/90 backdrop-blur-sm border-b border-matrix-dark-green select-none">
                <div className="flex items-center space-x-2">
                    {/* Tux Icon */}
                    <img
                        src={terminalImg}
                        alt="Augusto Icaro"
                        className="w-4 h-4"
                    />
                    <span className="text-xs font-bold text-matrix-green tracking-wider">{title}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <button
                        onClick={(e) => e.currentTarget.blur()}
                        className="p-1 hover:bg-matrix-green/20 rounded-sm transition-colors text-matrix-green"
                    >
                        <Minus size={12} />
                    </button>
                    <button
                        onClick={(e) => e.currentTarget.blur()}
                        className="p-1 hover:bg-matrix-green/20 rounded-sm transition-colors text-matrix-green"
                    >
                        <Square size={10} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.currentTarget.blur();
                            if (onClose) onClose();
                        }}
                        className="p-1 hover:bg-red-500/50 rounded-sm transition-colors text-matrix-green hover:text-white"
                    >
                        <X size={12} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="overflow-auto flex-1 text-matrix-green font-matrix text-sm md:text-base flex flex-col">
                {children}
            </div>
        </motion.div>
    );
};

export default TerminalWindow;
