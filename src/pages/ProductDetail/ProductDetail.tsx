import React from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Star,
  FileText,
  Shield,
  Truck,
  Clock,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/Layout/Layout";
import {
  getPharmacyName,
  isProductInStock,
  getStockDisplay,
} from "@/store/slices/productsSlice";
import { useProductDetailHooks } from "./useProductDetailHooks";

const ProductDetail: React.FC = () => {
  const {
    navigate,
    quantity,
    product,
    handleAddToCart,
    handleQuantityChange,
  } = useProductDetailHooks();

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Product Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => navigate("/marketplace")}
            className="bg-gradient-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Button>
        </div>
      </Layout>
    );
  }

  const inStock = isProductInStock(product);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="bg-accent/50 rounded-xl overflow-hidden aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-foreground">
                    {product.name}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="text-sm font-medium">4.8</span>
                      <span className="text-sm text-muted-foreground">
                        (124 reviews)
                      </span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="text-sm text-muted-foreground">
                      {getPharmacyName(product.pharmacy)}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <p className="text-3xl font-bold text-primary">
                  ${product.price}
                </p>
                <Badge
                  variant={inStock ? "secondary" : "destructive"}
                  className={
                    inStock
                      ? "bg-success/10 text-success border-success/20"
                      : ""
                  }
                >
                  {getStockDisplay(product)}
                </Badge>
              </div>

              {/* Prescription Required */}
              {product.requiresPrescription && (
                <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-warning" />
                    <div>
                      <p className="font-medium text-warning">
                        Prescription Required
                      </p>
                      <p className="text-sm text-muted-foreground">
                        This medication requires a valid prescription from a
                        licensed healthcare provider.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                Description
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Details */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                Product Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{product.category}</p>
                </div>
                {product.dosage && (
                  <div>
                    <p className="text-sm text-muted-foreground">Dosage</p>
                    <p className="font-medium">{product.dosage}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Stock</p>
                  <p className="font-medium">{product.stockQuantity} units</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pharmacy</p>
                  <p className="font-medium">
                    {getPharmacyName(product.pharmacy)}
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(false)}
                    disabled={quantity <= 1}
                    className="h-10 w-10 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(true)}
                    disabled={quantity >= (product.stockQuantity || 10)}
                    className="h-10 w-10 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="flex-1 bg-gradient-primary hover:shadow-md transition-all duration-200"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </Button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <CardContent className="p-0">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-xs font-medium">Verified Pharmacy</p>
                </CardContent>
              </Card>
              <Card className="p-4 text-center">
                <CardContent className="p-0">
                  <Truck className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-xs font-medium">Fast Delivery</p>
                </CardContent>
              </Card>
              <Card className="p-4 text-center">
                <CardContent className="p-0">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-xs font-medium">24/7 Support</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
