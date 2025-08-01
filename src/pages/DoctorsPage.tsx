import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Calendar, User } from "lucide-react";

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Cardiology",
    availability: "Available Today",
    experience: "15 years",
    photo: "👩‍⚕️",
    rating: 4.9,
    department: "Heart Care"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialization: "Orthopedics",
    availability: "Available Today",
    experience: "12 years",
    photo: "👨‍⚕️",
    rating: 4.8,
    department: "Bone & Joint"
  },
  {
    id: 3,
    name: "Dr. Emily Davis",
    specialization: "Pediatrics",
    availability: "Available Tomorrow",
    experience: "10 years",
    photo: "👩‍⚕️",
    rating: 4.9,
    department: "Child Care"
  },
  {
    id: 4,
    name: "Dr. Robert Wilson",
    specialization: "Dermatology",
    availability: "Available Today",
    experience: "18 years",
    photo: "👨‍⚕️",
    rating: 4.7,
    department: "Skin Care"
  }
];

const DoctorsPage = () => {
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);

  const handleBookAppointment = (doctorId: number) => {
    localStorage.setItem("selectedDoctorId", doctorId.toString());
    navigate("/booking");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            size="lg"
            onClick={() => navigate("/login")}
          >
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate("/search")}
          >
            <Search className="mr-2" />
            Search Doctors
          </Button>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-4">Available Doctors</h1>
          <p className="text-xl text-muted-foreground">Select a doctor to book your appointment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {doctors.map((doctor) => (
            <Card 
              key={doctor.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-xl border-2 ${
                selectedDoctor === doctor.id ? 'border-primary shadow-lg' : 'border-border'
              }`}
              onClick={() => setSelectedDoctor(doctor.id)}
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="text-6xl">{doctor.photo}</div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{doctor.name}</h3>
                      <p className="text-lg text-primary font-semibold">{doctor.specialization}</p>
                      <p className="text-base text-muted-foreground">{doctor.department}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <Badge variant={doctor.availability.includes("Today") ? "default" : "secondary"} className="text-sm px-3 py-1">
                        {doctor.availability}
                      </Badge>
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        {doctor.experience}
                      </Badge>
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        ⭐ {doctor.rating}
                      </Badge>
                    </div>
                    
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookAppointment(doctor.id);
                      }}
                      size="lg"
                      className="w-full"
                    >
                      <Calendar className="mr-2" />
                      Book Appointment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;