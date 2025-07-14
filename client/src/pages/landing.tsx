import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import animatedGif from "@assets/gif (2) copy 3_1752222699265.gif";
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
    <div className="min-h-screen bg-black">
      {/* Navigation Bar */}
      <div className="w-full bg-black py-3 md:py-4 px-6 md:px-8 border-b border-gray-800">
        <div className="flex justify-center items-center">
          <img 
            src={e3Logo}
            alt="E3 Logo"
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"
          />
        </div>
      </div>
      
      {/* Main Content Container */}
      <div className="flex flex-col justify-center items-center px-6 md:px-8 py-12 md:py-16 min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-96px)]">
        <div className="text-center space-y-8 md:space-y-12 max-w-md md:max-w-lg lg:max-w-xl mx-auto">
        
        {/* GIF Container - Square Format */}
        <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 mx-auto mb-16 md:mb-20">
          <img 
            src={animatedGif}
            alt="Animation"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* Activate Button */}
        <div className="pt-8 md:pt-12">
          <Button 
            onClick={isButtonActive ? handleCreateProfile : undefined}
            disabled={!isButtonActive}
            className={`font-medium py-4 md:py-6 px-12 md:px-16 rounded-full text-lg md:text-xl transition-all duration-500 transform w-72 md:w-80 lg:w-96 ${
              isButtonActive 
                ? "bg-[#FEFEFA] hover:bg-[#FEFEFA]/90 text-[#292929] border border-[#FEFEFA] hover:border-[#FEFEFA]/90 cursor-pointer hover:scale-105" 
                : "bg-gray-800/50 text-gray-500 border border-gray-700/50 cursor-not-allowed opacity-50"
            }`}
          >
            Activate
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}