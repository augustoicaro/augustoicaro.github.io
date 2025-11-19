import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
    text: string | string[];
    speed?: number;
    startDelay?: number;
    onComplete?: () => void;
    className?: string;
    showCursor?: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
    text,
    speed = 30,
    startDelay = 0,
    onComplete,
    className = '',
    showCursor = true
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isStarted, setIsStarted] = useState(false);

    // Flatten text array to string if needed, or handle array logic.
    // For simplicity, let's join with newlines if it's an array.
    const fullText = Array.isArray(text) ? text.join('\n') : text;

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsStarted(true);
        }, startDelay);
        return () => clearTimeout(timer);
    }, [startDelay]);

    useEffect(() => {
        if (!isStarted) return;

        if (currentIndex < fullText.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + fullText[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);
            return () => clearTimeout(timeout);
        } else {
            if (onComplete) onComplete();
        }
    }, [currentIndex, isStarted, fullText, speed, onComplete]);

    return (
        <div className={`whitespace-pre-wrap ${className}`}>
            {displayedText}
            {showCursor && (
                <span className="inline-block w-2 h-4 bg-matrix-green ml-1 animate-pulse align-middle" />
            )}
        </div>
    );
};

export default TypewriterText;
