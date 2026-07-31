import React, { useEffect, useState } from 'react';
import TypewriterText from './TypewriterText';

const skills = [
    'Computer Graphics',
    'Computer Vision',
    'Artificial Intelligence',
    'Virtual & Augmented Reality',
    'C/C++',
    'C#',
    'Python',
    'TypeScript',
    'Node.js',
    'Unity',
    'Vulkan',
    'HLSL'
];

const AboutMe: React.FC = () => {
    const [profileLoaded, setProfileLoaded] = useState(false);
    const [visibleSkillCount, setVisibleSkillCount] = useState(0);

    useEffect(() => {
        if (!profileLoaded || visibleSkillCount >= skills.length) return;

        const timer = window.setTimeout(() => {
            setVisibleSkillCount(count => count + 1);
        }, 150);

        return () => window.clearTimeout(timer);
    }, [profileLoaded, visibleSkillCount]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">

                <div className="space-y-4 w-full">
                    <h3 className="text-xl font-bold text-white border-b border-matrix-dark-green pb-2 inline-block">
                        USER_PROFILE: AUGUSTO ICARO FARIAS DA CUNHA, PHD
                    </h3>
                    <TypewriterText
                        text={[
                            "Role: Senior Software Engineer @ Immersed",
                            "Location: Immersed Central / Los Angeles - USA / Maceio - Brazil",
                            "Status: Online",
                            "",
                            "Background: Computer Graphics / Computer Vision / Artificial Intelligence",
                            "",
                            "Research focus: Data Science, Computer Graphics, and Virtual & Augmented Reality.",
                            "",
                            "Linux and XR enthusiast and admirer of the \"Open Source\" philosophy."
                        ]}
                        speed={20}
                        onComplete={() => setProfileLoaded(true)}
                    />
                </div>
            </div>

            {profileLoaded && (
                <div className="mt-6">
                    <h4 className="text-lg font-bold text-matrix-green mb-3">SKILL_SET_LOADED:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {skills.slice(0, visibleSkillCount).map(skill => (
                            <div key={skill} className="flex items-center space-x-2">
                                <span className="text-matrix-dark-green">{'>'}</span>
                                <span>{skill}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AboutMe;
