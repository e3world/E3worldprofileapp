import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import startingGif from "@assets/gif (2) copy 3_1752222699265.gif";
import e3Logo from "@assets/8_1752223811568.png";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [isButtonActive, setIsButtonActive] = useState(false);

  const handleCreateProfile = () => {
    setLocation("/onboarding/phase1");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsButtonActive(true);
    }, 9000); // 9 seconds delay

    return () => clearTimeout(timer);
  }, []);

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
      
      {/* Navigation Bar */}
      <div className="relative z-20 w-full bg-[#292929] py-4 px-6">
        <div className="flex justify-center items-center">
          <img 
            src={e3Logo}
            alt="E3 Logo"
            className="w-24 h-24 object-contain"
          />
        </div>
      </div>
      
      {/* Bottom CTA Button */}
      <div className="relative z-10 flex items-end justify-center min-h-screen pb-8">
        <div className="text-center">
          <Button 
            onClick={isButtonActive ? handleCreateProfile : undefined}
            disabled={!isButtonActive}
            className={`font-semibold py-4 px-8 rounded-full text-lg shadow-2xl transition-all duration-500 transform backdrop-blur-sm border-2 ${
              isButtonActive 
                ? "bg-white/90 hover:bg-white text-black hover:shadow-3xl hover:scale-105 border-white/20 cursor-pointer" 
                : "bg-gray-500/50 text-gray-300 border-gray-500/30 cursor-not-allowed opacity-50"
            }`}
          >
            Activate
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}