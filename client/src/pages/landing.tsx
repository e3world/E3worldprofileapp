import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Key } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isValidSerialCode, getDynamicLink } from "@/lib/serialCodes";
import startingGif from "@assets/gif (2) copy 3_1752222699265.gif";
import e3Logo from "@assets/8_1752223811568.png";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [serialCode, setSerialCode] = useState("");
  const { toast } = useToast();

  const handleCreateProfile = () => {
    if (!serialCode.trim()) {
      toast({
        title: "Serial Code Required",
        description: "Please enter your NFT serial code to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidSerialCode(serialCode)) {
      toast({
        title: "Invalid Serial Code", 
        description: "The serial code you entered is not authorized. Please check your NFT tag and try again.",
        variant: "destructive",
      });
      return;
    }

    // Store serial code for profile creation
    localStorage.setItem("nft_serial_code", serialCode.trim().toUpperCase());
    localStorage.setItem("nft_dynamic_link", getDynamicLink(serialCode));
    
    toast({
      title: "Access Granted",
      description: `Serial code ${serialCode.toUpperCase()} verified successfully!`,
    });
    
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
      <div className="relative z-20 w-full bg-[#000000] py-3 px-6">
        <div className="flex justify-center items-center">
          <img 
            src={e3Logo}
            alt="E3 Logo"
            className="w-24 h-24 object-contain"
          />
        </div>
      </div>
      
      {/* Bottom CTA Section */}
      <div className="relative z-10 flex items-end justify-center min-h-screen pb-8">
        <div className="text-center space-y-6 max-w-sm mx-auto px-4">
          {/* Serial Code Input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Key className="w-5 h-5" />
            </div>
            <Input
              type="text"
              placeholder="Enter your E number"
              value={serialCode}
              onChange={(e) => setSerialCode(e.target.value.toUpperCase())}
              disabled={!isButtonActive}
              className={`pl-12 pr-4 py-4 rounded-full text-lg shadow-2xl transition-all duration-500 transform backdrop-blur-sm border-2 text-center font-medium ${
                isButtonActive
                  ? "bg-white/90 text-black border-white/20 placeholder:text-gray-500 focus:bg-white focus:border-white/40 focus:ring-2 focus:ring-white/30"
                  : "bg-gray-500/50 text-gray-300 border-gray-500/30 placeholder:text-gray-400 cursor-not-allowed opacity-50"
              }`}
              maxLength={10}
            />
          </div>

          {/* Activate Button */}
          <Button 
            onClick={isButtonActive ? handleCreateProfile : undefined}
            disabled={!isButtonActive}
            className={`font-semibold py-4 px-8 rounded-full text-lg shadow-2xl transition-all duration-500 transform backdrop-blur-sm border-2 w-full ${
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