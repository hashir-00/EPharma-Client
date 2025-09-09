import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  pharmacy: string;
  inStock: boolean;
  requiresPrescription: boolean;
  genericName?: string;
  dosage?: string;
  manufacturer: string;
}

interface ProductsState {
  items: Product[];
  filteredItems: Product[];
  loading: boolean;
  searchQuery: string;
  selectedCategory: string;
  selectedPharmacy: string;
}

// Mock products data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Aspirin 325mg',
    description: 'Pain reliever and fever reducer',
    price: 8.99,
    image: '/placeholder.svg',
    category: 'Pain Relief',
    pharmacy: 'MedMart Pharmacy',
    inStock: true,
    requiresPrescription: false,
    genericName: 'Acetylsalicylic Acid',
    dosage: '325mg',
    manufacturer: 'Bayer',
  },
  {
    id: '2',
    name: 'Lisinopril 10mg',
    description: 'ACE inhibitor for blood pressure',
    price: 15.50,
    image: '/placeholder.svg',
    category: 'Blood Pressure',
    pharmacy: 'HealthPlus Pharmacy',
    inStock: true,
    requiresPrescription: true,
    genericName: 'Lisinopril',
    dosage: '10mg',
    manufacturer: 'Prinivil',
  },
  {
    id: '3',
    name: 'Vitamin D3 1000 IU',
    description: 'Essential vitamin supplement',
    price: 12.99,
    image: '/placeholder.svg',
    category: 'Vitamins',
    pharmacy: 'WellCare Pharmacy',
    inStock: true,
    requiresPrescription: false,
    dosage: '1000 IU',
    manufacturer: 'Nature Made',
  },
];

const initialState: ProductsState = {
  items: mockProducts,
  filteredItems: mockProducts,
  loading: false,
  searchQuery: '',
  selectedCategory: '',
  selectedPharmacy: '',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      state.filteredItems = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredItems = filterProducts(state);
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      state.filteredItems = filterProducts(state);
    },
    setSelectedPharmacy: (state, action: PayloadAction<string>) => {
      state.selectedPharmacy = action.payload;
      state.filteredItems = filterProducts(state);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

const filterProducts = (state: ProductsState) => {
  let filtered = [...state.items];
  
  if (state.searchQuery) {
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(state.searchQuery.toLowerCase())
    );
  }
  
  if (state.selectedCategory) {
    filtered = filtered.filter(product => product.category === state.selectedCategory);
  }
  
  if (state.selectedPharmacy) {
    filtered = filtered.filter(product => product.pharmacy === state.selectedPharmacy);
  }
  
  return filtered;
};

export const { setProducts, setSearchQuery, setSelectedCategory, setSelectedPharmacy, setLoading } = productsSlice.actions;
export default productsSlice.reducer;