import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
];

const BookingPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const selectedDoctorId = localStorage.getItem("selectedDoctorId");
  const doctorName = "Dr. Sarah Johnson"; // This would normally come from the selected doctor data

  const handleBooking = () => {
    if (selectedDate && selectedTime && patientName && patientAge) {
      const bookingData = {
        doctorId: selectedDoctorId,
        doctorName,
        date: selectedDate,
        time: selectedTime,
        patientName,
        patientAge,
        symptoms
      };
      localStorage.setItem("bookingData", JSON.stringify(bookingData));
      navigate("/confirmation");
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

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
          <p className="text-xl text-muted-foreground">with {doctorName}</p>
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
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                      className="h-12 text-base"
                    >
                      <Clock className="mr-2 w-4 h-4" />
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
            disabled={!selectedDate || !selectedTime || !patientName || !patientAge}
            size="kiosk"
            className="px-16"
          >
            Continue to Confirmation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;