import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Shield, CheckCircle, Upload, User } from "lucide-react";
import type { InsertProfile } from "@shared/schema";
import { uploadProfileImage, updateUserProfile } from "@/lib/uploadImage";
import LoadingPage from "./loading";

export default function OnboardingPhase3() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setFailedAttempts(prev => prev + 1);
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 2MB and try again.",
          variant: "destructive",
        });
        
        // Clear the file input
        e.target.value = "";
        return;
      }

      // Store the file for upload
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    // Check if previous phases data exists
    const phase1Data = localStorage.getItem("onboarding_phase1");
    const phase2Data = localStorage.getItem("onboarding_phase2");
    
    if (!phase1Data || !phase2Data) {
      toast({
        title: "Missing Data",
        description: "Please complete all previous phases first.",
        variant: "destructive",
      });
      window.location.href = "/onboarding/phase1";
    }
  }, [toast]);

  const createProfileMutation = useMutation({
    mutationFn: async (data: InsertProfile) => {
      console.log("Sending profile data:", data);
      
      try {
        const response = await apiRequest("POST", "/api/profiles", data);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server response error:", errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        console.log("Profile created successfully:", result);
        return result;
      } catch (error) {
        console.error("Request failed:", error);
        throw error;
      }
    },
    onSuccess: (profile) => {
      toast({
        title: "Profile Created!",
        description: "Your profile has been successfully created.",
      });
      
      // Clear onboarding data
      localStorage.removeItem("onboarding_phase1");
      localStorage.removeItem("onboarding_phase2");
      
      // Show loading page for 2 seconds then navigate
      setIsLoading(true);
      setTimeout(() => {
        window.location.href = `/profile/${profile.serialCode}`;
      }, 2000);
    },
    onError: (error: any) => {
      console.error("Profile creation error:", error);
      
      let errorMessage = "An unexpected error occurred.";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Error",
        description: `Failed to create profile. Please try again. ${errorMessage}`,
        variant: "destructive",
      });
    },
  });

  const handleFinish = async () => {
    if (!acceptedTerms || !acceptedPrivacy) {
      toast({
        title: "Agreement Required",
        description: "Please accept both terms and privacy policy to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!bio || !imageFile) {
      toast({
        title: "Missing Information",
        description: "Please upload a photo and write a bio to continue.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate bio length (max 15 words)
    const bioWords = bio.trim().split(/\s+/).filter(word => word.length > 0);
    if (bioWords.length > 15) {
      toast({
        title: "Bio Too Long",
        description: "Please keep your bio to 15 words or less.",
        variant: "destructive",
      });
      return;
    }

    // Get data from previous phases
    const phase1DataStr = localStorage.getItem("onboarding_phase1");
    const phase2DataStr = localStorage.getItem("onboarding_phase2");
    
    if (!phase1DataStr || !phase2DataStr) {
      toast({
        title: "Missing Data",
        description: "Please complete all previous phases first.",
        variant: "destructive",
      });
      return;
    }
    
    const phase1Data = JSON.parse(phase1DataStr);
    const phase2Data = JSON.parse(phase2DataStr);
    
    // Generate a unique serial code based on user data and timestamp
    const generateSerialCode = () => {
      const timestamp = Date.now().toString(36);
      const nameHash = phase1Data.name ? phase1Data.name.substring(0, 3).toUpperCase() : "USR";
      return `${nameHash}${timestamp}`.substring(0, 10);
    };
    
    const serialCode = generateSerialCode();
    const dynamicLink = `https://${serialCode}.e3world.co.uk`;

    // First upload the image to Supabase
    const fileName = `user_${phase1Data.name}_${Date.now()}.jpg`;
    
    try {
      const imageUrl = await uploadProfileImage(imageFile, fileName);
      
      if (!imageUrl) {
        throw new Error("Failed to upload image");
      }
      
      // Create profile data with uploaded image URL
      const profileData: InsertProfile = {
        eNumber: phase1Data.eNumber,
        name: phase1Data.name,
        bio: bio,
        profileImage: imageUrl,
        relationshipStatus: phase1Data.relationshipStatus,
        jobTitle: phase1Data.jobTitle,
        area: phase1Data.area,
        email: phase1Data.email,
        phone: phase1Data.phone || null,
        hidePersonalInfo: phase1Data.hidePersonalInfo || false,
        links: phase2Data,
        acceptedTerms: true,
        serialCode: serialCode,
        dynamicLink: dynamicLink,
      };

      console.log("Creating profile with data:", profileData);
      console.log("Bio word count:", bio.trim().split(/\s+/).filter(word => word.length > 0).length);
      
      // Create the profile in our database
      createProfileMutation.mutate(profileData);
      
      // Also update the user profile in Supabase (if you have a users table)
      // const updateSuccess = await updateUserProfile(phase1Data.eNumber, imageUrl);
      // if (!updateSuccess) {
      //   console.warn("Failed to update user profile in Supabase");
      // }
      
    } catch (error) {
      console.error("Image upload failed:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const goBack = () => {
    window.location.href = "/onboarding/phase2";
  };

  // Show loading page after profile creation
  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-[#e7e6e3] p-4">
      <div className="max-w-lg mx-auto">
        {/* Header with divider */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="flex-1 h-px bg-[#292929]"></div>
            <Shield className="w-8 h-8 mx-4 text-[#292929]" />
            <div className="flex-1 h-px bg-[#292929]"></div>
          </div>
          <h1 className="text-3xl font-bold text-[#292929] mb-4 tracking-tight">
            FINAL <span className="italic font-medium">STEP</span>
          </h1>
          <p className="text-[#292929]/70 text-sm font-medium mb-6">Step 3 of 3</p>
          <div className="h-px bg-[#292929]/30 w-full"></div>
        </div>

        {/* Profile Image Upload */}
        <Card className="p-6 shadow-[0_6px_16px_rgba(0,0,0,0.15)] border border-[#292929]/10 bg-[#292929] mb-6">
          <div className="text-center">
            <div className="flex items-center mb-4">
              <div className="flex-1 h-px bg-[#e7e6e3]/20"></div>
              <h3 className="px-3 text-lg font-bold text-[#e7e6e3] tracking-tight">
                <span className="italic font-medium">PHOTO</span>
              </h3>
              <div className="flex-1 h-px bg-[#e7e6e3]/20"></div>
            </div>
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
            <p className="text-xs text-[#e7e6e3]/60 mb-2">Upload photo *</p>
            
            {/* Show recommendations only after 2 failed attempts */}
            {failedAttempts >= 2 && (
              <div className="text-xs text-[#e7e6e3]/50 space-y-1 mt-3 p-3 bg-[#e7e6e3]/10 rounded-lg border border-[#e7e6e3]/20">
                <p className="text-[#e7e6e3]/70 font-medium mb-2">Photo Tips:</p>
                <p>• Max file size: 2MB</p>
                <p>• Formats: JPG, PNG, GIF</p>
                <p>• Recommended: 400x400px</p>
                <p>• Use image compression tools if needed</p>
              </div>
            )}
          </div>
        </Card>

        {/* Bio Section */}
        <Card className="p-6 shadow-[0_6px_16px_rgba(0,0,0,0.15)] border border-[#292929]/10 bg-[#292929] mb-6">
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="flex-1 h-px bg-[#e7e6e3]/20"></div>
              <h3 className="px-3 text-lg font-bold text-[#e7e6e3] tracking-tight">
                <span className="italic font-medium">BIO</span>
              </h3>
              <div className="flex-1 h-px bg-[#e7e6e3]/20"></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#e7e6e3] mb-1">
                Bio * (Maximum 15 words)
              </label>
              <Textarea
                placeholder="Tell us about yourself in 15 words or less..."
                value={bio}
                onChange={(e) => {
                  const wordCount = e.target.value.trim().split(/\s+/).filter(word => word.length > 0).length;
                  if (wordCount <= 15) {
                    setBio(e.target.value);
                  }
                }}
                className="w-full border-[#e7e6e3]/20 focus:border-[#e7e6e3] bg-[#e7e6e3] min-h-[100px] resize-none placeholder:text-[#292929]/60 text-[#292929] shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)]"
              />
              <div className="text-xs text-[#e7e6e3]/60 mt-1">
                {bio.trim().split(/\s+/).filter(word => word.length > 0).length}/15 words
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-[0_6px_16px_rgba(0,0,0,0.15)] border border-[#292929]/10 bg-[#292929]">
          <div className="space-y-6">
            {/* Terms of Service */}
            <div className="bg-[#e7e6e3]/10 rounded-lg p-4 border border-[#e7e6e3]/10">
              <div className="flex items-center mb-3">
                <div className="flex-1 h-px bg-[#e7e6e3]/20"></div>
                <h3 className="px-3 text-[#e7e6e3] font-bold text-lg tracking-tight">
                  E3WORLD LTD <span className="italic font-medium">TERMS</span>
                </h3>
                <div className="flex-1 h-px bg-[#e7e6e3]/20"></div>
              </div>
              <div className="text-[#e7e6e3]/70 text-xs space-y-2 max-h-40 overflow-y-auto mb-4">
                <p className="font-medium text-[#e7e6e3]">Welcome to The Circle World</p>
                <p>By using this service, you acknowledge and agree to the following terms (Effective Date: 28 June 2025):</p>
                
                <div className="space-y-2">
                  <div>
                    <p className="font-medium text-[#e7e6e3]/90">User Requirements:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>You must be at least 18 years of age with legal capacity to enter binding agreements</li>
                      <li>You agree to provide accurate, current, and complete information at all times</li>
                      <li>You will not use the service for illegal or harmful purposes</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-medium text-[#e7e6e3]/90">Service Features:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Create smart links and maintain personal profile pages</li>
                      <li>Integration with NFC and web-based technology</li>
                      <li>Collection and storage of personal data for optimized user experience</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-medium text-[#e7e6e3]/90">Device & Warranty:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Devices engineered for 5+ years operational integrity</li>
                      <li>No refunds after 10 calendar days from purchase/activation</li>
                      <li>Replacement available for nominal fee after 5-year period</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-medium text-[#e7e6e3]/90">NFC Technology Risks:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Possible interference from electronic devices or magnetic fields</li>
                      <li>Risk of unauthorized data interception in unsecured public spaces</li>
                      <li>Exposure to electromagnetic fields within regulatory limits</li>
                      <li>Potential functional disruption due to physical damage</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-medium text-[#e7e6e3]/90">Liability Limitations:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>E3WORLD LTD not liable for indirect, incidental, or consequential damages</li>
                      <li>No liability for data breaches, loss, or corruption despite security measures</li>
                      <li>Company commits to reasonable resources for prevention and mitigation</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-medium text-[#e7e6e3]/90">Data Rights:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Request permanent data deletion via email to hello@e3world.co.uk</li>
                      <li>Deletion requests processed within 30 calendar days</li>
                      <li>Compliance with applicable data protection laws</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={setAcceptedTerms}
                  className="border-[#fefefa] data-[state=checked]:bg-[#292929] data-[state=checked]:text-[#e7e6e3]"
                />
                <label htmlFor="terms" className="text-[#e7e6e3] text-sm font-medium">
                  I agree to the E3WORLD LTD Terms and Conditions
                </label>
              </div>
            </div>

            {/* Privacy Policy */}
            <div className="bg-[#e7e6e3]/10 rounded-lg p-4 border border-[#e7e6e3]/10">
              <div className="flex items-center mb-3">
                <div className="flex-1 h-px bg-[#e7e6e3]/20"></div>
                <h3 className="px-3 text-[#e7e6e3] font-bold text-lg tracking-tight">
                  PRIVACY <span className="italic font-medium">POLICY</span>
                </h3>
                <div className="flex-1 h-px bg-[#e7e6e3]/20"></div>
              </div>
              <div className="text-[#e7e6e3]/70 text-xs space-y-2 max-h-40 overflow-y-auto mb-4">
                <p className="font-medium text-[#e7e6e3]">E3WORLD LTD Privacy Policy</p>
                <p>This policy governs how E3WORLD LTD collects, stores, and processes your information:</p>
                
                <div className="space-y-2">
                  <div>
                    <p className="font-medium text-[#e7e6e3]/90">Information We Collect:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Personal Identification Information (name, address, date of birth, contact details)</li>
                      <li>Profile Data (responses to questions, smart links, profile images)</li>
                      <li>Device Data (hardware IDs, NFC tag readings, usage logs)</li>
                      <li>Communications Data (emails, support requests)</li>
                      <li>Technical Data (IP addresses, browser types, device information)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-medium text-[#e7e6e3]/90">Use of Data:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>To provide, maintain, and enhance the Service's features</li>
                      <li>To personalise user experiences and interactions</li>
                      <li>To facilitate direct and indirect communications with users</li>
                      <li>For internal business analytics and service improvements</li>
                      <li>For promotional, marketing, and commercial purposes within and beyond the E3 ecosystem</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-medium text-[#e7e6e3]/90">External Data Usage:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>We may share aggregated, anonymized, or non-personally identifiable data with third parties</li>
                      <li>For research, marketing, and commercial purposes</li>
                      <li>Explicit consent sought for sharing identifiable personal data externally</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-medium text-[#e7e6e3]/90">Data Retention:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Data retained for duration necessary to fulfil outlined purposes</li>
                      <li>May be retained for analytics, backup, and legal obligations after account termination</li>
                      <li>Except where deletion is lawfully requested by the user</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-medium text-[#e7e6e3]/90">Security of Data:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Appropriate administrative, technical, and physical safeguards implemented</li>
                      <li>Protection against unauthorized access, disclosure, alteration, and destruction</li>
                      <li>No security measure is completely infallible - you acknowledge this risk</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-medium text-[#e7e6e3]/90">Data Subject Rights:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Access, rectify, or erase your personal data</li>
                      <li>Restrict or object to certain processing activities</li>
                      <li>Request data portability and withdraw consent</li>
                      <li>Contact hello@e3world.co.uk to exercise these rights</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-medium text-[#e7e6e3]/90">Governing Law:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Policy governed by laws of England and Wales</li>
                      <li>Disputes subject to exclusive jurisdiction of English courts</li>
                      <li>E3WORLD LTD reserves right to amend without prior notice</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="privacy"
                  checked={acceptedPrivacy}
                  onCheckedChange={setAcceptedPrivacy}
                  className="border-[#fefefa] data-[state=checked]:bg-[#292929] data-[state=checked]:text-[#e7e6e3]"
                />
                <label htmlFor="privacy" className="text-[#e7e6e3] text-sm font-medium">
                  I agree to the Privacy Policy
                </label>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-[#e7e6e3]/10 rounded-lg p-4 border border-[#e7e6e3]/10">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-[#e7e6e3]" />
                <h3 className="text-[#e7e6e3] font-bold text-lg tracking-tight">
                  READY TO <span className="italic font-medium">CREATE</span>
                </h3>
              </div>
              <p className="text-[#e7e6e3]/70 text-xs">
                By accepting these terms, you acknowledge understanding of the service features, NFC technology risks, liability limitations, and data handling practices. Your profile will be created and you'll be able to start connecting with others through The Circle World!
              </p>
            </div>
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
              onClick={handleFinish}
              disabled={createProfileMutation.isPending || !acceptedTerms || !acceptedPrivacy}
              variant="outline"
              className="flex items-center gap-2 border-[#e7e6e3]/20 text-[#292929] hover:bg-[#e7e6e3]/10 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createProfileMutation.isPending ? (
                "Creating Profile..."
              ) : (
                <>
                  Create Profile
                  <CheckCircle className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}