import React, { useState, useEffect } from 'react';

const MatrixRain: React.FC = () => {
    const calculateNumColumns = (width: number) => {
        // Linear interpolation: (900, 70) -> (1900, 115)
        // Slope = (115 - 70) / (1900 - 900) = 45 / 1000 = 0.045
        // y = 0.045x + b => 70 = 0.045(900) + b => 70 = 40.5 + b => b = 29.5
        return Math.floor(width * 0.045 + 29.5);
    };

    const [numColumns, setNumColumns] = useState(calculateNumColumns(window.innerWidth));

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setNumColumns(calculateNumColumns(window.innerWidth));
            }, 500); // Debounce to prevent constant reloading
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <iframe
            src={`https://rezmason.github.io/matrix/?version=morpheus&skipIntro=false&numColumns=${numColumns}&volumetric=false&raindropLength=0.75&cycleSpeed=0.03&paletteHSL=0.97,0.6,0,0,0.97,0.6,0.15,0.8,0.97,0.6,0.5,1`}
            className="fixed top-0 left-0 w-full h-full border-0 z-0 pointer-events-none"
            title="Matrix Rain Background"
        />
    );
};

export default MatrixRain;

