import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Profile from "@/pages/profile";
import OnboardingPhase1 from "@/pages/onboarding-phase1";
import OnboardingPhase2 from "@/pages/onboarding-phase2";
import OnboardingPhase3 from "@/pages/onboarding-phase3";
import DynamicProfile from "@/pages/dynamic-profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Profile} />
      <Route path="/onboarding/phase1" component={OnboardingPhase1} />
      <Route path="/onboarding/phase2" component={OnboardingPhase2} />
      <Route path="/onboarding/phase3" component={OnboardingPhase3} />
      <Route path="/profile/:profileId">
        {({ profileId }) => <DynamicProfile profileId={profileId} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
