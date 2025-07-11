import { useState } from "react";
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
import cloudyBackgroundImage from "@assets/Painitng _1752242587741.jpg";
import darkSkyImage from "@assets/Dark mode_1752242828174.jpg";

interface DynamicProfileProps {
  profileId: string;
}

const getIconComponent = (iconName: string) => {
  const icons = {
    Music: <Music className="w-12 h-12 text-white" />,
    Instagram: <Instagram className="w-12 h-12 text-white" />,
    Globe: <Globe className="w-12 h-12 text-white" />,
    Youtube: <Youtube className="w-12 h-12 text-white" />,
    Twitter: <Twitter className="w-12 h-12 text-white" />,
    Linkedin: <Linkedin className="w-12 h-12 text-white" />,
    Github: <Github className="w-12 h-12 text-white" />,
  };
  return icons[iconName as keyof typeof icons] || <Globe className="w-12 h-12 text-white" />;
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      <div className="max-w-sm mx-auto space-y-6">
        
        {/* Profile Identity Section */}
        <Card className="rounded-3xl text-center shadow-lg border-0 relative overflow-hidden h-96">
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
        <Card className="rounded-3xl p-8 shadow-lg border-0 relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-80 blur-sm"
            style={{
              backgroundImage: `url(${cloudyBackgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
          <div className="relative z-10">
            <div className="mb-8 text-center">
              <p className="text-white/90 text-lg leading-relaxed typewriter-animation">
                {profile.bio}
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 justify-items-center">
              {profile.links.map((link, index) => (
                <div 
                  key={index}
                  onClick={() => handleExternalLinkClick(link.url)}
                  className="cursor-pointer group"
                >
                  <div className="w-32 h-32 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all duration-200 hover:scale-105 transform mb-3">
                    {getIconComponent(link.icon)}
                  </div>
                  <p className="text-white/90 text-xs font-medium text-center max-w-32 truncate">
                    {link.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Question About Me Section */}
        <Card className="rounded-3xl p-8 shadow-lg border-0 relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-80 blur-sm"
            style={{
              backgroundImage: `url(${darkSkyImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
          <div className="relative z-10 text-center">
            <div className="flex justify-center mb-6">
              <img 
                src={e3Logo} 
                alt="E3 Logo" 
                className="w-20 h-20 object-contain"
              />
            </div>
            
            {isLoadingQuestion ? (
              <div className="text-white/90 text-center">Loading question...</div>
            ) : currentQuestion ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <p className="text-white/90 text-lg mb-6">
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
                        : "border-white/20 bg-white/10 hover:border-[#8B4513]/40 text-white"
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
                        : "border-white/20 bg-white/10 hover:border-[#228B22]/40 text-white"
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
                        : "border-white/20 bg-white/10 hover:border-[#0066CC]/40 text-white"
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
                  className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full py-4 px-6 text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 h-auto"
                />
                
                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitAnswerMutation.isPending}
                  className="w-full bg-black/80 hover:bg-black text-white font-semibold py-4 px-6 rounded-full transition-all duration-200 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-white/50 h-auto"
                >
                  {submitAnswerMutation.isPending ? "Submitting..." : "Submit"}
                </Button>
              </form>
            ) : (
              <div className="text-white/90 text-center">No question available</div>
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