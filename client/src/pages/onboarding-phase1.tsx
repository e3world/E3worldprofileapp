import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft, User, UserCheck, Users } from "lucide-react";

interface Phase1Data {
  name: string;
  gender: string;
  eyeColour: string;
  email: string;
  phone: string;
  relationshipStatus: string;
  jobTitle: string;
  area: string;
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
  });
  const { toast } = useToast();

  const handleInputChange = (field: keyof Phase1Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (!formData.name || !formData.gender || !formData.eyeColour || !formData.email || !formData.phone || !formData.relationshipStatus || !formData.jobTitle || !formData.area) {
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
          <p className="text-[#292929]/70 text-sm font-medium mb-6">Step 1 of 3</p>
          <div className="h-px bg-[#292929]/30 w-full"></div>
        </div>



        {/* Container 1: Personal Info */}
        <Card className="p-6 shadow-lg border border-[#292929]/10 bg-white mb-6">
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="flex-1 h-px bg-[#292929]/20"></div>
              <h3 className="px-3 text-lg font-bold text-[#292929] tracking-tight">
                <span className="italic font-medium">IDENTITY</span>
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
              <label className="block text-sm font-medium text-[#292929] mb-2">Gender *</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange("gender", "male")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                    formData.gender === "male" 
                      ? "border-[#292929] bg-[#292929] text-[#e7e6e3]" 
                      : "border-[#292929]/20 bg-[#e7e6e3]/30 hover:border-[#292929]/40"
                  }`}
                >
                  <User className="w-6 h-6" />
                  <span className="text-sm font-medium">Male</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("gender", "female")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                    formData.gender === "female" 
                      ? "border-[#292929] bg-[#292929] text-[#e7e6e3]" 
                      : "border-[#292929]/20 bg-[#e7e6e3]/30 hover:border-[#292929]/40"
                  }`}
                >
                  <UserCheck className="w-6 h-6" />
                  <span className="text-sm font-medium">Female</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("gender", "non-binary")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                    formData.gender === "non-binary" 
                      ? "border-[#292929] bg-[#292929] text-[#e7e6e3]" 
                      : "border-[#292929]/20 bg-[#e7e6e3]/30 hover:border-[#292929]/40"
                  }`}
                >
                  <Users className="w-6 h-6" />
                  <span className="text-sm font-medium">Non-binary</span>
                </button>
              </div>
            </div>

            {/* Eye Colour */}
            <div>
              <label className="block text-sm font-medium text-[#292929] mb-2">Eye Colour *</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange("eyeColour", "brown")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                    formData.eyeColour === "brown" 
                      ? "border-[#8B4513] bg-[#8B4513] text-white" 
                      : "border-[#292929]/20 bg-[#e7e6e3]/30 hover:border-[#8B4513]/40"
                  }`}
                >
                  <div className="w-6 h-6 bg-[#8B4513] rounded-full border-2 border-white shadow-inner"></div>
                  <span className="text-sm font-medium">Earth</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("eyeColour", "blue")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                    formData.eyeColour === "blue" 
                      ? "border-[#0066CC] bg-[#0066CC] text-white" 
                      : "border-[#292929]/20 bg-[#e7e6e3]/30 hover:border-[#0066CC]/40"
                  }`}
                >
                  <div className="w-6 h-6 bg-[#0066CC] rounded-full border-2 border-white shadow-inner"></div>
                  <span className="text-sm font-medium">Sea</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("eyeColour", "green")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                    formData.eyeColour === "green" 
                      ? "border-[#228B22] bg-[#228B22] text-white" 
                      : "border-[#292929]/20 bg-[#e7e6e3]/30 hover:border-[#228B22]/40"
                  }`}
                >
                  <div className="w-6 h-6 bg-[#228B22] rounded-full border-2 border-white shadow-inner"></div>
                  <span className="text-sm font-medium">Land</span>
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Container 2: Personal Details */}
        <Card className="p-6 shadow-lg border border-[#292929]/10 bg-white mb-6">
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="flex-1 h-px bg-[#292929]/20"></div>
              <h3 className="px-3 text-lg font-bold text-[#292929] tracking-tight">
                <span className="italic font-medium">PERSONAL</span>
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
              <Select value={formData.jobTitle} onValueChange={(value) => handleInputChange("jobTitle", value)}>
                <SelectTrigger className="w-full border-[#292929]/20 focus:border-[#292929] bg-[#e7e6e3]/30">
                  <SelectValue placeholder="Select job category" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#292929]/20">
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="public-services">Public Services</SelectItem>
                  <SelectItem value="arts-entertainment">Arts & Entertainment</SelectItem>
                  <SelectItem value="politics">Politics</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="sport">Sport</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
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
          </div>
        </Card>

        {/* Container 3: Contact Info */}
        <Card className="p-6 shadow-lg border border-[#292929]/10 bg-white mb-6">
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="flex-1 h-px bg-[#292929]/20"></div>
              <h3 className="px-3 text-lg font-bold text-[#292929] tracking-tight">
                <span className="italic font-medium">CONTACT</span>
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