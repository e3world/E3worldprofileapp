import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Heart, Share2, Sparkles, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  const handleCreateProfile = () => {
    setLocation("/onboarding/phase1");
  };

  const features = [
    {
      icon: <User className="w-8 h-8 text-blue-500" />,
      title: "Personal Identity",
      description: "Showcase who you are with a beautiful profile page"
    },
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Connect & Engage",
      description: "Share your links and let others discover you"
    },
    {
      icon: <Share2 className="w-8 h-8 text-green-500" />,
      title: "Interactive Questions",
      description: "Engage your audience with fun weekly questions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Create Your Digital Identity
          </Badge>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Build Your Perfect{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Profile Page
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Create a stunning personal profile that showcases who you are, connects you with others, and engages your audience with interactive questions.
          </p>

          {/* CTA Button */}
          <Button 
            onClick={handleCreateProfile}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Creating Your Profile
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Preview Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            What You'll Create
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            In just a few simple steps, you'll have a beautiful profile page that represents you perfectly.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-0">
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Personal Information
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Add your name, bio, profile picture, and relationship status
                </p>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-0">
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Social Links
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Connect your social media, portfolio, and other important links
                </p>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-0">
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Custom Theme
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Choose colors and styles that match your personality
                </p>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-0">
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Interactive Questions
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Engage visitors with fun questions about you
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              It only takes a few minutes to create your profile. Join thousands of others who have already built their digital identity.
            </p>
            <Button 
              onClick={handleCreateProfile}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Create Your Profile Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}