import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/store";
import { Order } from "@/store/slices/ordersSlice";


interface UseOrdersHooks {
  navigate: ReturnType<typeof useNavigate>;
  orders: Order[];
 
  getStatusColor: (status: Order["status"]) => string;
  formatDate: (dateString: string) => string;
}

export function useOrdersHooks(): UseOrdersHooks {
  const navigate = useNavigate();
  const { orders } = useSelector((state: RootState) => state.orders);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "Approved":
        return "bg-primary/10 text-primary border-primary/20";
      case "Shipped":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "Delivered":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return {
    navigate,
    orders,
    getStatusColor,
    formatDate,
  };
}
