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

interface DynamicProfileProps {
  profileId: string;
}

const getIconComponent = (iconName: string) => {
  const icons = {
    Music: <Music className="w-6 h-6 text-[#292929]" />,
    Instagram: <Instagram className="w-6 h-6 text-[#292929]" />,
    Globe: <Globe className="w-6 h-6 text-[#292929]" />,
    Youtube: <Youtube className="w-6 h-6 text-[#292929]" />,
    Twitter: <Twitter className="w-6 h-6 text-[#292929]" />,
    Linkedin: <Linkedin className="w-6 h-6 text-[#292929]" />,
    Github: <Github className="w-6 h-6 text-[#292929]" />,
  };
  return icons[iconName as keyof typeof icons] || <Globe className="w-6 h-6 text-[#292929]" />;
};

const getRelationshipIcon = (status: string) => {
  switch (status) {
    case 'single':
      return <Heart className="w-4 h-4 text-[#292929]/70" />;
    case 'dating':
    case 'engaged':
    case 'married':
      return <Heart className="w-4 h-4 text-red-400" />;
    default:
      return <Heart className="w-4 h-4 text-[#292929]/70" />;
  }
};

export default function DynamicProfile({ profileId }: DynamicProfileProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [displayedBio, setDisplayedBio] = useState<string>("");
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

  // Typewriter effect for bio
  useEffect(() => {
    if (!profile?.bio) return;
    
    let index = 0;
    let isDeleting = false;
    const fullText = profile.bio;
    
    const typewriterEffect = () => {
      if (!isDeleting && index < fullText.length) {
        setDisplayedBio(fullText.substring(0, index + 1));
        index++;
        setTimeout(typewriterEffect, 100);
      } else if (!isDeleting && index === fullText.length) {
        setTimeout(() => { isDeleting = true; typewriterEffect(); }, 5000);
      } else if (isDeleting && index > 0) {
        setDisplayedBio(fullText.substring(0, index - 1));
        index--;
        setTimeout(typewriterEffect, 50);
      } else if (isDeleting && index === 0) {
        isDeleting = false;
        setTimeout(typewriterEffect, 500);
      }
    };
    
    typewriterEffect();
  }, [profile?.bio]);

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
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${profile.profileImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center p-4">
        <div className="max-w-sm mx-auto space-y-6 text-center">
          
          {/* Bio Container */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-0">
            <h1 className="text-[#292929] text-2xl font-bold mb-4 tracking-tight">
              Hi I'm {profile.name}
            </h1>
            <p className="text-[#292929]/80 text-lg leading-relaxed mb-4 font-mono min-h-[3rem]">
              {displayedBio}
              <span className="animate-pulse">|</span>
            </p>
            
            {/* Profile Details */}
            {!profile.hidePersonalInfo && (
              <div className="flex flex-col items-center gap-2 mt-4 pt-4 border-t border-[#292929]/20">
                {/* Relationship Status */}
                <div className="flex items-center gap-2">
                  {getRelationshipIcon(profile.relationshipStatus)}
                  <span className="text-[#292929]/70 text-sm capitalize">
                    {profile.relationshipStatus.replace('-', ' ')}
                  </span>
                </div>
                
                {/* Job Title & Area */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#292929]/70" />
                    <span className="text-[#292929]/70 text-sm capitalize">
                      {profile.jobTitle?.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#292929]/70" />
                    <span className="text-[#292929]/70 text-sm capitalize">
                      {profile.area?.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Vertical Links */}
          <div className="flex flex-col items-center gap-4">
            {profile.links.map((link, index) => (
              <div 
                key={index}
                onClick={() => handleExternalLinkClick(link.url)}
                className="cursor-pointer group flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-105 transform mb-2 shadow-lg">
                  {getIconComponent(link.icon)}
                </div>
                <p className="text-white text-sm font-medium text-center bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                  {link.name}
                </p>
              </div>
            ))}
          </div>

          {/* Question Section */}
          {isLoadingQuestion ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
              <div className="text-[#292929]/70 text-center py-8">
                Loading question...
              </div>
            </div>
          ) : currentQuestion ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
              <h2 className="text-[#292929] text-xl font-bold mb-3 tracking-tight">
                Question about me
              </h2>
              <p className="text-[#292929]/70 text-sm mb-6">
                Guess the answer and submit to get to know me better!
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center">
                  <p className="text-[#292929] text-lg font-medium mb-4">
                    {currentQuestion.text}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedAnswer(option)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm ${
                          selectedAnswer === option
                            ? 'bg-[#292929] text-white border-[#292929] shadow-lg'
                            : 'bg-white text-[#292929] border-[#292929]/30 hover:bg-[#292929]/10'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white border-[#292929]/30 text-[#292929] placeholder:text-[#292929]/50"
                    />
                    
                    <Button
                      type="submit"
                      disabled={submitAnswerMutation.isPending}
                      className="w-full bg-[#292929] text-white hover:bg-[#292929]/90 font-medium py-3 rounded-xl"
                    >
                      {submitAnswerMutation.isPending ? "Submitting..." : "Submit Answer"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
              <div className="text-[#292929]/70 text-center py-8">
                No question available at the moment.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}