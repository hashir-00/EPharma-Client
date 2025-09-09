import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Product } from '@/store/slices/productsSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      pharmacy: product.pharmacy,
      requiresPrescription: product.requiresPrescription,
    }));
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-medical hover:scale-[1.02] bg-gradient-card border-border/50"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="aspect-square bg-accent/50 rounded-lg mb-3 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            {product.requiresPrescription && (
              <Badge variant="secondary" className="ml-2 bg-warning/10 text-warning border-warning/20">
                <FileText className="h-3 w-3 mr-1" />
                Rx
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Star className="h-3 w-3 fill-warning text-warning" />
            <span>4.8 (124)</span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">{product.pharmacy}</span>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary">${product.price}</p>
              {product.dosage && (
                <p className="text-xs text-muted-foreground">{product.dosage}</p>
              )}
            </div>
            
            <Badge 
              variant={product.inStock ? "secondary" : "destructive"}
              className={product.inStock ? "bg-success/10 text-success border-success/20" : ""}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-gradient-primary hover:shadow-md transition-all duration-200"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;