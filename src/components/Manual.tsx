import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Zap, 
  Cable, 
  Gamepad2, 
  Compass, 
  Radio, 
  Download, 
  ExternalLink,
  AlertTriangle,
  Timer
} from "lucide-react";

const Manual = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const modules = [
    {
      id: "wires",
      name: "Simple Wires",
      icon: Cable,
      difficulty: "Basic",
      description: "Cut the correct wire based on wire colors and positions",
      color: "text-primary",
      rules: [
        "If no red wires: cut the second wire",
        "If red wire and last digit of serial is odd: cut the last red wire",
        "If exactly two blue wires: cut the last blue wire",
        "If more than one yellow wire: cut the last yellow wire",
        "Otherwise: cut the first wire"
      ]
    },
    {
      id: "button",
      name: "Big Button",
      icon: Gamepad2,
      difficulty: "Basic",
      description: "Press and hold or tap based on button color and label",
      color: "text-secondary",
      rules: [
        "Blue button labeled 'Abort': hold until countdown has a 4",
        "More than 1 battery and white button: hold and release when timer has 3",
        "Yellow button: hold and release when timer has 5",
        "Red button labeled 'Hold': hold and release when timer has 1",
        "Otherwise: press and release immediately"
      ]
    },
    {
      id: "symbols",
      name: "Keypads",
      icon: Compass,
      difficulty: "Intermediate",
      description: "Press symbols in the correct order based on symbol charts",
      color: "text-accent",
      rules: [
        "Find the column containing all 4 symbols on your keypad",
        "Press symbols in the order they appear in that column",
        "Reference the symbol chart carefully",
        "Wrong order will cause a strike"
      ]
    },
    {
      id: "simon",
      name: "Simon Says",
      icon: Radio,
      difficulty: "Advanced",
      description: "Follow the sequence based on colors and strikes",
      color: "text-destructive",
      rules: [
        "Colors change meaning based on number of strikes",
        "Red: depends on strikes (Red→Blue→Green→Yellow)",
        "Blue: depends on strikes (Yellow→Green→Blue→Red)",
        "Input the correct sequence for each stage"
      ]
    },
    {
      id: "maze",
      name: "Maze Navigation",
      icon: Compass,
      difficulty: "Advanced",
      description: "Navigate through maze avoiding walls",
      color: "text-primary",
      rules: [
        "Identify your maze using the corner patterns",
        "Find your current position (white circle)",
        "Navigate to the red triangle target",
        "Cannot move through walls"
      ]
    }
  ];

  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-20 bg-gradient-terminal">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-glow">
              <span className="text-primary">BOMB DISPOSAL</span> MANUAL
            </h2>
            <p className="text-muted-foreground font-mono mb-8">
              Critical reference material for expert operators
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search modules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="terminal-input pl-10 font-mono"
                />
              </div>
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Safety Warning */}
          <Card className="terminal-card border-destructive/30 bg-destructive/5 mb-8">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-destructive mb-2">CRITICAL SAFETY PROTOCOL</h3>
                  <div className="text-sm font-mono text-muted-foreground space-y-1">
                    <div>• Only the DEFUSER should touch the bomb device</div>
                    <div>• EXPERTS must clearly communicate all instructions</div>
                    <div>• Three strikes and the mission fails</div>
                    <div>• When in doubt, double-check with the manual</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Module Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredModules.map((module) => {
              const IconComponent = module.icon;
              return (
                <Card key={module.id} className="terminal-card hover:neon-glow transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`w-8 h-8 ${module.color}`} />
                        <div>
                          <CardTitle className={`${module.color} text-xl`}>{module.name}</CardTitle>
                          <CardDescription className="font-mono">{module.description}</CardDescription>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`border-current ${module.color} bg-current/10`}
                      >
                        {module.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-bold text-primary font-mono">OPERATING PROCEDURES:</h4>
                      <ul className="space-y-2">
                        {module.rules.map((rule, index) => (
                          <li key={index} className="text-sm font-mono text-muted-foreground flex items-start">
                            <span className="text-primary mr-2 flex-shrink-0">•</span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-3 border-t border-border">
                        <Button variant="outline" size="sm" className="w-full border-primary/30 text-primary hover:bg-primary/10">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Detailed Guide
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Reference */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="text-primary flex items-center space-x-2">
                  <Timer className="w-5 h-5" />
                  <span>Time Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm font-mono text-muted-foreground">
                  <div>• <span className="text-accent">Quick Mission:</span> 5 minutes, 3 modules</div>
                  <div>• <span className="text-accent">Full Mission:</span> 10 minutes, 5 modules</div>
                  <div>• <span className="text-destructive">Time pressure increases mistakes</span></div>
                  <div>• <span className="text-primary">Stay calm and communicate clearly</span></div>
                </div>
              </CardContent>
            </Card>

            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="text-primary flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Strike System</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm font-mono text-muted-foreground">
                  <div>• <span className="text-primary">Novice:</span> 3 strikes allowed</div>
                  <div>• <span className="text-accent">Pro:</span> 2 strikes allowed</div>
                  <div>• <span className="text-destructive">Expert:</span> 1 strike allowed</div>
                  <div>• <span className="text-destructive">3rd strike = mission failure</span></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <p className="text-sm font-mono text-muted-foreground">
              This manual contains critical information for bomb disposal operations.<br />
              <span className="text-primary">Study carefully. Lives depend on it.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Manual;