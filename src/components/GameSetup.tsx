import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Zap, Shield, AlertTriangle } from "lucide-react";

const GameSetup = () => {
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState(4);
  const [selectedMode, setSelectedMode] = useState<"quick" | "full">("quick");
  const [difficulty, setDifficulty] = useState<"novice" | "pro" | "expert">("novice");

  const modes = {
    quick: {
      duration: 5,
      modules: 3,
      price: 299,
      description: "Perfect for first-time teams"
    },
    full: {
      duration: 10,
      modules: 5,
      price: 499,
      description: "The complete bomb defusal experience"
    }
  };

  const difficulties = {
    novice: { strikes: 3, complexity: "Basic", color: "text-primary" },
    pro: { strikes: 2, complexity: "Advanced", color: "text-accent" },
    expert: { strikes: 1, complexity: "Extreme", color: "text-destructive" }
  };

  return (
    <section className="py-20 bg-gradient-terminal">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-glow">
              <span className="text-primary">MISSION</span> CONFIGURATION
            </h2>
            <p className="text-muted-foreground font-mono">Configure your team and select mission parameters</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Team Setup */}
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-primary">
                  <Users className="w-5 h-5" />
                  <span>Team Configuration</span>
                </CardTitle>
                <CardDescription className="font-mono">Assemble your bomb disposal unit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-mono text-muted-foreground mb-2">TEAM DESIGNATION</label>
                  <Input
                    placeholder="Enter team callsign..."
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="terminal-input font-mono"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-mono text-muted-foreground mb-2">TEAM SIZE</label>
                  <div className="flex space-x-2">
                    {[2, 3, 4, 5, 6].map((size) => (
                      <Button
                        key={size}
                        variant={teamSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTeamSize(size)}
                        className={teamSize === size ? "mission-button" : "border-primary/30 text-primary hover:bg-primary/10"}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="border border-primary/20 rounded p-4 bg-primary/5">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm font-mono text-primary">ROLES BRIEFING</span>
                  </div>
                  <div className="text-sm text-muted-foreground font-mono space-y-1">
                    <div>• <span className="text-primary">1 DEFUSER</span> - Hands on the device</div>
                    <div>• <span className="text-secondary">{teamSize - 1} EXPERTS</span> - Manual specialists</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mission Parameters */}
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-primary">
                  <Zap className="w-5 h-5" />
                  <span>Mission Parameters</span>
                </CardTitle>
                <CardDescription className="font-mono">Select mission difficulty and duration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mode Selection */}
                <div>
                  <label className="block text-sm font-mono text-muted-foreground mb-3">MISSION TYPE</label>
                  <div className="space-y-3">
                    {Object.entries(modes).map(([key, mode]) => (
                      <div
                        key={key}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedMode === key
                            ? 'border-primary bg-primary/10 neon-glow'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedMode(key as "quick" | "full")}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="font-bold text-primary">{key.toUpperCase()}</span>
                            <Badge variant="outline" className="border-primary/30 text-primary">
                              {mode.duration} MIN
                            </Badge>
                          </div>
                          <span className="text-2xl font-bold text-primary">₹{mode.price}</span>
                        </div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {mode.modules} modules • {mode.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Difficulty Selection */}
                <div>
                  <label className="block text-sm font-mono text-muted-foreground mb-3">DIFFICULTY LEVEL</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(difficulties).map(([key, diff]) => (
                      <Button
                        key={key}
                        variant={difficulty === key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDifficulty(key as "novice" | "pro" | "expert")}
                        className={`flex flex-col h-auto py-3 ${
                          difficulty === key 
                            ? key === 'expert' ? 'danger-button' : 'mission-button'
                            : 'border-primary/30 text-primary hover:bg-primary/10'
                        }`}
                      >
                        <span className="font-bold">{key.toUpperCase()}</span>
                        <span className="text-xs opacity-80">{diff.strikes} strikes</span>
                      </Button>
                    ))}
                  </div>
                  
                  <div className="mt-3 flex items-center space-x-2 text-sm font-mono">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span className="text-muted-foreground">
                      Higher difficulty = fewer mistakes allowed
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mission Summary & Deploy */}
          <Card className="terminal-card mt-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">MISSION SUMMARY</h3>
                  <div className="space-y-1 text-sm font-mono text-muted-foreground">
                    <div>Team: <span className="text-primary">{teamName || "UNNAMED UNIT"}</span></div>
                    <div>Operators: <span className="text-secondary">{teamSize}</span></div>
                    <div>Duration: <span className="text-accent">{modes[selectedMode].duration} minutes</span></div>
                    <div>Modules: <span className="text-accent">{modes[selectedMode].modules}</span></div>
                    <div>Difficulty: <span className={difficulties[difficulty].color}>{difficulty.toUpperCase()}</span></div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary mb-2">₹{modes[selectedMode].price}</div>
                  <Button 
                    size="lg" 
                    className="mission-button text-lg px-8"
                    disabled={!teamName.trim()}
                  >
                    DEPLOY TO MISSION
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GameSetup;