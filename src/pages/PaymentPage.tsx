import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Smartphone, Banknote, CheckCircle } from "lucide-react";

interface ConfirmationData {
  bookingId: string;
  doctorName: string;
  date: string;
  time: string;
  patientName: string;
  consultationFee: number;
  gst: number;
  totalAmount: number;
}

const paymentMethods = [
  { id: "card", name: "Credit/Debit Card", icon: CreditCard, description: "Visa, Mastercard, RuPay" },
  { id: "upi", name: "UPI Payment", icon: Smartphone, description: "PhonePe, GooglePay, Paytm" },
  { id: "cash", name: "Cash Payment", icon: Banknote, description: "Pay at reception counter" }
];

const PaymentPage = () => {
  const navigate = useNavigate();
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("confirmationData");
    if (storedData) {
      setConfirmationData(JSON.parse(storedData));
    } else {
      navigate("/confirmation");
    }
  }, [navigate]);

  const handlePayment = async () => {
    if (!selectedPayment) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const prescriptionData = {
        ...confirmationData,
        paymentMethod: selectedPayment,
        paymentStatus: "completed",
        prescriptionId: "RX" + Date.now().toString().slice(-6)
      };
      localStorage.setItem("prescriptionData", JSON.stringify(prescriptionData));
      setIsProcessing(false);
      navigate("/prescription");
    }, 2000);
  };

  if (!confirmationData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
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
          onClick={() => navigate("/confirmation")}
          className="mb-8"
          disabled={isProcessing}
        >
          <ArrowLeft className="mr-2" />
          Back to Confirmation
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Payment</h1>
          <p className="text-xl text-muted-foreground">Choose your preferred payment method</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="border-2 sticky top-6">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-xl">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Booking ID</span>
                    <span className="font-mono font-bold">{confirmationData.bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Doctor</span>
                    <span className="font-semibold">{confirmationData.doctorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Patient</span>
                    <span className="font-semibold">{confirmationData.patientName}</span>
                  </div>
                </div>
                
                <hr className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Consultation Fee</span>
                    <span>₹{confirmationData.consultationFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>₹{confirmationData.gst}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span className="text-success">-₹0</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Grand Total</span>
                    <span className="text-primary">₹{confirmationData.totalAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Select Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <Card
                      key={method.id}
                      className={`cursor-pointer transition-all duration-200 border-2 ${
                        selectedPayment === method.id 
                          ? 'border-primary bg-primary/5 shadow-lg' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedPayment(method.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            selectedPayment === method.id ? 'bg-primary text-primary-foreground' : 'bg-accent'
                          }`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold">{method.name}</h3>
                            <p className="text-muted-foreground">{method.description}</p>
                          </div>
                          {selectedPayment === method.id && (
                            <CheckCircle className="w-6 h-6 text-success" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <Button
                onClick={handlePayment}
                disabled={!selectedPayment || isProcessing}
                size="kiosk"
                className="px-16"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing Payment...
                  </div>
                ) : (
                  `Pay ₹${confirmationData.totalAmount}`
                )}
              </Button>
              
              {selectedPayment && !isProcessing && (
                <p className="text-sm text-muted-foreground mt-4">
                  Secure payment powered by industry-standard encryption
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;