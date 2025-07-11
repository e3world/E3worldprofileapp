import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Music, Instagram, Globe, Youtube, Twitter, Linkedin, Github, Heart, MapPin, Briefcase, ExternalLink } from "lucide-react";
import type { Question, InsertSubmission, Profile } from "@shared/schema";
import greenGradientGif from "@assets/download (3)_1752232023115.gif";
import brownGradientGif from "@assets/download (4)_1752232152967.gif";

interface DynamicProfileProps {
  profileId: string;
}

const getIconFromUrl = (url: string) => {
  const domain = url.toLowerCase();
  if (domain.includes('spotify.com')) return { icon: <Music className="w-8 h-8 text-white" />, name: 'Music' };
  if (domain.includes('instagram.com')) return { icon: <Instagram className="w-8 h-8 text-white" />, name: 'Instagram' };
  if (domain.includes('youtube.com')) return { icon: <Youtube className="w-8 h-8 text-white" />, name: 'Youtube' };
  if (domain.includes('twitter.com')) return { icon: <Twitter className="w-8 h-8 text-white" />, name: 'Twitter' };
  if (domain.includes('linkedin.com')) return { icon: <Linkedin className="w-8 h-8 text-white" />, name: 'Linkedin' };
  if (domain.includes('github.com')) return { icon: <Github className="w-8 h-8 text-white" />, name: 'Github' };
  return { icon: <ExternalLink className="w-8 h-8 text-white" />, name: 'External' };
};

const getIconComponent = (iconName: string) => {
  const icons = {
    Music: <Music className="w-8 h-8 text-white" />,
    Instagram: <Instagram className="w-8 h-8 text-white" />,
    Globe: <ExternalLink className="w-8 h-8 text-white" />,
    Youtube: <Youtube className="w-8 h-8 text-white" />,
    Twitter: <Twitter className="w-8 h-8 text-white" />,
    Linkedin: <Linkedin className="w-8 h-8 text-white" />,
    Github: <Github className="w-8 h-8 text-white" />,
    External: <ExternalLink className="w-8 h-8 text-white" />,
  };
  return icons[iconName as keyof typeof icons] || <ExternalLink className="w-8 h-8 text-white" />;
};

const getIconBackgroundColor = (iconName: string) => {
  const colors = {
    Music: "bg-green-500", // Spotify green
    Instagram: "bg-gradient-to-br from-purple-500 to-pink-500", // Instagram gradient
    Globe: "bg-blue-500", // Generic web blue
    Youtube: "bg-red-500", // YouTube red
    Twitter: "bg-blue-400", // Twitter blue
    Linkedin: "bg-blue-600", // LinkedIn blue
    Github: "bg-gray-800", // GitHub dark
    External: "bg-blue-500", // External link blue
  };
  return colors[iconName as keyof typeof colors] || "bg-blue-500";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300 p-4">
      <div className="max-w-sm mx-auto space-y-6">
        
        {/* Profile Identity Section */}
        <Card className="rounded-3xl p-12 text-center shadow-lg border-0 relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${profile.profileImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-700/30"></div>
          <div className="relative z-10 py-8">
            <h1 className="text-white text-4xl font-bold mb-6 tracking-tight">
              {profile.name}
            </h1>
            <p className="text-white/90 text-xl leading-relaxed mb-6">
              {profile.bio}
            </p>
            
            {/* Profile Details */}
            <div className="flex flex-col items-center gap-4 mt-6">
              {/* Relationship Status */}
              <div className="flex items-center gap-3">
                {getRelationshipIcon(profile.relationshipStatus)}
                <span className="text-white/70 text-base capitalize">
                  {profile.relationshipStatus.replace('-', ' ')}
                </span>
              </div>
              
              {/* Job Title & Area */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-white/70" />
                  <span className="text-white/70 text-base capitalize">
                    {profile.jobTitle?.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-white/70" />
                  <span className="text-white/70 text-base capitalize">
                    {profile.area?.replace('-', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Connect With Me Section */}
        <Card className="bg-gradient-to-br from-green-600 to-teal-600 rounded-3xl p-10 shadow-lg border-0 relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url(${greenGradientGif})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
          <div className="relative z-10">
            <h2 className="text-white text-3xl font-bold mb-4 tracking-tight">
              Connect with me
            </h2>
            <p className="text-white/90 text-lg mb-10">
              Select an option below:
            </p>
            
            <div className="grid grid-cols-3 gap-8 justify-items-center">
              {profile.links.map((link, index) => {
                const detectedIcon = getIconFromUrl(link.url);
                return (
                  <div 
                    key={index}
                    onClick={() => handleExternalLinkClick(link.url)}
                    className="cursor-pointer group"
                  >
                    <div className={`w-20 h-20 ${getIconBackgroundColor(detectedIcon.name)} rounded-2xl flex items-center justify-center hover:scale-105 transition-all duration-200 shadow-lg mb-3`}>
                      {detectedIcon.icon}
                    </div>
                    <p className="text-white/90 text-sm font-medium text-center max-w-20 truncate">
                      {link.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Question About Me Section */}
        <Card className="bg-gradient-to-br from-orange-600 to-amber-600 rounded-3xl p-10 shadow-lg border-0">
          <h2 className="text-white text-3xl font-bold mb-8 tracking-tight">
            Question About me
          </h2>
          
          {isLoadingQuestion ? (
            <div className="text-white/90 text-center text-lg">Loading question...</div>
          ) : currentQuestion ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <p className="text-white/90 text-xl mb-8 leading-relaxed">
                {currentQuestion.text}
              </p>
              
              {/* Custom Dropdown */}
              <div className="relative">
                <Select value={selectedAnswer} onValueChange={setSelectedAnswer}>
                  <SelectTrigger className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full py-6 px-8 text-white text-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 h-auto">
                    <SelectValue placeholder="– Select option –" className="text-white/90 text-lg" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentQuestion.options.map((option, index) => (
                      <SelectItem key={index} value={option.toLowerCase()}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Email Input */}
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full py-6 px-8 text-white text-lg placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 h-auto"
              />
              
              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitAnswerMutation.isPending}
                className="w-full bg-black/80 hover:bg-black text-white font-semibold py-6 px-8 rounded-full transition-all duration-200 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-white/50 h-auto text-lg"
              >
                {submitAnswerMutation.isPending ? "Submitting..." : "Submit"}
              </Button>
            </form>
          ) : (
            <div className="text-white/90 text-center text-lg">No question available</div>
          )}
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