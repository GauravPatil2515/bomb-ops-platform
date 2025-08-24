import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Zap, Users, Target, Calendar, Star } from "lucide-react";

const Leaderboard = () => {
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "all">("today");

  // Mock leaderboard data
  const leaderboardData = {
    today: [
      { rank: 1, team: "ALPHA SQUAD", time: "02:47", remaining: "2:13", strikes: 0, difficulty: "Expert", members: 4 },
      { rank: 2, team: "DEFUSE FORCE", time: "03:12", remaining: "1:48", strikes: 1, difficulty: "Pro", members: 5 },
      { rank: 3, team: "BOMB HUNTERS", time: "03:34", remaining: "1:26", strikes: 0, difficulty: "Pro", members: 3 },
      { rank: 4, team: "CODE BREAKERS", time: "04:15", remaining: "0:45", strikes: 2, difficulty: "Novice", members: 6 },
      { rank: 5, team: "WIRE WIZARDS", time: "04:28", remaining: "0:32", strikes: 1, difficulty: "Novice", members: 4 },
    ],
    week: [
      { rank: 1, team: "ALPHA SQUAD", time: "02:31", remaining: "2:29", strikes: 0, difficulty: "Expert", members: 4 },
      { rank: 2, team: "TACTICAL UNIT", time: "02:45", remaining: "2:15", strikes: 0, difficulty: "Expert", members: 5 },
      { rank: 3, team: "DEFUSE FORCE", time: "02:58", remaining: "2:02", strikes: 1, difficulty: "Expert", members: 5 },
      { rank: 4, team: "BOMB HUNTERS", time: "03:12", remaining: "1:48", strikes: 0, difficulty: "Pro", members: 3 },
      { rank: 5, team: "ELITE SQUAD", time: "03:27", remaining: "1:33", strikes: 1, difficulty: "Pro", members: 4 },
    ],
    all: [
      { rank: 1, team: "LEGENDARY UNIT", time: "02:14", remaining: "2:46", strikes: 0, difficulty: "Expert", members: 6 },
      { rank: 2, team: "ALPHA SQUAD", time: "02:31", remaining: "2:29", strikes: 0, difficulty: "Expert", members: 4 },
      { rank: 3, team: "MASTER DEFUSERS", time: "02:38", remaining: "2:22", strikes: 0, difficulty: "Expert", members: 5 },
      { rank: 4, team: "TACTICAL UNIT", time: "02:45", remaining: "2:15", strikes: 0, difficulty: "Expert", members: 5 },
      { rank: 5, team: "BOMB SQUAD ELITE", time: "02:52", remaining: "2:08", strikes: 1, difficulty: "Expert", members: 4 },
    ]
  };

  const currentData = leaderboardData[timeFilter];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Expert": return "text-destructive border-destructive/30";
      case "Pro": return "text-accent border-accent/30";
      case "Novice": return "text-primary border-primary/30";
      default: return "text-muted-foreground border-border";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-accent" />;
      case 2: return <Star className="w-6 h-6 text-muted-foreground" />;
      case 3: return <Target className="w-6 h-6 text-secondary" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-muted-foreground">{rank}</span>;
    }
  };

  return (
    <section className="py-20 bg-gradient-terminal">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-glow">
              <span className="text-primary">MISSION</span> LEADERBOARD
            </h2>
            <p className="text-muted-foreground font-mono">Top performing bomb disposal units</p>
          </div>

          {/* Time Filter */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2 p-1 bg-muted/20 rounded-lg border border-border">
              {(["today", "week", "all"] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={timeFilter === filter ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeFilter(filter)}
                  className={timeFilter === filter ? "mission-button" : "text-muted-foreground hover:text-primary"}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="terminal-card text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary text-glow">247</div>
                <div className="text-sm text-muted-foreground font-mono">Missions Today</div>
              </CardContent>
            </Card>
            <Card className="terminal-card text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-accent text-glow">73%</div>
                <div className="text-sm text-muted-foreground font-mono">Success Rate</div>
              </CardContent>
            </Card>
            <Card className="terminal-card text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-secondary text-glow">03:24</div>
                <div className="text-sm text-muted-foreground font-mono">Avg Time</div>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard Table */}
          <Card className="terminal-card">
            <CardHeader>
              <CardTitle className="text-primary flex items-center space-x-2">
                <Trophy className="w-5 h-5 animate-neon-glow" />
                <span>TOP UNITS - {timeFilter.toUpperCase()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/10">
                      <th className="text-left p-4 font-mono text-muted-foreground">RANK</th>
                      <th className="text-left p-4 font-mono text-muted-foreground">UNIT</th>
                      <th className="text-left p-4 font-mono text-muted-foreground">TIME</th>
                      <th className="text-left p-4 font-mono text-muted-foreground">STRIKES</th>
                      <th className="text-left p-4 font-mono text-muted-foreground">DIFFICULTY</th>
                      <th className="text-left p-4 font-mono text-muted-foreground">SIZE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((entry, index) => (
                      <tr 
                        key={entry.rank} 
                        className={`border-b border-border hover:bg-primary/5 transition-colors ${
                          entry.rank <= 3 ? 'bg-gradient-to-r from-transparent to-primary/5' : ''
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            {getRankIcon(entry.rank)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold font-mono text-primary">{entry.team}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-accent" />
                            <div className="font-mono">
                              <div className="text-accent font-bold">{entry.time}</div>
                              <div className="text-xs text-muted-foreground">+{entry.remaining} left</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-1">
                            <Zap className="w-4 h-4 text-destructive" />
                            <span className={`font-mono font-bold ${entry.strikes === 0 ? 'text-primary' : 'text-destructive'}`}>
                              {entry.strikes}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={`font-mono ${getDifficultyColor(entry.difficulty)}`}>
                            {entry.difficulty}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-secondary" />
                            <span className="font-mono text-secondary">{entry.members}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Achievement Highlights */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="terminal-card border-accent/30 bg-accent/5">
              <CardHeader>
                <CardTitle className="text-accent flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>Record Holder</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-mono">
                  <div className="text-2xl font-bold text-accent text-glow mb-2">LEGENDARY UNIT</div>
                  <div className="text-sm text-muted-foreground">
                    Fastest Expert completion: <span className="text-accent">2:14</span> remaining
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="terminal-card border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-primary flex items-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>Perfect Streak</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-mono">
                  <div className="text-2xl font-bold text-primary text-glow mb-2">ALPHA SQUAD</div>
                  <div className="text-sm text-muted-foreground">
                    Zero strikes in <span className="text-primary">12</span> consecutive missions
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;