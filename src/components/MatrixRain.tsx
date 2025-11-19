import React from 'react';

const MatrixRain: React.FC = () => {
    return (
        <iframe
            src="https://rezmason.github.io/matrix/?version=morpheus&skipIntro=false&numColumns=70&volumetric=false&raindropLength=0.75&cycleSpeed=0.03&paletteHSL=0.97,0.6,0,0,0.97,0.6,0.15,0.8,0.97,0.6,0.5,1"
            className="fixed top-0 left-0 w-full h-full border-0 z-0 pointer-events-none"
            title="Matrix Rain Background"
        />
    );
};

export default MatrixRain;

