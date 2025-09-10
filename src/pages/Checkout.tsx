import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  FileText,
  MapPin,
  Upload,
  Shield,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout/Layout";
import { RootState } from "@/store";
import { createOrder } from "@/store/slices/ordersSlice";
import { clearCart } from "@/store/slices/cartSlice";
import { useToast } from "@/hooks/use-toast";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { items, total } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);

    // Function to safely parse address
  const parseUserAddress = (addressString?: string) => {
    if (!addressString) {
      return {
        street: "",
        city: "",
        state: "",
        zipCode: "",
      };
    }

    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(addressString);
      return {
        street: parsed.street || "",
        city: parsed.city || "",
        state: parsed.state || "",
        zipCode: parsed.zipCode || "",
      };
    } catch {
      // If JSON parsing fails, treat as a simple string
      return {
        street: addressString,
        city: "",
        state: "",
        zipCode: "",
      };
    }
  };

  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address ? parseUserAddress(user.address).street : "",
    city: user?.address ? parseUserAddress(user.address).city : "",
    state: user?.address ? parseUserAddress(user.address).state : "",
    zipCode: user?.address ? parseUserAddress(user.address).zipCode : "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);

  const prescriptionRequired = items.some(item => item.requiresPrescription);
  const taxAmount = total * 0.08;
  const finalTotal = total + taxAmount;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrescriptionUploaded(true);
      toast({
        title: "Prescription Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (prescriptionRequired && !prescriptionUploaded) {
      toast({
        title: "Prescription Required",
        description:
          "Please upload your prescription before placing the order.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Mock order placement
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newOrder = {
        items,
        total: finalTotal,
        shippingAddress,
        prescriptionUploaded,
        estimatedDelivery: new Date(
          Date.now() + 3 * 24 * 60 * 60 * 1000
        ).toISOString(), // 3 days from now
      };

      dispatch(createOrder(newOrder));
      dispatch(clearCart());

      toast({
        title: "Order Placed Successfully!",
        description:
          "Your order has been placed and you will receive a confirmation email shortly.",
      });

      navigate("/orders");
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/cart")}
            className="p-0 text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Checkout</h1>

            {/* Shipping Address */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleAddressChange}
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select
                      value={shippingAddress.state}
                      onValueChange={value =>
                        setShippingAddress(prev => ({ ...prev, state: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={handleAddressChange}
                    placeholder="12345"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Prescription Upload */}
            {prescriptionRequired && (
              <Card className="bg-gradient-card border-warning/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-warning">
                    <FileText className="mr-2 h-5 w-5" />
                    Prescription Required
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-warning/5 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                    <div>
                      <p className="font-medium text-warning">
                        Upload Required
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Some items in your cart require a valid prescription.
                        Please upload it to proceed.
                      </p>
                    </div>
                  </div>

                  <div className="text-center p-6 border-2 border-dashed border-border rounded-lg">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload prescription (PDF, JPG, PNG)
                    </p>
                    <input
                      type="file"
                      id="prescription-upload"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant={prescriptionUploaded ? "default" : "outline"}
                      onClick={() =>
                        document.getElementById("prescription-upload")?.click()
                      }
                      className={
                        prescriptionUploaded
                          ? "bg-success text-success-foreground"
                          : ""
                      }
                    >
                      {prescriptionUploaded
                        ? "Prescription Uploaded ✓"
                        : "Choose File"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Method */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                  </SelectContent>
                </Select>

                {paymentMethod === "card" && (
                  <div className="space-y-4 p-4 bg-accent/30 rounded-lg">
                    <p className="text-sm text-muted-foreground font-medium">
                      Card Information (Demo)
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="1234 5678 9012 3456" disabled />
                      <Input placeholder="MM/YY" disabled />
                    </div>
                    <Input placeholder="CVV" disabled />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-gradient-card border-border/50 sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-accent/50 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                        {item.requiresPrescription && (
                          <Badge
                            variant="secondary"
                            className="bg-warning/10 text-warning border-warning/20 mt-1"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Rx
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Total */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({items.length} items)</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${finalTotal.toFixed(2)}</span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={
                    loading || (prescriptionRequired && !prescriptionUploaded)
                  }
                  className="w-full bg-gradient-primary hover:shadow-md transition-all duration-200"
                  size="lg"
                >
                  {loading ? "Processing..." : "Place Order"}
                </Button>

                <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>Secure checkout guaranteed</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
