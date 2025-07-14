import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft, Plus, X, Music, Instagram, Globe, Youtube, Twitter, Linkedin, Github, TiktokIcon, Mail } from "lucide-react";
import { SiSnapchat, SiPinterest, SiTiktok } from "react-icons/si";

interface LinkData {
  name: string;
  url: string;
  icon: string;
}

const iconOptions = [
  { value: "Music", label: "Music/Spotify", icon: <Music className="w-4 h-4" /> },
  { value: "Instagram", label: "Instagram", icon: <Instagram className="w-4 h-4" /> },
  { value: "Globe", label: "Website", icon: <Globe className="w-4 h-4" /> },
  { value: "Youtube", label: "YouTube", icon: <Youtube className="w-4 h-4" /> },
  { value: "Twitter", label: "Twitter/X", icon: <Twitter className="w-4 h-4" /> },
  { value: "Linkedin", label: "LinkedIn", icon: <Linkedin className="w-4 h-4" /> },
  { value: "Github", label: "GitHub", icon: <Github className="w-4 h-4" /> },
  { value: "Snapchat", label: "Snapchat", icon: <SiSnapchat className="w-4 h-4" /> },
  { value: "Pinterest", label: "Pinterest", icon: <SiPinterest className="w-4 h-4" /> },
  { value: "TikTok", label: "TikTok", icon: <SiTiktok className="w-4 h-4" /> },
  { value: "Mail", label: "Email", icon: <Mail className="w-4 h-4" /> },
];

