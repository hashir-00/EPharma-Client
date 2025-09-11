import React from "react";
import { Eye, CheckCircle, Clock, Truck, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/Layout/Layout";
import { useOrdersHooks } from "./useOrdersHooks";
import { Order } from "@/store/slices/ordersSlice";

const Orders: React.FC = () => {
  const {
    navigate,
    orders,
    getStatusColor,
    formatDate,
  } = useOrdersHooks();

    const getStatusIcon = (status: Order["status"]) => {
      switch (status) {
        case "Pending":
          return <Clock className="h-4 w-4" />;
        case "Approved":
          return <CheckCircle className="h-4 w-4" />;
        case "Shipped":
          return <Truck className="h-4 w-4" />;
        case "Delivered":
          return <Package className="h-4 w-4" />;
        default:
          return <Clock className="h-4 w-4" />;
      }
    };
  
  if (orders.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-accent/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              No orders yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Start shopping for health products and track your orders here
            </p>
            <Button
              onClick={() => navigate("/marketplace")}
              className="bg-gradient-primary"
            >
              Browse Products
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
          <p className="text-muted-foreground">
            Track and manage your medication and health product orders
          </p>
        </div>

        <div className="space-y-6">
          {orders.map(order => (
            <Card key={order.id} className="bg-gradient-card border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(order.status)}
                  >
                    {getStatusIcon(order.status)}
                    <span className="ml-2">{order.status}</span>
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Placed on {formatDate(order.orderDate)}</span>
                  {order.estimatedDelivery && (
                    <>
                      <Separator orientation="vertical" className="h-4" />
                      <span>
                        Estimated delivery:{" "}
                        {formatDate(order.estimatedDelivery)}
                      </span>
                    </>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {order.items.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-3 bg-accent/30 rounded-lg"
                    >
                      <div className="w-16 h-16 bg-accent/50 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {item.pharmacy}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="bg-accent/20 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">
                      Total Amount
                    </span>
                    <span className="text-xl font-bold text-primary">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">
                    Shipping Address
                  </h4>
                  <div className="text-sm text-muted-foreground">
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.zipCode}
                    </p>
                  </div>
                </div>

                {/* Prescription Status */}
                {order.items.some(item => item.requiresPrescription) && (
                  <div className="p-3 bg-warning/5 border border-warning/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {order.prescriptionUploaded ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span className="text-sm text-success">
                            Prescription verified
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 text-warning" />
                          <span className="text-sm text-warning">
                            Prescription pending verification
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Order Actions */}
                <div className="flex space-x-3 pt-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  {order.status === "Delivered" && (
                    <Button variant="outline" size="sm">
                      Reorder
                    </Button>
                  )}
                  {order.status !== "Delivered" &&
                    order.status !== "Shipped" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        Cancel Order
                      </Button>
                    )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order History Stats */}
        <Card className="mt-8 bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {orders.length}
                </p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">
                  {orders.filter(o => o.status === "Delivered").length}
                </p>
                <p className="text-sm text-muted-foreground">Delivered</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">
                  {orders.filter(o => o.status === "Shipped").length}
                </p>
                <p className="text-sm text-muted-foreground">In Transit</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">
                  {
                    orders.filter(
                      o => o.status === "Pending" || o.status === "Approved"
                    ).length
                  }
                </p>
                <p className="text-sm text-muted-foreground">Processing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Orders;
