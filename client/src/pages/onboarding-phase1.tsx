import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Upload, User } from "lucide-react";

interface Phase1Data {
  name: string;
  bio: string;
  profileImage: string;
  relationshipStatus: string;
  email: string;
  phone: string;
}

export default function OnboardingPhase1() {
  const [formData, setFormData] = useState<Phase1Data>({
    name: "",
    bio: "",
    profileImage: "",
    relationshipStatus: "",
    email: "",
    phone: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const { toast } = useToast();

  const handleInputChange = (field: keyof Phase1Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, profileImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    if (!formData.name || !formData.bio || !formData.email || !formData.relationshipStatus) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Store form data in localStorage for next phase
    localStorage.setItem("onboarding_phase1", JSON.stringify(formData));
    
    // Navigate to phase 2
    window.location.href = "/onboarding/phase2";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300 p-4">
      <div className="max-w-sm mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Profile</h1>
          <p className="text-lg">Phase 1 of 3: Personal Details</p>
        </div>

        {/* Personal Details Card */}
        <Card className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 shadow-lg border-0">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-white" />
            <h2 className="text-white text-2xl font-bold tracking-tight">
              Personal Details
            </h2>
          </div>
          
          <div className="space-y-6">
            {/* Profile Image Upload */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/20 shadow-xl bg-white/10 flex items-center justify-center">
                {imagePreview ? (
                  <img 
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="w-8 h-8 text-white/60" />
                )}
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full text-white hover:bg-white/20 transition-all duration-200"
                >
                  Upload Photo
                </Button>
              </label>
            </div>

            {/* Name Input */}
            <div>
              <label className="text-white/90 text-sm font-medium mb-2 block">
                Full Name *
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full py-4 px-6 text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 h-auto"
              />
            </div>

            {/* Bio Input */}
            <div>
              <label className="text-white/90 text-sm font-medium mb-2 block">
                Bio *
              </label>
              <Textarea
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl py-4 px-6 text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 min-h-[100px] resize-none"
              />
            </div>

            {/* Relationship Status */}
            <div>
              <label className="text-white/90 text-sm font-medium mb-2 block">
                Relationship Status *
              </label>
              <Select value={formData.relationshipStatus} onValueChange={(value) => handleInputChange("relationshipStatus", value)}>
                <SelectTrigger className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full py-4 px-6 text-white focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 h-auto">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="dating">Dating</SelectItem>
                  <SelectItem value="engaged">Engaged</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="complicated">It's Complicated</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email Input */}
            <div>
              <label className="text-white/90 text-sm font-medium mb-2 block">
                Email Address *
              </label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full py-4 px-6 text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 h-auto"
              />
            </div>

            {/* Phone Input */}
            <div>
              <label className="text-white/90 text-sm font-medium mb-2 block">
                Phone Number (Optional)
              </label>
              <Input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full py-4 px-6 text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 h-auto"
              />
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full">
              Back to Home
            </Button>
          </Link>
          
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