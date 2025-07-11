import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft, Plus, X, Music, Instagram, Globe, Youtube, Twitter, Linkedin, Github, TiktokIcon } from "lucide-react";

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

    // Validate all URLs
    const invalidUrls = validLinks.filter(link => !validateUrl(link.url));
    if (invalidUrls.length > 0) {
      toast({
        title: "Invalid URLs",
        description: "Please check your URLs and make sure they're valid.",
        variant: "destructive",
      });
      return;
    }

    // Store links data in localStorage
    localStorage.setItem("onboarding_phase2", JSON.stringify(validLinks));
    
    // Navigate to phase 3
    window.location.href = "/onboarding/phase3";
  };

  const goBack = () => {
    window.location.href = "/onboarding/phase1";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300 p-4">
      <div className="max-w-sm mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Profile</h1>
          <p className="text-lg">Phase 2 of 3: Links Attachment</p>
        </div>

        {/* Links Card */}
        <Card className="bg-gradient-to-br from-green-600 to-teal-600 rounded-3xl p-8 shadow-lg border-0">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-white" />
            <h2 className="text-white text-2xl font-bold tracking-tight">
              Connect Your Links
            </h2>
          </div>
          
          <p className="text-white/90 text-base mb-6">
            Add up to 5 links that represent you best:
          </p>
          
          <div className="space-y-4">
            {links.map((link, index) => (
              <div key={index} className="space-y-3 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="flex items-center justify-between">
                  <span className="text-white/90 text-sm font-medium">
                    Link {index + 1}
                  </span>
                  {links.length > 1 && (
                    <Button
                      onClick={() => removeLink(index)}
                      variant="ghost"
                      size="sm"
                      className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                {/* Link Name */}
                <Input
                  type="text"
                  placeholder="Link name (e.g., My Playlist)"
                  value={link.name}
                  onChange={(e) => updateLink(index, "name", e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full py-3 px-4 text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 h-auto text-sm"
                />
                
                {/* Link URL */}
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={link.url}
                  onChange={(e) => updateLink(index, "url", e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full py-3 px-4 text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 h-auto text-sm"
                />
                
                {/* Icon Selection */}
                <Select value={link.icon} onValueChange={(value) => updateLink(index, "icon", value)}>
                  <SelectTrigger className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full py-3 px-4 text-white focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 h-auto text-sm">
                    <SelectValue placeholder="Choose icon" />
                  </SelectTrigger>
                  <SelectContent>
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
            ))}
            
            {/* Add Link Button */}
            {links.length < 5 && (
              <Button
                onClick={addLink}
                variant="ghost"
                className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full py-4 px-6 text-white hover:bg-white/20 transition-all duration-200 h-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Link
              </Button>
            )}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            onClick={goBack}
            variant="ghost" 
            className="text-white hover:bg-white/10 rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Button 
            onClick={handleContinue}
            className="bg-black/80 hover:bg-black text-white font-semibold py-3 px-8 rounded-full transition-all duration-200 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-white/50 h-auto"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}