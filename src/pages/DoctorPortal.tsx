import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Stethoscope, Users, Calendar, LogOut, Activity } from "lucide-react";

interface DoctorProfile {
  id: string;
  specialization: string;
  department: string;
  experience_years: number;
  rating: number;
  consultation_fee: number;
  is_online: boolean;
  bio: string;
}

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  patient_name: string;
  patient_age: number;
  symptoms: string;
  status: string;
}

const DoctorPortal = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/doctor/login");
      return;
    }
    fetchDoctorData();
  }, [user]);

  const fetchDoctorData = async () => {
    try {
      // Fetch doctor profile
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (doctorError) {
        toast({
          title: "Access Denied",
          description: "You are not registered as a doctor",
          variant: "destructive",
        });
        navigate("/doctor/login");
        return;
      }

      setDoctorProfile(doctorData);

      // Fetch appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', doctorData.id)
        .order('appointment_date', { ascending: true });

      if (!appointmentsError) {
        setAppointments(appointmentsData || []);
      }
    } catch (error) {
      console.error('Error fetching doctor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOnlineStatus = async () => {
    if (!doctorProfile) return;

    const newStatus = !doctorProfile.is_online;
    
    const { error } = await supabase
      .from('doctors')
      .update({ is_online: newStatus })
      .eq('id', doctorProfile.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update online status",
        variant: "destructive",
      });
    } else {
      setDoctorProfile({ ...doctorProfile, is_online: newStatus });
      toast({
        title: "Status Updated",
        description: `You are now ${newStatus ? 'online' : 'offline'}`,
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading doctor portal...</p>
        </div>
      </div>
    );
  }

  if (!doctorProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Doctor profile not found</p>
            <Button onClick={() => navigate("/doctor/login")}>
              Go to Doctor Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Stethoscope className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Doctor Portal</h1>
              <p className="text-muted-foreground">Welcome back, Dr. {user?.user_metadata?.full_name}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold">{doctorProfile.specialization}</p>
                <p className="text-sm text-muted-foreground">{doctorProfile.department}</p>
              </div>
              
              <div className="flex justify-between">
                <span>Experience:</span>
                <span>{doctorProfile.experience_years} years</span>
              </div>
              
              <div className="flex justify-between">
                <span>Rating:</span>
                <span>⭐ {doctorProfile.rating}/5</span>
              </div>
              
              <div className="flex justify-between">
                <span>Fee:</span>
                <span>${doctorProfile.consultation_fee}</span>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={toggleOnlineStatus}
                  className={`w-full gap-2 ${
                    doctorProfile.is_online 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  <Activity className="h-4 w-4" />
                  {doctorProfile.is_online ? 'Go Offline' : 'Go Online'}
                </Button>
                <Badge 
                  variant={doctorProfile.is_online ? "default" : "secondary"}
                  className="w-full justify-center mt-2"
                >
                  Status: {doctorProfile.is_online ? 'Online' : 'Offline'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Appointments ({appointments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No appointments scheduled for today
                </p>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{appointment.patient_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Age: {appointment.patient_age} | {appointment.appointment_time}
                          </p>
                          {appointment.symptoms && (
                            <p className="text-sm mt-2">
                              <span className="font-medium">Symptoms:</span> {appointment.symptoms}
                            </p>
                          )}
                        </div>
                        <Badge variant={
                          appointment.status === 'confirmed' ? 'default' :
                          appointment.status === 'pending' ? 'secondary' :
                          appointment.status === 'completed' ? 'outline' : 'destructive'
                        }>
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorPortal;