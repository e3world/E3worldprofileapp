import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import startingGif from "@assets/gif (2) copy 3_1752222699265.gif";

export default function Landing() {
  const [, setLocation] = useLocation();

  const handleCreateProfile = () => {
    setLocation("/onboarding/phase1");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Full-page GIF Background */}
      <img 
        src={startingGif}
        alt="Landing background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Floating CTA Button */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Button 
            onClick={handleCreateProfile}
            className="bg-white/90 hover:bg-white text-black font-semibold py-4 px-8 rounded-full text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border-2 border-white/20"
          >
            Create Your Profile
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}