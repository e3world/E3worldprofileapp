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
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300 p-4">
      <div className="max-w-sm mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Profile</h1>
          <p className="text-lg">Phase 3 of 3: Terms & Conditions</p>
        </div>

        {/* Terms Card */}
        <Card className="bg-gradient-to-br from-orange-600 to-amber-600 rounded-3xl p-8 shadow-lg border-0">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-white" />
            <h2 className="text-white text-2xl font-bold tracking-tight">
              Terms & Conditions
            </h2>
          </div>
          
          <div className="space-y-6">
            {/* Terms of Service */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold text-lg mb-4">Terms of Service</h3>
              <div className="text-white/90 text-sm space-y-3 max-h-48 overflow-y-auto">
                <p>By using this profile service, you agree to the following terms:</p>
                <ul className="list-disc pl-4 space-y-2">
                  <li>You will provide accurate and truthful information</li>
                  <li>You will not use the service for illegal or harmful purposes</li>
                  <li>You are responsible for keeping your account secure</li>
                  <li>We reserve the right to modify these terms at any time</li>
                  <li>Your profile information may be visible to other users</li>
                  <li>You can delete your profile at any time</li>
                </ul>
              </div>
              
              <div className="flex items-center space-x-3 mt-4">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={setAcceptedTerms}
                  className="bg-white/10 border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-orange-600"
                />
                <label htmlFor="terms" className="text-white/90 text-sm font-medium">
                  I agree to the Terms of Service
                </label>
              </div>
            </div>

            {/* Privacy Policy */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold text-lg mb-4">Privacy Policy</h3>
              <div className="text-white/90 text-sm space-y-3 max-h-48 overflow-y-auto">
                <p>We respect your privacy and are committed to protecting your personal data:</p>
                <ul className="list-disc pl-4 space-y-2">
                  <li>We collect only the information you provide during registration</li>
                  <li>Your data is stored securely and never sold to third parties</li>
                  <li>We may use your email to send important updates</li>
                  <li>You can request data deletion at any time</li>
                  <li>We use cookies to improve your experience</li>
                  <li>Your profile data is used to display your public profile</li>
                </ul>
              </div>
              
              <div className="flex items-center space-x-3 mt-4">
                <Checkbox
                  id="privacy"
                  checked={acceptedPrivacy}
                  onCheckedChange={setAcceptedPrivacy}
                  className="bg-white/10 border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-orange-600"
                />
                <label htmlFor="privacy" className="text-white/90 text-sm font-medium">
                  I agree to the Privacy Policy
                </label>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-white" />
                <h3 className="text-white font-semibold text-lg">Ready to Create</h3>
              </div>
              <p className="text-white/90 text-sm">
                Once you accept both agreements, your profile will be created and you'll be able to start connecting with others!
              </p>
            </div>
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
            onClick={handleFinish}
            disabled={createProfileMutation.isPending || !acceptedTerms || !acceptedPrivacy}
            className="bg-black/80 hover:bg-black text-white font-semibold py-3 px-8 rounded-full transition-all duration-200 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-white/50 h-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createProfileMutation.isPending ? (
              "Creating Profile..."
            ) : (
              <>
                Create Profile
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}