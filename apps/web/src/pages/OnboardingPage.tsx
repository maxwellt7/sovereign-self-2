import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleComplete = () => {
    // TODO: Call API to complete onboarding
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Welcome to Sovereign Self</CardTitle>
          <CardDescription>Let's get you set up for success</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">About You</h3>
              <p className="text-muted-foreground">
                Sovereign Self is your personal development companion. Through journaling and
                reflection, you'll gain clarity and accelerate your growth.
              </p>
              <Button onClick={() => setStep(2)} className="w-full">
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Goals</h3>
              <p className="text-muted-foreground">
                What would you like to achieve with Sovereign Self?
              </p>
              {/* TODO: Add goal selection */}
              <div className="flex gap-2">
                <Button onClick={() => setStep(1)} variant="outline">
                  Back
                </Button>
                <Button onClick={handleComplete} className="flex-1">
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

