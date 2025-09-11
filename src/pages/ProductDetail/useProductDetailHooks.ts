import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import {
  getPharmacyName,
  isProductInStock,
  getStockDisplay,
} from "@/store/slices/productsSlice";
import { useToast } from "@/hooks/use-toast";

interface UseProductDetailHooks {
  id: string | undefined;
  navigate: ReturnType<typeof useNavigate>;
  quantity: number;
  setQuantity: (quantity: number) => void;
  product: any;
  handleAddToCart: () => void;
  handleQuantityChange: (increment: boolean) => void;
}

export function useProductDetailHooks(): UseProductDetailHooks {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);

  const { items: products } = useSelector((state: RootState) => state.products);
  const product = products.find(p => p.id === id);

  const handleAddToCart = () => {
    if (!product) return;

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image,
        pharmacy: getPharmacyName(product.pharmacy),
        requiresPrescription: product.requiresPrescription,
      })
    );

    toast({
      title: "Added to Cart",
      description: `${quantity}x ${product.name} has been added to your cart.`,
    });
  };

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setQuantity(prev => Math.min(prev + 1, product?.stockQuantity || 10));
    } else {
      setQuantity(prev => Math.max(prev - 1, 1));
    }
  };

  return {
    id,
    navigate,
    quantity,
    setQuantity,
    product,
    handleAddToCart,
    handleQuantityChange,
  };
}
