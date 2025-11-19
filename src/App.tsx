import { useState, useEffect } from 'react';
import MatrixRain from './components/MatrixRain';
import TerminalWindow from './components/TerminalWindow';
import TypewriterText from './components/TypewriterText';
import Menu from './components/Menu';
import Sidebar from './components/Sidebar';
import AboutMe from './components/AboutMe';
import Projects from './components/Projects';
import Contact from './components/Contact';
import meImg from './assets/me.png';

type Section = 'home' | 'about' | 'projects' | 'contact';

function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuSelect = (id: string) => {
    setActiveSection(id as Section);
    // Don't reset animation state
    // setCommandTyped(false);
    // setShowMenu(false);
  };

  const handleClose = () => {
    setActiveSection('home');
    // Don't reset animation state
    // setCommandTyped(false);
    // setShowMenu(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key to return home
      if (e.key === 'Escape' && activeSection !== 'home') {
        handleClose();
        return;
      }

      // Handle Number keys for menu selection (globally when menu is shown)
      if (showMenu) {
        switch (e.key) {
          case '1':
            handleMenuSelect('about');
            break;
          case '2':
            handleMenuSelect('projects');
            break;
          case '3':
            handleMenuSelect('contact');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, showMenu]);

  const [commandTyped, setCommandTyped] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

        return (
          <div className="space-y-4">
            {/* Command Line */}
            <div>
              <span className="text-matrix-green mr-2">
                <span className="font-bold">[{timeString}]</span> guest@matrix:~$
              </span>
              {commandTyped ? (
                <span className="inline-block">
                  {isMobile ? "./enter_the_matrix" : "./enter_the_matrix --show-operator"}
                </span>
              ) : (
                <TypewriterText
                  text={isMobile ? "./enter_the_matrix" : "./enter_the_matrix --show-operator"}
                  speed={30}
                  startDelay={500}
                  className="inline-block"
                  showCursor={!commandTyped}
                  onComplete={() => setCommandTyped(true)}
                />
              )}
            </div>

            {/* Output Part 1 */}
            {commandTyped && (
              accessGranted ? (
                <div className="whitespace-pre-wrap">
                  {[
                    "Initializing system...",
                    "Loading user profile...",
                    "Access granted."
                  ].join('\n')}
                </div>
              ) : (
                <TypewriterText
                  text={[
                    "Initializing system...",
                    "Loading user profile...",
                    "Access granted."
                  ]}
                  speed={30}
                  startDelay={500}
                  onComplete={() => setAccessGranted(true)}
                  showCursor={!accessGranted}
                />
              )
            )}

            {/* Output Part 2 */}
            {accessGranted && (
              showMenu ? (
                <div className="whitespace-pre-wrap">
                  {[
                    "",
                    "Welcome to the matrix console of AUGUSTO ICARO.",
                    "Select an option from the menu to proceed."
                  ].join('\n')}
                  <span className="inline-block w-2 h-4 bg-matrix-green ml-1 animate-pulse align-middle" />
                </div>
              ) : (
                <TypewriterText
                  text={[
                    "",
                    "Welcome to the matrix console of AUGUSTO ICARO.",
                    "Select an option from the menu to proceed."
                  ]}
                  speed={30}
                  startDelay={500}
                  onComplete={() => setShowMenu(true)}
                />
              )
            )}

            {/* Mobile Menu - Only shown on mobile or when sidebar is hidden */}
            {showMenu && (
              <div className="md:hidden">
                <Menu
                  items={[
                    { id: 'about', label: 'ABOUT ME' },
                    { id: 'projects', label: 'PROJECTS' },
                    { id: 'contact', label: 'CONTACT' }
                  ]}
                  onSelect={handleMenuSelect}
                  activeId={activeSection}
                />
              </div>
            )}
          </div>
        );
      case 'about':
        return <AboutMe />;
      case 'projects':
        return <Projects />;
      case 'contact':
        return <Contact />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (activeSection) {
      case 'home': return './enter_the_matrix';
      case 'about': return './decrypt user_profile.info';
      case 'projects': return './build_view projects.info';
      case 'contact': return 'ping augustoicaro';
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-matrix-black text-matrix-green font-matrix">
      {/* Matrix Rain Background */}
      <MatrixRain />

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center justify-center h-full p-2 md:p-4">
        <TerminalWindow
          title={getTitle()}
          className={`
            w-full h-full transition-all duration-500
            ${(accessGranted || showMenu) ? 'max-w-5xl' : 'max-w-3xl'}
            md:h-[600px] md:max-h-[90vh]
          `}
          onClose={activeSection !== 'home' ? handleClose : undefined}
        >
          <div className="flex flex-col md:flex-row h-full">
            {/* Sidebar - Desktop Only */}
            {(accessGranted || showMenu) && (
              <div className="hidden md:block h-full">
                <Sidebar activeSection={activeSection} onSelect={handleMenuSelect} />
              </div>
            )}

            {/* Mobile Profile Picture - Only for About Me */}
            {activeSection === 'about' && (
              <div className="md:hidden w-full flex justify-center shrink-0 bg-transparent relative group border-b border-matrix-dark-green">
                <img
                  src={meImg}
                  alt="Augusto Icaro"
                  className="w-full h-full"
                />
              </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 p-4 overflow-auto bg-matrix-black/90 backdrop-blur-sm">
              {renderContent()}
            </div>
          </div>
        </TerminalWindow>
      </div>
    </div>
  )
}

export default App
