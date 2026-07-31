import React, { useEffect, useState } from 'react';
import { Mail, Linkedin, Github } from 'lucide-react';
import { ImmersedIcon, MetaIcon, DiscordIcon } from './CustomIcons';
import TypewriterText from './TypewriterText';

const channels = [
    {
        href: 'mailto:contact@augustoicaro.com',
        label: 'contact@augustoicaro.com',
        icon: <Mail size={20} />
    },
    {
        href: 'https://linkedin.com/in/augustoicaro',
        label: '/in/augustoicaro',
        icon: <Linkedin size={20} />
    },
    {
        href: 'https://github.com/augustoicaro',
        label: 'augustoicaro',
        icon: <Github size={20} />
    },
    {
        href: 'https://discordapp.com/users/574239683903750144',
        label: 'augustoicaro',
        icon: <DiscordIcon size={20} />
    },
    {
        href: 'https://horizon.meta.com/profile/augustoicaro',
        label: 'augustoicaro',
        icon: <MetaIcon size={20} />
    },
    {
        href: 'https://immersed.com/join?q=2JRFKWF6',
        label: 'augusto_icaro',
        icon: <ImmersedIcon size={20} />
    }
];

const Contact: React.FC = () => {
    const [introComplete, setIntroComplete] = useState(false);
    const [visibleChannelCount, setVisibleChannelCount] = useState(0);
    const [encryptionComplete, setEncryptionComplete] = useState(false);
    const channelsComplete = introComplete && visibleChannelCount >= channels.length;

    useEffect(() => {
        if (!introComplete || visibleChannelCount >= channels.length) return;

        const timer = window.setTimeout(() => {
            setVisibleChannelCount(count => count + 1);
        }, 150);

        return () => window.clearTimeout(timer);
    }, [introComplete, visibleChannelCount]);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white border-b border-matrix-dark-green pb-2">
                ESTABLISH_CONNECTION
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <TypewriterText
                        text="Initiate communication protocol. Send a transmission via the following channels:"
                        speed={20}
                        onComplete={() => setIntroComplete(true)}
                        className="text-matrix-green/90"
                    />

                    <div className="space-y-2">
                        {channels.slice(0, visibleChannelCount).map(channel => (
                            <a
                                key={channel.href}
                                href={channel.href}
                                target={channel.href.startsWith('mailto:') ? undefined : '_blank'}
                                rel={channel.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                                className="flex items-center space-x-3 hover:text-white transition-colors p-2 hover:bg-matrix-green/10 rounded-sm"
                            >
                                {channel.icon}
                                <span>{channel.label}</span>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="border-l border-matrix-dark-green pl-6 hidden md:block">
                    <div className="opacity-50 text-xs font-mono">
                        {channelsComplete && (
                            <TypewriterText
                                text={[
                                    '$ ENCRYPTING CHANNEL...',
                                    '$ HANDSHAKE INITIATED...',
                                    '$ WAITING FOR INPUT...'
                                ]}
                                speed={20}
                                onComplete={() => setEncryptionComplete(true)}
                                showCursor={!encryptionComplete}
                            />
                        )}
                        {encryptionComplete && (
                            <p>$ <span className="inline-block w-2 h-4 bg-matrix-green animate-pulse align-middle" /></p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
