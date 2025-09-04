import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const BookingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [doctorData, setDoctorData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // Load selected doctor data
    const savedDoctorData = localStorage.getItem("selectedDoctorData");
    if (savedDoctorData) {
      setDoctorData(JSON.parse(savedDoctorData));
    } else {
      toast({
        title: "Error",
        description: "No doctor selected",
        variant: "destructive",
      });
      navigate("/doctors");
    }

    // Pre-fill patient name from user profile
    if (user.user_metadata?.full_name) {
      setPatientName(user.user_metadata.full_name);
    }
  }, [user]);
  
  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !patientName || !patientAge || !doctorData) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Generate booking ID
      const bookingId = `BK${Date.now()}`;

      // Create appointment in database
      const { data: appointmentData, error } = await supabase
        .from('appointments')
        .insert({
          patient_id: user.id,
          doctor_id: doctorData.id,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          patient_name: patientName,
          patient_age: parseInt(patientAge),
          symptoms: symptoms || null,
          consultation_fee: doctorData.consultation_fee,
          booking_id: bookingId,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating appointment:', error);
        toast({
          title: "Booking Failed",
          description: "Failed to create appointment. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Store booking data for confirmation page
      const bookingData = {
        appointmentId: appointmentData.id,
        bookingId,
        doctorName: doctorData.profiles?.full_name || 'Dr. Anonymous',
        doctorSpecialization: doctorData.specialization,
        date: selectedDate,
        time: selectedTime,
        patientName,
        patientAge,
        symptoms,
        consultationFee: doctorData.consultation_fee
      };

      localStorage.setItem("bookingData", JSON.stringify(bookingData));
      
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been successfully booked!",
      });
      
      navigate("/confirmation");
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 17) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  if (!doctorData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          size="lg"
          onClick={() => navigate("/doctors")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2" />
          Back to Doctors
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Book Appointment</h1>
          <p className="text-xl text-muted-foreground">
            with {doctorData.profiles?.full_name || 'Dr. Anonymous'} - {doctorData.specialization}
          </p>
          <p className="text-lg text-muted-foreground">
            Consultation Fee: ${doctorData.consultation_fee}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Date & Time Selection */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Calendar className="text-primary" />
                Select Date & Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-lg font-semibold">Choose Date</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getTomorrowDate()}
                  className="h-14 text-lg border-2 rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-lg font-semibold">Choose Time</Label>
                <div className="grid grid-cols-3 gap-2">
                  {generateTimeSlots().map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                      className="h-12"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Details */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <User className="text-primary" />
                Patient Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-lg font-semibold">Patient Name *</Label>
                <Input
                  type="text"
                  placeholder="Enter full name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="h-14 text-lg border-2 rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-lg font-semibold">Age *</Label>
                <Input
                  type="number"
                  placeholder="Enter age"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  className="h-14 text-lg border-2 rounded-xl"
                  min="1"
                  max="120"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-lg font-semibold">Symptoms (Optional)</Label>
                <textarea
                  placeholder="Describe your symptoms or reason for visit..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full h-32 p-4 text-lg border-2 rounded-xl resize-none bg-background"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 text-center">
          <Button
            onClick={handleBooking}
            disabled={!selectedDate || !selectedTime || !patientName || !patientAge || loading}
            size="kiosk"
            className="px-16"
          >
            {loading ? "Booking..." : "Continue to Confirmation"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;