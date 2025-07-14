import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, RotateCcw } from "lucide-react";
import { api } from "@/lib/api";

export default function Timer() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1500); // 25 minutes in seconds
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [startTime, setStartTime] = useState<Date | null>(null);

  const { data: subjectsData } = useQuery({
    queryKey: ["/api/v1/subjects"],
  });

  const { data: topicsData } = useQuery({
    queryKey: ["/api/v1/topics", "subject", selectedSubject],
    enabled: !!selectedSubject,
  });

  const { data: streakData } = useQuery({
    queryKey: ["/api/v1/streaks"],
  });

  const { data: sessionsData } = useQuery({
    queryKey: ["/api/v1/sessions"],
  });

  const createSessionMutation = useMutation({
    mutationFn: (duration: number) => 
      api.sessions.create(
        duration, 
        selectedSubject ? parseInt(selectedSubject) : undefined,
        selectedTopic ? parseInt(selectedTopic) : undefined
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/streaks"] });
      toast({
        title: "Session Complete!",
        description: "Great job on completing your study session",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save session",
        variant: "destructive",
      });
    },
  });

  const subjects = subjectsData?.subjects || [];
  const topics = topicsData?.topics || [];
  const streak = streakData?.streak || { currentStreak: 0, longestStreak: 0 };
  const sessions = sessionsData?.sessions || [];

  // Calculate today's sessions and study time
  const today = new Date().toDateString();
  const todaysSessions = sessions.filter((session: any) => 
    new Date(session.createdAt).toDateString() === today
  );
  const totalStudyTime = todaysSessions.reduce((total: number, session: any) => 
    total + session.duration, 0
  );

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Calculate duration and create session
            if (startTime) {
              const duration = Math.round((Date.now() - startTime.getTime()) / 1000 / 60); // in minutes
              createSessionMutation.mutate(duration);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, startTime, createSessionMutation]);

  const toggleTimer = () => {
    if (!isRunning) {
      setStartTime(new Date());
    } else {
      // Save partial session if stopping early
      if (startTime) {
        const duration = Math.round((Date.now() - startTime.getTime()) / 1000 / 60); // in minutes
        if (duration > 0) {
          createSessionMutation.mutate(duration);
        }
      }
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeRemaining(1500); // Reset to 25 minutes
    setStartTime(null);
  };

  const setTimer = (duration: number) => {
    setIsRunning(false);
    setTimeRemaining(duration);
    setStartTime(null);
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Timer</h1>
            <p className="text-gray-600">Focus on your studies with our interactive timer</p>
          </div>

          {/* Timer Card */}
          <Card className="mb-8">
            <CardContent className="p-12 text-center">
              {/* Subject & Topic Selection */}
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject: any) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select 
                    value={selectedTopic} 
                    onValueChange={setSelectedTopic}
                    disabled={!selectedSubject}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic: any) => (
                        <SelectItem key={topic.id} value={topic.id.toString()}>
                          {topic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Timer Display */}
              <div className="mb-8">
                <div className="text-6xl font-bold text-gray-900 mb-4">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-gray-600">
                  {timeRemaining === 0 ? "Time's up!" : "Pomodoro Session"}
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex justify-center space-x-4 mb-8">
                <Button 
                  size="lg"
                  onClick={toggleTimer}
                  disabled={timeRemaining === 0}
                  className="px-8 py-4"
                >
                  {isRunning ? (
                    <>
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={resetTimer}
                  className="px-8 py-4"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>

              {/* Timer Presets */}
              <div className="flex justify-center space-x-3">
                <Button 
                  variant={timeRemaining === 1500 ? "default" : "outline"}
                  onClick={() => setTimer(1500)}
                  disabled={isRunning}
                >
                  25 min
                </Button>
                <Button 
                  variant={timeRemaining === 900 ? "default" : "outline"}
                  onClick={() => setTimer(900)}
                  disabled={isRunning}
                >
                  15 min
                </Button>
                <Button 
                  variant={timeRemaining === 3000 ? "default" : "outline"}
                  onClick={() => setTimer(3000)}
                  disabled={isRunning}
                >
                  50 min
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Session Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  {todaysSessions.length}
                </div>
                <div className="text-gray-600">Sessions Today</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {formatMinutes(totalStudyTime)}
                </div>
                <div className="text-gray-600">Total Study Time</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  {streak.currentStreak}
                </div>
                <div className="text-gray-600">Day Streak</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
