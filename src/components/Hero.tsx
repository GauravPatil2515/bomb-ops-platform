import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Timer, Users, Zap } from "lucide-react";

const Hero = () => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown demo

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 scanlines relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.1)_0%,_transparent_50%)]" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="animate-fade-in">
          {/* Status Indicator */}
          <div className="inline-flex items-center space-x-2 mb-8 px-4 py-2 rounded-full border border-primary/30 bg-primary/10">
            <div className="w-2 h-2 bg-primary rounded-full animate-countdown-pulse" />
            <span className="text-sm font-mono status-online">SYSTEM ACTIVE</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-glow">
            CAN YOU <span className="text-primary">DEFUSE</span><br />
            THE <span className="text-destructive glitch-text">BOMB</span>?
          </h1>

          {/* Countdown Display */}
          <div className="mb-8">
            <div className="inline-block terminal-card bg-black/50 border-primary/30">
              <div className="text-sm text-muted-foreground mb-2 font-mono">MISSION TIMER</div>
              <div className="countdown-display text-primary text-6xl">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* Mission Brief */}
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-mono">
            A sophisticated explosive device requires your team's expertise. 
            Work together. Trust your specialists. <span className="text-destructive">Time is running out.</span>
          </p>

          {/* Mission Stats */}
          <div className="grid grid-cols-3 gap-8 mb-12 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary text-glow">5-10</div>
              <div className="text-sm text-muted-foreground font-mono">MINUTES</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary text-glow">2-6</div>
              <div className="text-sm text-muted-foreground font-mono">OPERATORS</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent text-glow">3-5</div>
              <div className="text-sm text-muted-foreground font-mono">MODULES</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="mission-button text-lg px-8 py-4">
              <Play className="w-5 h-5 mr-2" />
              INITIATE MISSION
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-primary/30 text-primary hover:bg-primary/10">
              <BookOpen className="w-5 h-5 mr-2" />
              STUDY MANUAL
            </Button>
          </div>

          {/* Features Grid */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="terminal-card text-center animate-slide-up">
              <Timer className="w-12 h-12 text-primary mx-auto mb-4 animate-countdown-pulse" />
              <h3 className="text-xl font-bold mb-2 text-primary">Real-Time Pressure</h3>
              <p className="text-muted-foreground font-mono">Every second counts. Feel the tension build as the countdown approaches zero.</p>
            </div>
            <div className="terminal-card text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Users className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-secondary">Team Coordination</h3>
              <p className="text-muted-foreground font-mono">Communication is critical. One person defuses, others guide with the manual.</p>
            </div>
            <div className="terminal-card text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Zap className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-accent">Complex Modules</h3>
              <p className="text-muted-foreground font-mono">Wires, symbols, sequences. Each module requires precision and expertise.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;