export default function OnboardingPhase2() {
  const [links, setLinks] = useState<LinkData[]>([
    { name: "", url: "", icon: "" }
  ]);
  const { toast } = useToast();

  useEffect(() => {
    // Check if phase 1 data exists
    const phase1Data = localStorage.getItem("onboarding_phase1");
    if (!phase1Data) {
      toast({
        title: "Missing Data",
        description: "Please complete Phase 1 first.",
        variant: "destructive",
      });
      window.location.href = "/onboarding/phase1";
    }
  }, [toast]);

  const addLink = () => {
    if (links.length < 5) {
      setLinks([...links, { name: "", url: "", icon: "" }]);
    }
  };

  const removeLink = (index: number) => {
    if (links.length > 1) {
      setLinks(links.filter((_, i) => i !== index));
    }
  };

  const updateLink = (index: number, field: keyof LinkData, value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index][field] = value;
    setLinks(updatedLinks);
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatLinkForIcon = (url: string, icon: string) => {
    if (icon === "Mail") {
      // For email, ensure it has mailto: prefix
      if (!url.startsWith("mailto:")) {
        return `mailto:${url}`;
      }
      return url;
    }
    return url;
  };

  const handleContinue = () => {
    // Filter out empty links
    const validLinks = links.filter(link => link.name && link.url && link.icon);
    
    if (validLinks.length === 0) {
      toast({
        title: "No Links Added",
        description: "Please add at least one link to continue.",
        variant: "destructive",
      });
      return;
    }

    // Validate URLs and emails
    const invalidLinks = validLinks.filter(link => {
      if (link.icon === "Mail") {
        // For email links, validate email format (with or without mailto:)
        const emailToValidate = link.url.startsWith("mailto:") ? link.url.substring(7) : link.url;
        return !validateEmail(emailToValidate);
      } else {
        // For other links, validate URL format
        return !validateUrl(link.url);
      }
    });
    
    if (invalidLinks.length > 0) {
      toast({
        title: "Invalid Links",
        description: "Please enter valid URLs or email addresses for all links.",
        variant: "destructive",
      });
      return;
    }

    // Format links for proper handling (e.g., add mailto: prefix for emails)
    const formattedLinks = validLinks.map(link => ({
      ...link,
      url: formatLinkForIcon(link.url, link.icon)
    }));
    
    // Store links data in localStorage
    localStorage.setItem("onboarding_phase2", JSON.stringify(formattedLinks));
    
    // Navigate to phase 3
    window.location.href = "/onboarding/phase3";
  };

  const goBack = () => {
    window.location.href = "/onboarding/phase1";
  };

  return (
    <div className="min-h-screen bg-[#e7e6e3] p-4 md:p-8">
      <div className="max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
        {/* Header with divider */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center mb-6 md:mb-8">
            <div className="flex-1 h-px bg-[#292929]"></div>
            <Globe className="w-8 h-8 md:w-12 md:h-12 mx-4 text-[#292929]" />
            <div className="flex-1 h-px bg-[#292929]"></div>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#292929] mb-4 tracking-tight">
            SHARE YOUR <span className="italic font-medium">LINKS</span>
          </h1>
          <p className="text-[#292929]/70 text-sm md:text-base font-medium mb-6">Step 2 of 3</p>
          <div className="h-px bg-[#292929]/30 w-full"></div>
        </div>

        <Card className="p-6 md:p-8 shadow-[0_6px_16px_rgba(0,0,0,0.15)] border border-[#292929]/10 bg-[#292929]">
          <div className="space-y-6 md:space-y-8">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#e7e6e3] tracking-tight">
                CONNECT YOUR <span className="italic font-medium">DIGITAL</span> WORLD
              </h2>
              <p className="text-[#e7e6e3]/70 text-sm md:text-base font-medium mt-2">
                Add up to 4 links that represent you
              </p>
            </div>
            
            {links.map((link, index) => (
              <div key={index} className="space-y-3 p-4 md:p-6 bg-[#e7e6e3]/10 rounded-lg border border-[#e7e6e3]/10 shadow-[0_6px_16px_rgba(0,0,0,0.15)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-1 h-px bg-[#e7e6e3]/20"></div>
                    <span className="px-2 text-sm font-bold text-[#e7e6e3] tracking-tight">
                      LINK <span className="italic font-medium">{index + 1}</span>
                    </span>
                    <div className="flex-1 h-px bg-[#e7e6e3]/20"></div>
                  </div>
                  {links.length > 1 && (
                    <Button
                      onClick={() => removeLink(index)}
                      variant="ghost"
                      size="sm"
                      className="text-[#e7e6e3]/60 hover:text-[#e7e6e3] hover:bg-[#e7e6e3]/10 rounded-full p-1 h-6 w-6"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Link name (e.g., My Playlist)"
                    value={link.name}
                    onChange={(e) => updateLink(index, "name", e.target.value)}
                    className="w-full border-[#e7e6e3]/20 focus:border-[#e7e6e3] bg-white text-sm placeholder:text-[#292929]/50 text-[#292929] shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)]"
                  />
                  
                  <Input
                    type="text"
                    placeholder="https://example.com or email@example.com"
                    value={link.url}
                    onChange={(e) => updateLink(index, "url", e.target.value)}
                    className="w-full border-[#e7e6e3]/20 focus:border-[#e7e6e3] bg-white text-sm placeholder:text-[#292929]/50 text-[#292929] shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)]"
                  />
                  
                  <Select value={link.icon} onValueChange={(value) => updateLink(index, "icon", value)}>
                    <SelectTrigger className="w-full border-[#e7e6e3]/20 focus:border-[#e7e6e3] bg-white text-sm placeholder:text-[#292929]/50 shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)]">
                      <SelectValue placeholder="Choose icon" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#292929]/20">
                      {iconOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            {option.icon}
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
            
            {links.length < 4 && (
              <Button
                onClick={addLink}
                variant="outline"
                className="w-full border-[#292929]/20 text-[#292929] hover:bg-[#e7e6e3]/50 border-dashed py-3"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Link
              </Button>
            )}
          </div>

          <div className="flex justify-between items-center mt-8 gap-3">
            <Button 
              onClick={goBack}
              className="bg-[#292929] hover:bg-[#292929]/80 text-[#e7e6e3] flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <Button 
              onClick={handleContinue}
              variant="outline"
              className="flex items-center gap-2 border-[#292929]/20 text-[#292929] hover:bg-[#e7e6e3]/50 flex-1"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}