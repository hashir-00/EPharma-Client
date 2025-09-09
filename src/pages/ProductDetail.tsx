import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, ShoppingCart, Heart, Star, FileText, Shield, Truck, Clock, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/Layout/Layout';
import { RootState } from '@/store';
import { addToCart } from '@/store/slices/cartSlice';
import { useToast } from '@/hooks/use-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  const [quantity, setQuantity] = useState(1);
  
  const { items: products } = useSelector((state: RootState) => state.products);
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/marketplace')}>
            Back to Marketplace
          </Button>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
      pharmacy: product.pharmacy,
      requiresPrescription: product.requiresPrescription,
    }));
    
    toast({
      title: "Added to Cart",
      description: `${quantity}x ${product.name} added to your cart.`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/marketplace')} className="p-0 text-primary hover:text-primary/80">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-accent/50 rounded-xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              
              {product.genericName && (
                <p className="text-muted-foreground">Generic: {product.genericName}</p>
              )}
              
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(124 reviews)</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-primary">${product.price}</span>
                {product.dosage && (
                  <Badge variant="secondary" className="bg-accent text-foreground">
                    {product.dosage}
                  </Badge>
                )}
                {product.requiresPrescription && (
                  <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                    <FileText className="h-3 w-3 mr-1" />
                    Prescription Required
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Sold by {product.pharmacy}</span>
              </div>
              
              <Badge 
                variant={product.inStock ? "secondary" : "destructive"}
                className={product.inStock ? "bg-success/10 text-success border-success/20" : ""}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {product.manufacturer && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Manufacturer</h3>
                <p className="text-muted-foreground">{product.manufacturer}</p>
              </div>
            )}

            <Separator />

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-foreground">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-medium text-lg w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-gradient-primary hover:shadow-md transition-all duration-200"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>

              {product.requiresPrescription && (
                <Card className="border-warning/20 bg-warning/5">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <FileText className="h-5 w-5 text-warning mt-0.5" />
                      <div>
                        <p className="font-medium text-warning">Prescription Required</p>
                        <p className="text-sm text-muted-foreground">
                          This medication requires a valid prescription. You'll need to upload it during checkout.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Shipping Info */}
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Truck className="h-4 w-4 text-success" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Same-day delivery available</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Secure checkout guaranteed</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map(relatedProduct => (
                <Card 
                  key={relatedProduct.id}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-medical hover:scale-[1.02] bg-gradient-card border-border/50"
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-square bg-accent/50 rounded-lg mb-3 overflow-hidden">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-lg font-bold text-primary">${relatedProduct.price}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;