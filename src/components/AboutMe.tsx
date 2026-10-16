import React, { useEffect, useState } from 'react';
import TypewriterText from './TypewriterText';
import gdeMark from '../assets/gde-mark.svg';

const skills = [
    'Computer Graphics',
    'Computer Vision',
    'Artificial Intelligence',
    'Extended Reality',
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
                    <h3 className="inline-flex w-full flex-col items-start justify-between gap-2 md:flex-row md:gap-3 text-xl font-bold text-white border-b border-matrix-dark-green pb-2">
                        <span className="min-w-0">USER_PROFILE: AUGUSTO ICARO FARIAS DA CUNHA, PHD</span>
                        <a
                            href="https://g.dev/augustoicaro"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Google Developer Expert - view Augusto Icaro's profile (opens in a new tab)"
                            title="Google Developer Expert"
                            className="inline-flex h-7 shrink-0 items-center gap-2 whitespace-nowrap rounded-sm font-sans text-xl font-medium leading-7 text-white transition-colors hover:text-matrix-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matrix-green"
                        >
                            <img src={gdeMark} alt="" width={40} height={20} className="h-5 w-10" />
                            <span>Expert</span>
                        </a>
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
                            "Google Developer Expert in Android XR, Linux and XR enthusiast, and admirer of the \"Open Source\" philosophy. At Immersed, I help make extended reality (XR) a practical place to work and collaborate."
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
