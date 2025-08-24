import { Button } from "@/components/ui/button";
import { Shield, BookOpen, Trophy, Settings } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-primary animate-neon-glow" />
            <span className="text-xl font-bold text-primary glitch-text">DEFUSE PROTOCOL</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#manual" className="text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Manual</span>
            </a>
            <a href="#leaderboard" className="text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </a>
            <a href="#admin" className="text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Control</span>
            </a>
          </div>

          <Button className="mission-button">
            START MISSION
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;