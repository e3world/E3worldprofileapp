import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Shield, CheckCircle } from "lucide-react";
import type { InsertProfile } from "@shared/schema";

export default function OnboardingPhase3() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const { toast } = useToast();

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
      const response = await apiRequest("POST", "/api/profiles", data);
      return response.json();
    },
    onSuccess: (profile) => {
      toast({
        title: "Profile Created!",
        description: "Your profile has been successfully created.",
      });
      
      // Clear onboarding data
      localStorage.removeItem("onboarding_phase1");
      localStorage.removeItem("onboarding_phase2");
      
      // Navigate to the created profile
      window.location.href = `/profile/${profile.id}`;
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFinish = () => {
    if (!acceptedTerms || !acceptedPrivacy) {
      toast({
        title: "Agreement Required",
        description: "Please accept both terms and privacy policy to continue.",
        variant: "destructive",
      });
      return;
    }

    // Get data from previous phases
    const phase1Data = JSON.parse(localStorage.getItem("onboarding_phase1") || "{}");
    const phase2Data = JSON.parse(localStorage.getItem("onboarding_phase2") || "[]");

    // Create profile data
    const profileData: InsertProfile = {
      name: phase1Data.name,
      bio: phase1Data.bio,
      profileImage: phase1Data.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
      relationshipStatus: phase1Data.relationshipStatus,
      email: phase1Data.email,
      phone: phase1Data.phone || null,
      links: phase2Data,
      acceptedTerms: true,
    };

    createProfileMutation.mutate(profileData);
  };

  const goBack = () => {
    window.location.href = "/onboarding/phase2";
  };

  return (
    <div className="min-h-screen bg-[#e7e6e3] p-4">
      <div className="max-w-lg mx-auto">
        {/* Header with divider */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex-1 h-px bg-[#292929]"></div>
            <Shield className="w-8 h-8 mx-4 text-[#292929]" />
            <div className="flex-1 h-px bg-[#292929]"></div>
          </div>
          <h1 className="text-2xl font-bold text-[#292929] mb-2">Final Step</h1>
          <p className="text-[#292929]/70 text-sm">Step 3 of 3</p>
        </div>

        <Card className="p-6 shadow-lg border border-[#292929]/10 bg-white">
          <div className="space-y-6">
            {/* Terms of Service */}
            <div className="bg-[#e7e6e3]/50 rounded-lg p-4 border border-[#292929]/10">
              <div className="flex items-center mb-3">
                <div className="flex-1 h-px bg-[#292929]/20"></div>
                <h3 className="px-3 text-[#292929] font-semibold text-sm">Terms of Service</h3>
                <div className="flex-1 h-px bg-[#292929]/20"></div>
              </div>
              <div className="text-[#292929]/70 text-xs space-y-2 max-h-32 overflow-y-auto mb-4">
                <p>By using this profile service, you agree to the following terms:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>You will provide accurate and truthful information</li>
                  <li>You will not use the service for illegal or harmful purposes</li>
                  <li>You are responsible for keeping your account secure</li>
                  <li>We reserve the right to modify these terms at any time</li>
                  <li>Your profile information may be visible to other users</li>
                  <li>You can delete your profile at any time</li>
                </ul>
              </div>
              
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={setAcceptedTerms}
                  className="border-[#292929]/30 data-[state=checked]:bg-[#292929] data-[state=checked]:text-[#e7e6e3]"
                />
                <label htmlFor="terms" className="text-[#292929] text-sm font-medium">
                  I agree to the Terms of Service
                </label>
              </div>
            </div>

            {/* Privacy Policy */}
            <div className="bg-[#e7e6e3]/50 rounded-lg p-4 border border-[#292929]/10">
              <div className="flex items-center mb-3">
                <div className="flex-1 h-px bg-[#292929]/20"></div>
                <h3 className="px-3 text-[#292929] font-semibold text-sm">Privacy Policy</h3>
                <div className="flex-1 h-px bg-[#292929]/20"></div>
              </div>
              <div className="text-[#292929]/70 text-xs space-y-2 max-h-32 overflow-y-auto mb-4">
                <p>We respect your privacy and are committed to protecting your personal data:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>We collect only the information you provide during registration</li>
                  <li>Your data is stored securely and never sold to third parties</li>
                  <li>We may use your email to send important updates</li>
                  <li>You can request data deletion at any time</li>
                  <li>We use cookies to improve your experience</li>
                  <li>Your profile data is used to display your public profile</li>
                </ul>
              </div>
              
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="privacy"
                  checked={acceptedPrivacy}
                  onCheckedChange={setAcceptedPrivacy}
                  className="border-[#292929]/30 data-[state=checked]:bg-[#292929] data-[state=checked]:text-[#e7e6e3]"
                />
                <label htmlFor="privacy" className="text-[#292929] text-sm font-medium">
                  I agree to the Privacy Policy
                </label>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-[#e7e6e3]/50 rounded-lg p-4 border border-[#292929]/10">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-[#292929]" />
                <h3 className="text-[#292929] font-semibold text-sm">Ready to Create</h3>
              </div>
              <p className="text-[#292929]/70 text-xs">
                Once you accept both agreements, your profile will be created and you'll be able to start connecting with others!
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 gap-3">
            <Button 
              onClick={goBack}
              variant="outline"
              className="flex items-center gap-2 border-[#292929]/20 text-[#292929] hover:bg-[#e7e6e3]/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <Button 
              onClick={handleFinish}
              disabled={createProfileMutation.isPending || !acceptedTerms || !acceptedPrivacy}
              className="bg-[#292929] hover:bg-[#292929]/80 text-[#e7e6e3] flex items-center gap-2 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
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