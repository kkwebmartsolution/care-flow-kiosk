import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Phone } from "lucide-react";

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (phoneNumber.length >= 10) {
      // Store user info and navigate to doctors page
      localStorage.setItem("userPhone", phoneNumber);
      navigate("/doctors");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto">
        <Button 
          variant="ghost" 
          size="lg"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-foreground">Welcome</CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Please enter your phone number to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-lg font-semibold text-foreground">Phone Number</label>
              <Input
                type="tel"
                placeholder="Enter your 10-digit phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-16 text-xl border-2 rounded-xl"
                maxLength={10}
              />
            </div>
            
            <Button
              onClick={handleLogin}
              disabled={phoneNumber.length < 10}
              size="kiosk"
              className="w-full"
            >
              Continue
            </Button>
            
            <p className="text-sm text-muted-foreground text-center">
              No password required - just your phone number
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;