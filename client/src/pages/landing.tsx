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
      <div className="w-full bg-black py-3 px-6 border-b border-gray-800">
        <div className="flex justify-center items-center">
          <img 
            src={e3Logo}
            alt="E3 Logo"
            className="w-16 h-16 object-contain"
          />
        </div>
      </div>
      
      {/* Main Content Container */}
      <div className="flex flex-col justify-center items-center px-6 py-12 min-h-[calc(100vh-80px)]">
        <div className="text-center space-y-8 max-w-md mx-auto">
        
        {/* GIF Container - Square Format */}
        <div className="relative w-72 h-72 mx-auto mb-8">
          <img 
            src={animatedGif}
            alt="Animation"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* Headings */}
        <div className="space-y-6">
          {/* H1 - Main heading */}
          <h1 className="text-white text-4xl md:text-5xl font-sans leading-tight font-bold italic" style={{ fontFamily: 'Inter, sans-serif' }}>
            See Their Eyes Before You Speak
          </h1>
          
          {/* Subheadline */}
          <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-lg mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Notice the color, feel the presence, then speak.
          </p>
        </div>

        {/* Get Started Button */}
        <div className="pt-8">
          <Button 
            onClick={isButtonActive ? handleCreateProfile : undefined}
            disabled={!isButtonActive}
            className={`font-medium py-4 px-12 rounded-full text-lg transition-all duration-500 transform w-full max-w-sm ${
              isButtonActive 
                ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500 cursor-pointer hover:scale-105" 
                : "bg-gray-800/50 text-gray-500 border border-gray-700/50 cursor-not-allowed opacity-50"
            }`}
          >
            Get Started
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}