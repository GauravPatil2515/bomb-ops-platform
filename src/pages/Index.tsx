import { useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import GameSetup from "@/components/GameSetup";
import Manual from "@/components/Manual";
import Leaderboard from "@/components/Leaderboard";
import AdminDashboard from "@/components/AdminDashboard";

const Index = () => {
  const [currentView, setCurrentView] = useState<"home" | "play" | "manual" | "leaderboard" | "admin">("home");

  const renderCurrentView = () => {
    switch (currentView) {
      case "play":
        return <GameSetup />;
      case "manual":
        return <Manual />;
      case "leaderboard":
        return <Leaderboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <Hero />;
    }
  };

  return (
    <div className="min-h-screen bg-background scanlines">
      <Navigation />
      <main className="pt-20">
        {renderCurrentView()}
        
        {/* Quick Navigation Menu - Demo purposes */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex space-x-2 p-2 bg-background/95 backdrop-blur-sm border border-border rounded-lg">
            <button
              onClick={() => setCurrentView("home")}
              className={`px-3 py-2 rounded text-sm font-mono transition-colors ${
                currentView === "home" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              HOME
            </button>
            <button
              onClick={() => setCurrentView("play")}
              className={`px-3 py-2 rounded text-sm font-mono transition-colors ${
                currentView === "play" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              PLAY
            </button>
            <button
              onClick={() => setCurrentView("manual")}
              className={`px-3 py-2 rounded text-sm font-mono transition-colors ${
                currentView === "manual" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              MANUAL
            </button>
            <button
              onClick={() => setCurrentView("leaderboard")}
              className={`px-3 py-2 rounded text-sm font-mono transition-colors ${
                currentView === "leaderboard" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              SCORES
            </button>
            <button
              onClick={() => setCurrentView("admin")}
              className={`px-3 py-2 rounded text-sm font-mono transition-colors ${
                currentView === "admin" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              CONTROL
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
