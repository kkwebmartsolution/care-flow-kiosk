import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Calendar } from "lucide-react";

const allDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Cardiology",
    department: "Heart Care",
    availability: "Available Today",
    photo: "👩‍⚕️",
    rating: 4.9
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialization: "Orthopedics",
    department: "Bone & Joint",
    availability: "Available Today",
    photo: "👨‍⚕️",
    rating: 4.8
  },
  {
    id: 3,
    name: "Dr. Emily Davis",
    specialization: "Pediatrics",
    department: "Child Care",
    availability: "Available Tomorrow",
    photo: "👩‍⚕️",
    rating: 4.9
  },
  {
    id: 4,
    name: "Dr. Robert Wilson",
    specialization: "Dermatology",
    department: "Skin Care",
    availability: "Available Today",
    photo: "👨‍⚕️",
    rating: 4.7
  },
  {
    id: 5,
    name: "Dr. Lisa Anderson",
    specialization: "Neurology",
    department: "Brain & Nerve",
    availability: "Available Today",
    photo: "👩‍⚕️",
    rating: 4.8
  },
  {
    id: 6,
    name: "Dr. James Brown",
    specialization: "General Medicine",
    department: "General Care",
    availability: "Available Today",
    photo: "👨‍⚕️",
    rating: 4.6
  }
];

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredDoctors = allDoctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookAppointment = (doctorId: number) => {
    localStorage.setItem("selectedDoctorId", doctorId.toString());
    navigate("/booking");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <Button 
          variant="ghost" 
          size="lg"
          onClick={() => navigate("/doctors")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2" />
          Back to Doctors
        </Button>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-4">Find Your Doctor</h1>
          <p className="text-xl text-muted-foreground mb-8">Search by name, specialization, or department</p>
          
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground w-6 h-6" />
            <Input
              type="text"
              placeholder="Search for doctors, specializations, or departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-16 text-xl pl-16 pr-6 border-2 rounded-xl shadow-sm"
            />
          </div>
        </div>

        {searchTerm && (
          <div className="mb-6">
            <p className="text-lg text-muted-foreground">
              {filteredDoctors.length > 0 
                ? `Found ${filteredDoctors.length} doctor${filteredDoctors.length > 1 ? 's' : ''} matching "${searchTerm}"`
                : `No doctors found matching "${searchTerm}"`
              }
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(searchTerm ? filteredDoctors : allDoctors).map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-xl transition-all duration-200 border-2 border-border">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="text-5xl">{doctor.photo}</div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{doctor.name}</h3>
                    <p className="text-lg text-primary font-semibold">{doctor.specialization}</p>
                    <p className="text-base text-muted-foreground">{doctor.department}</p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant={doctor.availability.includes("Today") ? "default" : "secondary"} className="text-sm">
                      {doctor.availability}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      ⭐ {doctor.rating}
                    </Badge>
                  </div>
                  
                  <Button
                    onClick={() => handleBookAppointment(doctor.id)}
                    size="lg"
                    className="w-full"
                  >
                    <Calendar className="mr-2" />
                    Book Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;