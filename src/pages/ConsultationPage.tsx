import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Video, MessageCircle, Phone, Calendar, User } from "lucide-react";

interface ConsultationData {
  bookingId: string;
  doctorName: string;
  date: string;
  patientName: string;
}

const ConsultationPage = () => {
  const navigate = useNavigate();
  const [consultationData, setConsultationData] = useState<ConsultationData | null>(null);
  const [consultationStarted, setConsultationStarted] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("prescriptionData");
    if (storedData) {
      const data = JSON.parse(storedData);
      setConsultationData(data);
    } else {
      navigate("/prescription");
    }
  }, [navigate]);

  const handleStartConsultation = (type: 'video' | 'chat') => {
    setConsultationStarted(true);
    // In a real app, this would initialize the video/chat service
    console.log(`Starting ${type} consultation with ${consultationData?.doctorName}`);
  };

  if (!consultationData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          size="lg"
          onClick={() => navigate("/prescription")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2" />
          Back to Prescription
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {consultationStarted ? "Consultation Active" : "Start Consultation"}
          </h1>
          <p className="text-xl text-muted-foreground">
            Connect with {consultationData.doctorName}
          </p>
        </div>

        {!consultationStarted ? (
          <div className="space-y-8">
            {/* Appointment Summary */}
            <Card className="border-2">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-2xl">Appointment Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <User className="w-6 h-6 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Doctor</p>
                      <p className="text-lg font-semibold">{consultationData.doctorName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-6 h-6 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Patient</p>
                      <p className="text-lg font-semibold">{consultationData.patientName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="text-lg font-semibold">{formatDate(consultationData.date)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consultation Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-2 hover:shadow-xl transition-all duration-200 cursor-pointer group">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <Video className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Video Call</CardTitle>
                  <p className="text-muted-foreground">Face-to-face consultation with your doctor</p>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    onClick={() => handleStartConsultation('video')}
                    size="kiosk"
                    className="w-full"
                  >
                    <Video className="mr-2" />
                    Start Video Call
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-xl transition-all duration-200 cursor-pointer group">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                    <MessageCircle className="w-10 h-10 text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">Text Chat</CardTitle>
                  <p className="text-muted-foreground">Chat with your doctor via secure messaging</p>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    onClick={() => handleStartConsultation('chat')}
                    size="kiosk"
                    variant="secondary"
                    className="w-full"
                  >
                    <MessageCircle className="mr-2" />
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Active Consultation Interface */
          <Card className="border-2">
            <CardHeader className="bg-success/5 border-b">
              <CardTitle className="text-2xl text-center flex items-center justify-center gap-3">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                Consultation in Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Video className="w-16 h-16 text-primary" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-2">Connected to {consultationData.doctorName}</h3>
                  <p className="text-muted-foreground">Your consultation is now active</p>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <Button variant="destructive" size="lg">
                    <Phone className="mr-2" />
                    End Call
                  </Button>
                  <Button variant="outline" size="lg">
                    <MessageCircle className="mr-2" />
                    Chat
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  This is a simulation. In a real implementation, this would connect to your video/chat service.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ConsultationPage;