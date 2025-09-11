import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  pharmacy: string;
  requiresPrescription: boolean;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

const calculateTotal = (items: CartItem[]) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const addToLocalStorage = (itemID: string, quantity: number) => {
  const sessionId = localStorage.getItem("sessionId");
  const cartitem = `${itemID}:${quantity}`;
  const existingCart = localStorage.getItem("cart");
  if (existingCart) {
    const existingItems = existingCart.split("/")[1].split(",").filter(item => !item.startsWith(itemID + ":"));
    const updatedItems = [...existingItems, cartitem];
    const updatedCart = `${existingCart.split("/")[0]}/${updatedItems.join(",")}`;
    localStorage.setItem("cart", updatedCart);
  } else {
    localStorage.setItem("cart", `${sessionId}/${cartitem}`);
  }
};

const removeFromLocalStorage = (itemID: string) => {
  const existingCart = localStorage.getItem("cart");
  if (existingCart) {
    const items = existingCart.split("/")[1].split(",");
    const filteredItems = items.filter(item => !item.startsWith(itemID + ":"));
    localStorage.setItem("cart", `${existingCart.split("/")[0]}/${filteredItems.join(",")}`);
  }
};

const extractItemsFromLocalStorage = ()=>{
  const existingCart = localStorage.getItem("cart");
  if (existingCart) {
    const items = existingCart.split("/")[1].split(",");
    return items.map(item => {
      const [id, quantity] = item.split(":");
      return { id, quantity: parseInt(quantity, 10) };
    });
  }
  return [];
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        item => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      addToLocalStorage(action.payload.id, action.payload.quantity);
      state.total = calculateTotal(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      removeFromLocalStorage(action.payload);
      state.total = calculateTotal(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i.id !== action.payload.id);
        }
      }
      addToLocalStorage(action.payload.id, action.payload.quantity);
      state.total = calculateTotal(state.items);
    },
    clearCart: state => {
      state.items = [];
      localStorage.removeItem("cart");
      state.total = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
