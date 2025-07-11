import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Music, Instagram, Globe, Youtube, Twitter, Linkedin, Github, Heart, MapPin, Briefcase } from "lucide-react";
import type { Question, InsertSubmission, Profile } from "@shared/schema";
import greenGradientGif from "@assets/download (3)_1752232023115.gif";
import brownGradientGif from "@assets/download (4)_1752232152967.gif";
import backgroundImage from "@assets/Painitng _1752240240701.jpg";
import e3Logo from "@assets/8_1752241069398.png";

interface DynamicProfileProps {
  profileId: string;
}

const getIconComponent = (iconName: string) => {
  const icons = {
    Music: <Music className="w-12 h-12 text-gray-700" />,
    Instagram: <Instagram className="w-12 h-12 text-gray-700" />,
    Globe: <Globe className="w-12 h-12 text-gray-700" />,
    Youtube: <Youtube className="w-12 h-12 text-gray-700" />,
    Twitter: <Twitter className="w-12 h-12 text-gray-700" />,
    Linkedin: <Linkedin className="w-12 h-12 text-gray-700" />,
    Github: <Github className="w-12 h-12 text-gray-700" />,
  };
  return icons[iconName as keyof typeof icons] || <Globe className="w-12 h-12 text-gray-700" />;
};

const getRelationshipIcon = (status: string) => {
  switch (status) {
    case 'single':
      return <Heart className="w-4 h-4 text-white/70" />;
    case 'dating':
    case 'engaged':
    case 'married':
      return <Heart className="w-4 h-4 text-red-400" />;
    default:
      return <Heart className="w-4 h-4 text-white/70" />;
  }
};

