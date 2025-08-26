import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, User, CheckCircle } from "lucide-react";

interface BookingData {
  doctorName: string;
  date: string;
  patientName: string;
  patientAge: string;
  symptoms: string;
}

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("bookingData");
    if (storedData) {
      setBookingData(JSON.parse(storedData));
    } else {
      navigate("/booking");
    }
  }, [navigate]);

  const handleConfirm = () => {
    // Generate booking ID and store confirmation
    const bookingId = "APT" + Date.now().toString().slice(-6);
    const confirmationData = {
      ...bookingData,
      bookingId,
      status: "confirmed",
      consultationFee: 500,
      gst: 90,
      totalAmount: 590
    };
    localStorage.setItem("confirmationData", JSON.stringify(confirmationData));
    navigate("/payment");
  };

  if (!bookingData) {
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
      <div className="max-w-3xl mx-auto">
        <Button 
          variant="ghost" 
          size="lg"
          onClick={() => navigate("/booking")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2" />
          Back to Booking
        </Button>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Confirm Your Appointment</h1>
          <p className="text-xl text-muted-foreground">Please review your booking details</p>
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="text-2xl text-center">Appointment Details</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {/* Doctor Information */}
            <div className="bg-accent/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
                <User className="text-primary" />
                Doctor Information
              </h3>
              <p className="text-2xl font-semibold text-primary">{bookingData.doctorName}</p>
              <p className="text-lg text-muted-foreground">Cardiology Specialist</p>
            </div>

            {/* Date */}
            <div className="bg-accent/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
                <Calendar className="text-primary" />
                Appointment Date
              </h3>
              <div>
                <p className="text-xl text-primary">{formatDate(bookingData.date)}</p>
              </div>
            </div>

            {/* Patient Information */}
            <div className="bg-accent/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Patient Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-lg font-semibold text-foreground">Name</p>
                  <p className="text-xl text-primary">{bookingData.patientName}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">Age</p>
                  <p className="text-xl text-primary">{bookingData.patientAge} years</p>
                </div>
              </div>
              {bookingData.symptoms && (
                <div>
                  <p className="text-lg font-semibold text-foreground mb-2">Symptoms</p>
                  <p className="text-lg text-muted-foreground bg-background p-4 rounded-lg">
                    {bookingData.symptoms}
                  </p>
                </div>
              )}
            </div>

            {/* Fee Information */}
            <div className="bg-primary/5 rounded-xl p-6 border-2 border-primary/20">
              <h3 className="text-xl font-bold text-foreground mb-4">Fee Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg">Consultation Fee</span>
                  <span className="text-lg font-semibold">₹500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg">GST (18%)</span>
                  <span className="text-lg font-semibold">₹90</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Total Amount</span>
                  <span className="text-xl font-bold text-primary">₹590</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-10 text-center space-y-4">
          <Button
            onClick={handleConfirm}
            size="kiosk"
            className="px-16"
          >
            Confirm Appointment
          </Button>
          <p className="text-sm text-muted-foreground">
            By confirming, you agree to our terms and conditions
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;