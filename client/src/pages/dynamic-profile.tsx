import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Music, Instagram, Globe, Youtube, Twitter, Linkedin, Github, Heart, MapPin, Briefcase, Mail } from "lucide-react";
import { SiSnapchat, SiPinterest, SiTiktok } from "react-icons/si";
import type { Question, InsertSubmission, Profile } from "@shared/schema";

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
    Snapchat: <SiSnapchat className="w-12 h-12 text-gray-700" />,
    Pinterest: <SiPinterest className="w-12 h-12 text-gray-700" />,
    TikTok: <SiTiktok className="w-12 h-12 text-gray-700" />,
    Mail: <Mail className="w-12 h-12 text-gray-700" />,
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch profile data by serial code
  const { data: profile, isLoading: isLoadingProfile } = useQuery<Profile>({
    queryKey: [`/api/profiles/serial/${profileId}`],
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
        title: "Answer submitted!",
        description: "Thank you for your response.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/submissions"] });
      setSelectedAnswer("");
      setEmail("");
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
      profileId: profile.id,
    });
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
    <div className="min-h-screen relative">
      {/* Profile Image as Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${profile.profileImage})`,
          filter: 'blur(10px)',
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="relative z-10 w-full px-6 py-8">
        {/* Bio Section at Top */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Hello my name is {profile.name}
          </h1>
          <p className="text-white/90 text-lg leading-relaxed">
            {profile.bio}
          </p>
        </div>
        
        {/* Personal Details - Outline Style */}
        {!profile.hidePersonalInfo && (
          <div className="border-2 border-white/50 rounded-2xl p-6 mb-6 max-w-md mx-auto bg-transparent backdrop-blur-sm">
            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center">
                {getRelationshipIcon(profile.relationshipStatus)}
                <span className="ml-2">
                  {profile.relationshipStatus?.charAt(0).toUpperCase() + profile.relationshipStatus?.slice(1).replace('-', ' ')}
                </span>
              </div>
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 text-white/70" />
                <span className="ml-2">
                  {profile.jobTitle?.charAt(0).toUpperCase() + profile.jobTitle?.slice(1).replace('-', ' ')}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-white/70" />
                <span className="ml-2">
                  {profile.area?.charAt(0).toUpperCase() + profile.area?.slice(1).replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Social Icons - Stacked Vertically */}
        {profile.links && profile.links.length > 0 && (
          <div className="mb-8 max-w-md mx-auto space-y-4">
            {profile.links.map((link, index) => (
              <button
                key={index}
                onClick={() => window.open(link.url, '_blank')}
                className="w-full flex items-center justify-center p-4 bg-white/90 backdrop-blur-sm rounded-2xl hover:bg-white/100 transition-colors"
              >
                <div className="mr-3">
                  {getIconComponent(link.icon)}
                </div>
                <span className="text-gray-700 font-medium text-sm truncate">
                  {link.name}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Question Section - Maximized Spacing */}
        <div className="max-w-md mx-auto">
          {isLoadingQuestion ? (
            <div className="text-center text-white/60">Loading question...</div>
          ) : currentQuestion ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedAnswer(option)}
                    className={`p-6 rounded-2xl transition-all duration-200 ${
                      selectedAnswer === option
                        ? "bg-purple-600 text-white"
                        : "bg-white/90 text-gray-700 hover:bg-white/100"
                    }`}
                  >
                    <span className="text-sm font-medium">{option}</span>
                  </button>
                ))}
              </div>

              {/* Email Input */}
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Describe this user in one word"
                  value={selectedAnswer}
                  readOnly
                  className="w-full bg-transparent border-2 border-white/50 rounded-2xl text-white placeholder:text-white/60 focus:border-white p-4"
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-2 border-white/50 rounded-2xl text-white placeholder:text-white/60 focus:border-white p-4"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!selectedAnswer || !email || submitAnswerMutation.isPending}
                className="w-full bg-white/90 hover:bg-white/100 text-gray-700 font-medium py-4 rounded-2xl disabled:opacity-50"
              >
                {submitAnswerMutation.isPending ? "Submitting..." : "Submit"}
              </Button>
            </form>
          ) : (
            <div className="text-center text-white/60">No question available at this time.</div>
          )}
        </div>
      </div>
    </div>
  );
}