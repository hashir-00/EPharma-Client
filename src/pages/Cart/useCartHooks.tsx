import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/store";
import { CartItem, removeFromCart, updateQuantity } from "@/store/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface UseCartHooks{
    items: CartItem[];
    total: number;
    handleQuantityChange: (id: string, newQuantity: number) => void;
    handleRemoveItem: (id: string) => void;
    handleCheckout: () => void;
    prescriptionRequired: boolean;
    navigate: ReturnType<typeof useNavigate>;

}

export function useCartHooks():UseCartHooks {
      const navigate = useNavigate();
      const dispatch = useDispatch();
      const { toast } = useToast();
    
      const { items, total } = useSelector((state: RootState) => state.cart);
      const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    
      const handleQuantityChange = (id: string, newQuantity: number) => {
        if (newQuantity < 1) {
          dispatch(removeFromCart(id));
          toast({
            title: "Item Removed",
            description: "Item has been removed from your cart.",
          });
        } else {
          dispatch(updateQuantity({ id, quantity: newQuantity }));
        }
      };
    
      const handleRemoveItem = (id: string) => {
        dispatch(removeFromCart(id));
        toast({
          title: "Item Removed",
          description: "Item has been removed from your cart.",
        });
      };
    
      const handleCheckout = () => {
        if (!isAuthenticated) {
          navigate("/login");
          return;
        }
        navigate("/checkout");
      };
    
      const prescriptionRequired = items.some(item => item.requiresPrescription);

    return {
        items,
        total,
        handleQuantityChange,
        handleRemoveItem,
        handleCheckout,
        prescriptionRequired,
        navigate,
    };
}