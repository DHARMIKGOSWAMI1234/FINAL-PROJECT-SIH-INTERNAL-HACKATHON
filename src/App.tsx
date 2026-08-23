import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { ToastProvider } from './context/ToastContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { HistoryProvider } from './context/HistoryContext';
import { AuthProvider } from './context/AuthContext';
import { CommandPaletteProvider } from './context/CommandPaletteContext';
import { TutorialProvider } from './context/TutorialContext';

import { CustomCursor } from './components/common/CustomCursor';
import { AuroraBackground } from './components/common/AuroraBackground';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CommandPalette } from './components/common/CommandPalette';
import { AIAssistant } from './components/common/AIAssistant';
import { ToastContainer } from './components/common/ToastContainer';
import { TutorialOverlay } from './components/common/TutorialOverlay';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <PreferencesProvider>
              <ToastProvider>
                <FavoritesProvider>
                  <HistoryProvider>
                    <CommandPaletteProvider>
                      <TutorialProvider>
                        <div className="relative min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 dark:bg-[#080B0A] dark:text-slate-100 transition-colors duration-300">
                          {/* Desktop Custom Cursor */}
                          <CustomCursor />

                          {/* Canvas Particles & Aurora Liquid Background */}
                          <AuroraBackground />

                          {/* Sticky Navigation Header */}
                          <Navbar />

                          {/* Router Viewport */}
                          <main className="flex-1 relative z-10">
                            <AppRoutes />
                          </main>

                          {/* Floating AI Assistant Orb & Chat Drawer */}
                          <AIAssistant />

                          {/* Command Palette Overlay (Ctrl + K) */}
                          <CommandPalette />

                          {/* Toast Notification Container */}
                          <ToastContainer />

                          {/* First-time Onboarding Guided Tour Overlay */}
                          <TutorialOverlay />

                          {/* Footer */}
                          <Footer />
                        </div>
                      </TutorialProvider>
                    </CommandPaletteProvider>
                  </HistoryProvider>
                </FavoritesProvider>
              </ToastProvider>
            </PreferencesProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
