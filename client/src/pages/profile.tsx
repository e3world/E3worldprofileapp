import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Music, Instagram, Globe } from "lucide-react";
import type { Question, InsertSubmission } from "@shared/schema";
import greenGradientGif from "@assets/download (3)_1752231730311.gif";
import brownGradientGif from "@assets/download (4)_1752231730311.gif";

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
    icon: <Music className="w-6 h-6 text-white" />
  },
  {
    name: "@chrisalli.a",
    url: "https://instagram.com/chrisalli.a",
    icon: <Instagram className="w-6 h-6 text-white" />
  },
  {
    name: "Chris model Book",
    url: "https://chrisalli.com/portfolio",
    icon: <Globe className="w-6 h-6 text-white" />
  }
];

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
        <Card className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 text-center shadow-lg border-0">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
            <img 
              src={profileData.profileImage}
              alt={`${profileData.name} profile photo`}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-white text-3xl font-bold mb-3 tracking-tight">
            {profileData.name}
          </h1>
          <p className="text-white/90 text-lg leading-relaxed">
            {profileData.bio}
          </p>
        </Card>

        {/* Connect With Me Section */}
        <Card className="bg-gradient-to-br from-green-600 to-teal-600 rounded-3xl p-8 shadow-lg border-0 relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-70 blur-sm"
            style={{
              backgroundImage: `url(${greenGradientGif})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
          <div className="relative z-10 backdrop-blur-sm bg-black/20 rounded-2xl p-6 -m-6">
          <h2 className="text-white text-2xl font-bold mb-3 tracking-tight">
            Connect with me
          </h2>
          <p className="text-white/90 text-base mb-8">
            Select an option below:
          </p>
          
          <div className="grid grid-cols-3 gap-6 justify-items-center">
            {externalLinks.map((link, index) => (
              <div 
                key={index}
                onClick={() => handleExternalLinkClick(link.url)}
                className="cursor-pointer group"
              >
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all duration-200 hover:scale-105 transform mb-2">
                  {link.icon}
                </div>
                <p className="text-white/90 text-xs font-medium text-center max-w-16 truncate">
                  {link.name}
                </p>
              </div>
            ))}
          </div>
          </div>
        </Card>

        {/* Question About Me Section */}
        <Card className="bg-gradient-to-br from-orange-600 to-amber-600 rounded-3xl p-8 shadow-lg border-0">
          <h2 className="text-white text-2xl font-bold mb-6 tracking-tight">
            Question About me
          </h2>
          
          {isLoadingQuestion ? (
            <div className="text-white/90 text-center">Loading question...</div>
          ) : currentQuestion ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-white/90 text-lg mb-6">
                {currentQuestion.text}
              </p>
              
              {/* Custom Dropdown */}
              <div className="relative">
                <Select value={selectedAnswer} onValueChange={setSelectedAnswer}>
                  <SelectTrigger className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full py-4 px-6 text-white focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 h-auto">
                    <SelectValue placeholder="– Select option –" className="text-white/90" />
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
        </Card>

        {/* Create Your Own Profile CTA */}
        <Card className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 text-center shadow-lg border-0">
          <h2 className="text-white text-2xl font-bold mb-4 tracking-tight">
            Want Your Own Profile?
          </h2>
          <p className="text-white/90 text-base mb-6">
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
