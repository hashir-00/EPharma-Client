import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store";
import { createOrder } from "@/store/slices/ordersSlice";
import { clearCart } from "@/store/slices/cartSlice";
import { useToast } from "@/hooks/use-toast";

// Types and Interfaces
export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CheckoutFormData {
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  prescriptionUploaded: boolean;
}

export interface CheckoutState {
  loading: boolean;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  prescriptionUploaded: boolean;
  prescriptionRequired: boolean;
  taxAmount: number;
  finalTotal: number;
}

export interface CheckoutActions {
  handleAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStateChange: (value: string) => void;
  handlePaymentMethodChange: (value: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePlaceOrder: (e: React.FormEvent) => Promise<void>;
  goBack: () => void;
  triggerFileUpload: () => void;
}

export interface CheckoutHookReturn {
  state: CheckoutState;
  actions: CheckoutActions;
  data: {
    items: any[];
    total: number;
    user: any;
  };
}

// Custom hook for checkout functionality
export const useCheckoutHooks = (): CheckoutHookReturn => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { items, total } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);

  // Function to safely parse address
  const parseUserAddress = (addressString?: string): ShippingAddress => {
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

  // State
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(() => {
    const parsed = parseUserAddress(user?.address);
    return parsed;
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);

  // Derived state
  const prescriptionRequired = items.some(item => item.requiresPrescription);
  const taxAmount = total * 0.08;
  const finalTotal = total + taxAmount;

  // Actions
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStateChange = (value: string) => {
    setShippingAddress(prev => ({ ...prev, state: value }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
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

  const goBack = () => {
    navigate("/cart");
  };

  const triggerFileUpload = () => {
    document.getElementById("prescription-upload")?.click();
  };

  // Check if cart is empty and redirect
  if (items.length === 0) {
    navigate("/cart");
    return null as any;
  }

  return {
    state: {
      loading,
      shippingAddress,
      paymentMethod,
      prescriptionUploaded,
      prescriptionRequired,
      taxAmount,
      finalTotal,
    },
    actions: {
      handleAddressChange,
      handleStateChange,
      handlePaymentMethodChange,
      handleFileUpload,
      handlePlaceOrder,
      goBack,
      triggerFileUpload,
    },
    data: {
      items,
      total,
      user,
    },
  };
};
