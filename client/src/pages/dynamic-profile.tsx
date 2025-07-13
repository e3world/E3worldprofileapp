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
import profileImagePath from "@assets/Painitng _1752445139207.jpg";
import newProfileImage from "@assets/IMG_5298_1752445196109.jpeg";

interface DynamicProfileProps {
  profileId: string;
}

const getIconComponent = (iconName: string) => {
  const icons = {
    Music: <Music className="w-16 h-16 text-white" />,
    Instagram: <Instagram className="w-16 h-16 text-white" />,
    Globe: <Globe className="w-16 h-16 text-gray-800" />,
    Youtube: <Youtube className="w-16 h-16 text-white" />,
    Twitter: <Twitter className="w-16 h-16 text-white" />,
    Linkedin: <Linkedin className="w-16 h-16 text-white" />,
    Github: <Github className="w-16 h-16 text-white" />,
    Snapchat: <SiSnapchat className="w-16 h-16 text-gray-800" />,
    Pinterest: <SiPinterest className="w-16 h-16 text-white" />,
    TikTok: <SiTiktok className="w-16 h-16 text-white" />,
    Mail: <Mail className="w-16 h-16 text-white" />,
  };
  return icons[iconName as keyof typeof icons] || <Globe className="w-16 h-16 text-gray-800" />;
};

const getIconBackgroundColor = (iconName: string) => {
  const backgrounds = {
    Music: 'bg-green-500',
    Instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
    Globe: 'bg-[#fefefa]',
    Youtube: 'bg-red-500',
    Twitter: 'bg-blue-400',
    Linkedin: 'bg-blue-600',
    Github: 'bg-gray-800',
    Snapchat: 'bg-yellow-400',
    Pinterest: 'bg-red-600',
    TikTok: 'bg-gradient-to-r from-gray-900 to-gray-700',
    Mail: 'bg-gray-600',
  };
  return backgrounds[iconName as keyof typeof backgrounds] || 'bg-[#fefefa]';
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

// Typewriter Animation Component
const TypewriterText = ({ text, delay = 750 }: { text: string, delay?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
        }
      }, 50);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <span>
      {displayedText}
      {isTyping && <span className="animate-pulse">|</span>}
    </span>
  );
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
          backgroundImage: `url(${profileImagePath})`,
          filter: 'blur(10px)',
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="relative z-10 w-full px-6 py-8">
        {/* Profile Image and Name at Top */}
        <div className="text-center mb-8">
          {/* Circular Profile Image */}
          <div className="mb-4">
            <img 
              src={profile.profileImage || newProfileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto border-4 border-white/50 object-cover shadow-[0_6px_16px_rgba(0,0,0,0.15)]"
            />
          </div>
          
          {/* Name Only - Reduced Size */}
          <h1 className="text-lg text-white mb-6 tracking-wide font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>
            {profile.name.toUpperCase()}
          </h1>
          
          <div className="mt-6 mb-8 max-w-md mx-auto">
            <div className="bg-white/90 border-2 border-white/50 rounded-2xl p-6 shadow-[0_6px_16px_rgba(0,0,0,0.15)] backdrop-blur-sm min-h-[120px] flex items-center justify-center">
              <p className="text-gray-700 text-lg text-center leading-relaxed">
                <TypewriterText text={profile.bio} delay={750} />
              </p>
            </div>
          </div>
        </div>
        
        {/* Personal Details - Outline Style */}
        {!profile.hidePersonalInfo && (
          <div className="border-2 border-white/50 rounded-2xl p-6 mb-6 max-w-md mx-auto bg-transparent backdrop-blur-sm shadow-[0_6px_16px_rgba(0,0,0,0.15)]">
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
        
        {/* Social Icons - Squared with Descriptions */}
        {profile.links && profile.links.length > 0 && (
          <div className="mb-8 max-w-md mx-auto grid grid-cols-2 gap-4">
            {profile.links.map((link, index) => (
              <button
                key={index}
                onClick={() => window.open(link.url, '_blank')}
                className="flex flex-col items-center group"
              >
                <div 
                  className={`w-32 h-32 ${getIconBackgroundColor(link.icon)} rounded-lg flex items-center justify-center mb-2 transition-all duration-200 hover:scale-105 shadow-[0_6px_16px_rgba(0,0,0,0.15)] border border-white/30 icon-shimmy-hover icon-shimmy-active`}
                >
                  {getIconComponent(link.icon)}
                </div>
                <span className="text-white text-sm font-medium text-center truncate max-w-full">
                  {link.name}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Question Section - Maximized Spacing */}
        <div className="max-w-md mx-auto">
          <div className="border-2 border-white/50 rounded-2xl p-6 bg-black/20 backdrop-blur-sm shadow-[0_6px_16px_rgba(0,0,0,0.15)]">
            {isLoadingQuestion ? (
              <div className="text-center text-white/60">Loading question...</div>
            ) : currentQuestion ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question - Black Background with Question Mark */}
                <div className="border-2 border-white/50 rounded-2xl p-4 bg-black backdrop-blur-sm shadow-[0_6px_16px_rgba(0,0,0,0.15)]">
                  <p className="text-white text-lg text-center">
                    <TypewriterText text={`${currentQuestion.text}?`} delay={500} />
                  </p>
                </div>

                {/* Answer Options - Matching Icon Width */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedAnswer(option)}
                      className={`w-32 h-16 mx-auto rounded-2xl transition-all duration-200 shadow-[0_6px_16px_rgba(0,0,0,0.15)] ${
                        selectedAnswer === option
                          ? "bg-purple-600 text-white"
                          : "bg-white/90 text-gray-700 hover:bg-white/100"
                      }`}
                    >
                      <span className="text-sm font-medium">{option}</span>
                    </button>
                  ))}
                </div>

                {/* Email Input - Matching Question Width and Height */}
                <div className="border-2 border-white/50 rounded-2xl p-4 bg-transparent backdrop-blur-sm shadow-[0_6px_16px_rgba(0,0,0,0.15)]">
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-none text-white placeholder:text-white/60 focus:ring-0 focus:outline-none p-0"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!selectedAnswer || !email || submitAnswerMutation.isPending}
                  className="w-full bg-white/90 hover:bg-white/100 text-gray-700 font-medium py-4 rounded-2xl disabled:opacity-50 shadow-[0_6px_16px_rgba(0,0,0,0.15)]"
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
    </div>
  );
}