import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Music, Instagram, ExternalLink } from "lucide-react";
import type { Question, InsertSubmission } from "@shared/schema";
import greenGradientGif from "@assets/download (3)_1752232023115.gif";
import brownGradientGif from "@assets/download (4)_1752232152967.gif";

interface ProfileData {
  name: string;
  bio: string;
  profileImage: string;
}

interface ExternalLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

const profileData: ProfileData = {
  name: "Chris Alli",
  bio: "Full time model and content creator",
  profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400"
};

const externalLinks: ExternalLink[] = [
  {
    name: "My Playlist",
    url: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
    icon: <Music className="w-8 h-8 text-white" />
  },
  {
    name: "@chrisalli.a",
    url: "https://instagram.com/chrisalli.a",
    icon: <Instagram className="w-8 h-8 text-white" />
  },
  {
    name: "Chris model Book",
    url: "https://chrisalli.com/portfolio",
    icon: <ExternalLink className="w-8 h-8 text-white" />
  }
];

const getIconBackgroundColor = (url: string) => {
  if (url.includes('spotify.com')) return "bg-green-500";
  if (url.includes('instagram.com')) return "bg-gradient-to-br from-purple-500 to-pink-500";
  if (url.includes('youtube.com')) return "bg-red-500";
  if (url.includes('twitter.com')) return "bg-blue-400";
  if (url.includes('linkedin.com')) return "bg-blue-600";
  if (url.includes('github.com')) return "bg-gray-800";
  return "bg-blue-500";
};

export default function Profile() {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300 p-4">
      <div className="max-w-sm mx-auto space-y-6">
        
        {/* Chris Alli Identity Section */}
        <Card className="rounded-3xl p-12 text-center shadow-lg border-0 relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${profileData.profileImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-700/30"></div>
          <div className="relative z-10 py-8">
            <h1 className="text-white text-4xl font-bold mb-6 tracking-tight">
              {profileData.name}
            </h1>
            <p className="text-white/90 text-xl leading-relaxed">
              {profileData.bio}
            </p>
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
            {externalLinks.map((link, index) => (
              <div 
                key={index}
                onClick={() => handleExternalLinkClick(link.url)}
                className="cursor-pointer group"
              >
                <div className={`w-20 h-20 ${getIconBackgroundColor(link.url)} rounded-2xl flex items-center justify-center hover:scale-105 transition-all duration-200 shadow-lg mb-3`}>
                  {link.icon}
                </div>
                <p className="text-white/90 text-sm font-medium text-center max-w-20 truncate">
                  {link.name}
                </p>
              </div>
            ))}
          </div>
          </div>
        </Card>

        {/* Question About Me Section */}
        <Card className="bg-gradient-to-br from-orange-600 to-amber-600 rounded-3xl p-10 shadow-lg border-0 relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url(${brownGradientGif})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
          <div className="relative z-10">
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
          </div>
        </Card>

        {/* Create Your Own Profile CTA */}
        <Card className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-10 text-center shadow-lg border-0">
          <h2 className="text-white text-3xl font-bold mb-6 tracking-tight">
            Want Your Own Profile?
          </h2>
          <p className="text-white/90 text-lg mb-8 leading-relaxed">
            Create a personalized profile page with your own questions and links in just 3 simple steps.
          </p>
          <Button
            onClick={() => window.location.href = "/onboarding/phase1"}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-full transition-all duration-200 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-white/50 h-auto"
          >
            Start Creating Your Profile
          </Button>
        </Card>
      </div>
    </div>
  );
}
