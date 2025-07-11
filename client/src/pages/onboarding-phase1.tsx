import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft, Upload, User } from "lucide-react";

interface Phase1Data {
  name: string;
  gender: string;
  eyeColour: string;
  email: string;
  phone: string;
  relationshipStatus: string;
  jobTitle: string;
  area: string;
  bio: string;
  profileImage: string;
}

export default function OnboardingPhase1() {
  const [formData, setFormData] = useState<Phase1Data>({
    name: "",
    gender: "",
    eyeColour: "",
    email: "",
    phone: "",
    relationshipStatus: "",
    jobTitle: "",
    area: "",
    bio: "",
    profileImage: "",
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
    if (!formData.name || !formData.gender || !formData.eyeColour || !formData.email || !formData.phone || !formData.relationshipStatus || !formData.jobTitle || !formData.area || !formData.bio) {
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
    <div className="min-h-screen bg-[#e7e6e3] p-4">
      <div className="max-w-lg mx-auto">
        {/* Header with divider */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="flex-1 h-px bg-[#292929]"></div>
            <User className="w-8 h-8 mx-4 text-[#292929]" />
            <div className="flex-1 h-px bg-[#292929]"></div>
          </div>
          <h1 className="text-3xl font-bold text-[#292929] mb-4 tracking-tight">
            TELL US <span className="italic font-medium">ABOUT</span> YOU
          </h1>
          <p className="text-[#292929]/70 text-sm font-medium">Step 1 of 3</p>
        </div>

        {/* Profile Image Upload */}
        <Card className="p-6 shadow-lg border border-[#292929]/10 bg-white mb-6">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-[#e7e6e3] flex items-center justify-center overflow-hidden border-2 border-[#292929]/20">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-[#292929]/40" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="profile-image"
              />
              <label
                htmlFor="profile-image"
                className="absolute -bottom-1 -right-1 bg-[#292929] text-[#e7e6e3] p-2 rounded-full cursor-pointer hover:bg-[#292929]/80 transition-colors"
              >
                <Upload className="w-3 h-3" />
              </label>
            </div>
            <p className="text-xs text-[#292929]/60 mb-2">Upload photo</p>
            <div className="text-xs text-[#292929]/50 space-y-1">
              <p>• Max file size: 5MB</p>
              <p>• Formats: JPG, PNG, GIF</p>
              <p>• Recommended: 400x400px</p>
            </div>
          </div>
        </Card>

        {/* Container 1: Personal Info */}
        <Card className="p-6 shadow-lg border border-[#292929]/10 bg-white mb-6">
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="flex-1 h-px bg-[#292929]/20"></div>
              <h3 className="px-3 text-lg font-bold text-[#292929] tracking-tight">
                YOUR <span className="italic font-medium">PERSONAL</span> INFO
              </h3>
              <div className="flex-1 h-px bg-[#292929]/20"></div>
            </div>
            
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-[#292929] mb-1">Full Name *</label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full border-[#292929]/20 focus:border-[#292929] bg-[#e7e6e3]/30"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-[#292929] mb-1">Gender *</label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger className="w-full border-[#292929]/20 focus:border-[#292929] bg-[#e7e6e3]/30">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#292929]/20">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Eye Colour */}
            <div>
              <label className="block text-sm font-medium text-[#292929] mb-1">Eye Colour *</label>
              <Select value={formData.eyeColour} onValueChange={(value) => handleInputChange("eyeColour", value)}>
                <SelectTrigger className="w-full border-[#292929]/20 focus:border-[#292929] bg-[#e7e6e3]/30">
                  <SelectValue placeholder="Select eye colour" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#292929]/20">
                  <SelectItem value="brown">Brown</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="hazel">Hazel</SelectItem>
                  <SelectItem value="grey">Grey</SelectItem>
                  <SelectItem value="amber">Amber</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Container 2: Contact Info */}
        <Card className="p-6 shadow-lg border border-[#292929]/10 bg-white mb-6">
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="flex-1 h-px bg-[#292929]/20"></div>
              <h3 className="px-3 text-lg font-bold text-[#292929] tracking-tight">
                YOUR <span className="italic font-medium">CONTACT</span> INFO
              </h3>
              <div className="flex-1 h-px bg-[#292929]/20"></div>
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#292929] mb-1">Email *</label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full border-[#292929]/20 focus:border-[#292929] bg-[#e7e6e3]/30"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[#292929] mb-1">Phone *</label>
              <Input
                type="tel"
                placeholder="+44 7xxx xxx xxx"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full border-[#292929]/20 focus:border-[#292929] bg-[#e7e6e3]/30"
              />
            </div>
          </div>
        </Card>

        {/* Container 3: Personal Details */}
        <Card className="p-6 shadow-lg border border-[#292929]/10 bg-white mb-6">
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="flex-1 h-px bg-[#292929]/20"></div>
              <h3 className="px-3 text-lg font-bold text-[#292929] tracking-tight">
                YOUR <span className="italic font-medium">PERSONAL</span> DETAILS
              </h3>
              <div className="flex-1 h-px bg-[#292929]/20"></div>
            </div>
            
            {/* Relationship Status */}
            <div>
              <label className="block text-sm font-medium text-[#292929] mb-1">Relationship Status *</label>
              <Select value={formData.relationshipStatus} onValueChange={(value) => handleInputChange("relationshipStatus", value)}>
                <SelectTrigger className="w-full border-[#292929]/20 focus:border-[#292929] bg-[#e7e6e3]/30">
                  <SelectValue placeholder="Select relationship status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#292929]/20">
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="dating">Dating</SelectItem>
                  <SelectItem value="engaged">Engaged</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="complicated">It's Complicated</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-[#292929] mb-1">Job Title *</label>
              <Input
                type="text"
                placeholder="e.g. Software Engineer, Teacher, Student"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                className="w-full border-[#292929]/20 focus:border-[#292929] bg-[#e7e6e3]/30"
              />
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-medium text-[#292929] mb-1">Area *</label>
              <Select value={formData.area} onValueChange={(value) => handleInputChange("area", value)}>
                <SelectTrigger className="w-full border-[#292929]/20 focus:border-[#292929] bg-[#e7e6e3]/30">
                  <SelectValue placeholder="Select your area" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#292929]/20">
                  <SelectItem value="east-london">East London</SelectItem>
                  <SelectItem value="north-london">North London</SelectItem>
                  <SelectItem value="west-london">West London</SelectItem>
                  <SelectItem value="south-london">South London</SelectItem>
                  <SelectItem value="central-london">Central London</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-[#292929] mb-1">Bio *</label>
              <Textarea
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                className="w-full h-20 resize-none border-[#292929]/20 focus:border-[#292929] bg-[#e7e6e3]/30"
              />
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <Card className="p-6 shadow-lg border border-[#292929]/10 bg-white">
          <div className="flex justify-between items-center gap-3">
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2 border-[#292929]/20 text-[#292929] hover:bg-[#e7e6e3]/50">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            
            <Button 
              onClick={handleContinue}
              className="bg-[#292929] hover:bg-[#292929]/80 text-[#e7e6e3] flex items-center gap-2 flex-1"
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