import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Search, Shield, Clock, Truck, Star } from "lucide-react";

interface Feature {
  icon: typeof Shield;
  title: string;
  description: string;
}

interface Category {
  name: string;
  count: string;
  color: string;
}

interface UseHomeHooks {
  navigate: ReturnType<typeof useNavigate>;
  isAuthenticated: boolean;
  features: Feature[];
  categories: Category[];
}

export function useHomeHooks(): UseHomeHooks {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const features: Feature[] = [
    {
      icon: Shield,
      title: "Verified Pharmacies",
      description: "All our partner pharmacies are licensed and certified",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support for your needs",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Same-day delivery available in most areas",
    },
  ];

  const categories: Category[] = [
    { name: "Prescription Drugs", count: "500+", color: "bg-primary" },
    { name: "Over-the-Counter", count: "800+", color: "bg-secondary" },
    { name: "Vitamins & Supplements", count: "300+", color: "bg-warning" },
    { name: "Medical Devices", count: "200+", color: "bg-success" },
  ];

  return {
    navigate,
    isAuthenticated,
    features,
    categories,
  };
}