export default function DynamicProfile({ profileId }: DynamicProfileProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [timeData, setTimeData] = useState<{
    isDayTime: boolean;
    blurLevel: string;
    opacity: number;
    backgroundImage: string;
  }>({
    isDayTime: true,
    blurLevel: 'blur-xl',
    opacity: 0.1,
    backgroundImage: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Time zone adaptive system
  useEffect(() => {
    const updateTimeBasedStyles = () => {
      const now = new Date();
      const gmtTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
      const hours = gmtTime.getHours();
      
      // Day time: 8:00 AM - 6:00 PM (08:00 - 18:00)
      const isDayTime = hours >= 8 && hours < 18;
      
      let blurLevel: string;
      let opacity: number;
      
      if (isDayTime) {
        // Ultra thick blur (8am-6pm)
        blurLevel = 'blur-ultra-thick';
        opacity = 0.1; // 10% opacity
      } else {
        // Ultra thin blur (6pm-7:59am)
        blurLevel = 'blur-ultra-thin';
        opacity = 0.7; // 70% opacity
      }
      
      // Background selection based on time
      const backgroundImage = isDayTime 
        ? 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80' // Blue sky
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'; // Dark sky with clouds
      
      setTimeData({
        isDayTime,
        blurLevel,
        opacity,
        backgroundImage
      });
    };

    updateTimeBasedStyles();
    // Update every minute
    const interval = setInterval(updateTimeBasedStyles, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Fetch profile data
  const { data: profile, isLoading: isLoadingProfile } = useQuery<Profile>({
    queryKey: [`/api/profiles/${profileId}`],
  });

  // Fetch current question
  const { data: currentQuestion, isLoading: isLoadingQuestion } = useQuery<Question>({
    queryKey: ["/api/questions/current"],
  });

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: async (data: InsertSubmission) => {
      const response = await apiRequest("POST", "/api/submissions", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Thank you for your answer!",
      });
      setSelectedAnswer("");
      setEmail("");
      queryClient.invalidateQueries({ queryKey: ["/api/questions/current"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Please fill in all fields correctly.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAnswer || !email || !currentQuestion) {
      toast({
        title: "Error",
        description: "Please fill in all fields correctly.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    submitAnswerMutation.mutate({
      questionId: currentQuestion.id,
      email,
      selectedAnswer,
    });
  };

  const handleExternalLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300 p-4 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300 p-4 flex items-center justify-center">
        <div className="text-white text-xl">Profile not found</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-4 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Profile Identity Section */}
        <Card className="rounded-3xl text-center shadow-lg border-0 relative overflow-hidden h-96 max-w-sm mx-auto">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${profile.profileImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="relative z-10 h-full flex flex-col justify-end p-8">
            <h1 className="text-white text-3xl font-bold mb-3 tracking-tight">
              {profile.name}
            </h1>
            
            {/* Profile Details */}
            {!profile.hidePersonalInfo && (
              <div className="flex justify-center mt-4">
                <div className="flex items-center gap-4 px-4 py-2 border-2 border-white/30 rounded-full bg-white/5 backdrop-blur-sm">
                  {/* Relationship Status */}
                  <div className="flex items-center gap-2">
                    {getRelationshipIcon(profile.relationshipStatus)}
                    <span className="text-white/70 text-sm capitalize">
                      {profile.relationshipStatus.replace('-', ' ')}
                    </span>
                  </div>
                  
                  {/* Job Title */}
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-white/70" />
                    <span className="text-white/70 text-sm capitalize">
                      {profile.jobTitle?.replace('-', ' ')}
                    </span>
                  </div>
                  
                  {/* Area */}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-white/70" />
                    <span className="text-white/70 text-sm capitalize">
                      {profile.area?.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Connect With Me Section */}
        <Card className="relative overflow-hidden system-panel time-adaptive-bg" style={{ 
          background: 'rgba(254, 254, 250, 0.2)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          color: '#1B1B1B'
        }}>
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(254, 254, 250, 0.15), rgba(254, 254, 250, 0.05))',
              zIndex: 1
            }}
          ></div>
          <div 
            className={`absolute inset-0 ${timeData.blurLevel} time-adaptive-bg`}
            style={{
              backgroundImage: `url(${timeData.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: timeData.opacity
            }}
          ></div>
          <div className="relative z-10" style={{ zIndex: 2 }}>
            <div className="mb-8 text-center">
              <p className="text-gray-800 text-lg leading-relaxed typewriter-animation max-w-md mx-auto" style={{ lineHeight: '2' }}>
                {profile.bio}
              </p>
            </div>
            
            {/* Divider */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex-1 h-0.5 bg-gray-600/60"></div>
              <div className="px-6">
                <div className="w-3 h-3 bg-gray-600/80 rounded-full shadow-sm"></div>
              </div>
              <div className="flex-1 h-0.5 bg-gray-600/60"></div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 justify-items-center">
              {profile.links.map((link, index) => (
                <div 
                  key={index}
                  onClick={() => handleExternalLinkClick(link.url)}
                  className="cursor-pointer group"
                >
                  <div className="w-32 h-32 bg-white/20 backdrop-blur-sm border-2 border-gray-300/50 rounded-2xl flex items-center justify-center hover:bg-white/30 transition-all duration-200 hover:scale-105 transform mb-3">
                    {getIconComponent(link.icon)}
                  </div>
                  <p className="text-gray-800 text-lg font-medium text-center max-w-32 truncate">
                    {link.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Question About Me Section */}
        <Card className="relative overflow-hidden system-panel time-adaptive-bg" style={{ 
          background: 'rgba(254, 254, 250, 0.2)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          color: '#1B1B1B'
        }}>
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(254, 254, 250, 0.15), rgba(254, 254, 250, 0.05))',
              zIndex: 1
            }}
          ></div>
          <div 
            className={`absolute inset-0 ${timeData.blurLevel} time-adaptive-bg`}
            style={{
              backgroundImage: `url(${timeData.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: timeData.opacity
            }}
          ></div>
          <div className="relative z-10 text-center" style={{ zIndex: 2 }}>
            <div className="flex justify-center mb-6">
              <img 
                src={e3Logo} 
                alt="E3 Logo" 
                className="w-20 h-20 object-contain"
              />
            </div>
            
            {isLoadingQuestion ? (
              <div className="text-gray-700 text-center">Loading question...</div>
            ) : currentQuestion ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <p className="text-gray-700 text-lg mb-6">
                  {currentQuestion.text}
                </p>
                
                {/* Button Options */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedAnswer('earth')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                      selectedAnswer === 'earth' 
                        ? "border-[#8B4513] bg-[#8B4513] text-white" 
                        : "border-gray-300 bg-white/50 hover:border-[#8B4513]/40 text-gray-700"
                    }`}
                  >
                    <div className="w-6 h-6 bg-[#8B4513] rounded-full border-2 border-white shadow-inner"></div>
                    <span className="text-sm font-medium">Earth</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setSelectedAnswer('land')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                      selectedAnswer === 'land' 
                        ? "border-[#228B22] bg-[#228B22] text-white" 
                        : "border-gray-300 bg-white/50 hover:border-[#228B22]/40 text-gray-700"
                    }`}
                  >
                    <div className="w-6 h-6 bg-[#228B22] rounded-full border-2 border-white shadow-inner"></div>
                    <span className="text-sm font-medium">Land</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setSelectedAnswer('sea')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                      selectedAnswer === 'sea' 
                        ? "border-[#0066CC] bg-[#0066CC] text-white" 
                        : "border-gray-300 bg-white/50 hover:border-[#0066CC]/40 text-gray-700"
                    }`}
                  >
                    <div className="w-6 h-6 bg-[#0066CC] rounded-full border-2 border-white shadow-inner"></div>
                    <span className="text-sm font-medium">Sea</span>
                  </button>
                </div>
                
                {/* Email Input */}
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/70 backdrop-blur-sm border-2 border-gray-300 rounded-full py-4 px-6 text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200 h-auto"
                />
                
                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitAnswerMutation.isPending}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-4 px-6 rounded-full transition-all duration-200 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-gray-400 h-auto"
                >
                  {submitAnswerMutation.isPending ? "Submitting..." : "Submit"}
                </Button>
              </form>
            ) : (
              <div className="text-gray-700 text-center">No question available</div>
            )}
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <Button 
            onClick={() => window.location.href = "/onboarding/phase1"}
            variant="ghost" 
            className="text-white hover:bg-white/10 rounded-full"
          >
            Create Your Own Profile
          </Button>
        </div>
      </div>
    </div>
  );
}