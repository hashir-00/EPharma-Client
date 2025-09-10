import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { productsAPI } from "@/services/api";
import {
  mockAPI,
  mockProducts,
  mockCategories,
  mockPharmacies,
  MOCK_MODE,
} from "@/mocks";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  pharmacy: string | Pharmacy; // Allow both string (legacy) and Pharmacy object
  inStock?: boolean; // Legacy field for backward compatibility
  stockQuantity?: number; // New field from backend
  requiresPrescription: boolean;
  genericName?: string;
  dosage?: string;
  manufacturer?: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  licenseNumber: string;
  isVerified: boolean;
  isActive: boolean;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductsState {
  items: Product[];
  filteredItems: Product[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  selectedPharmacy: string;
  categories: string[];
  pharmacies: string[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    hasMore: boolean;
  };
}

const initialState: ProductsState = {
  items: [],
  filteredItems: [],
  loading: false,
  loadingMore: false,
  error: null,
  searchQuery: "",
  selectedCategory: "",
  selectedPharmacy: "",
  categories: [],
  pharmacies: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasMore: false,
  },
};

// Utility function to get pharmacy name from either string or object
export const getPharmacyName = (pharmacy: string | Pharmacy): string => {
  return typeof pharmacy === "string" ? pharmacy : pharmacy.name;
};

// Utility function to check if product is in stock (handles both legacy and new format)
export const isProductInStock = (product: Product): boolean => {
  if (product.stockQuantity !== undefined) {
    return product.stockQuantity > 0;
  }
  return product.inStock ?? false;
};

// Utility function to get stock quantity display
export const getStockDisplay = (product: Product): string => {
  if (product.stockQuantity !== undefined) {
    return product.stockQuantity > 0 ? "In Stock" : "Out of Stock";
  }
  return product.inStock ? "In Stock" : "Out of Stock";
};

// Async thunks for API calls
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (
    params: {
      search?: string;
      category?: string;
      pharmacy?: string;
      page?: number;
      limit?: number;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      // Use mock API if mock mode is enabled
      if (MOCK_MODE) {
        const response = await mockAPI.getProducts(params);
        return response.data;
      }

      const response = await productsAPI.getProducts(params);
      // Handle different response structures
      const data = response.data.data || response.data;
      return {
        products: data.products || data || [],
        total: data.total || 0,
        page: data.page || 1,
        totalPages: data.totalPages || 1,
      };
    } catch (error: unknown) {
      console.warn("Failed to fetch products from API");
      // Only fallback to mock data if mock mode is enabled
      if (MOCK_MODE) {
        console.log("Using mock data as fallback");
        return {
          products: mockProducts,
          total: mockProducts.length,
          page: 1,
          totalPages: 1,
        };
      }
      // In non-mock mode, return empty results or re-throw the error
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch products"
      );
    }
  }
);

export const loadMoreProducts = createAsyncThunk(
  "products/loadMoreProducts",
  async (
    params: {
      search?: string;
      category?: string;
      pharmacy?: string;
      page: number;
      limit?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      // Use mock API if mock mode is enabled
      if (MOCK_MODE) {
        const response = await mockAPI.getProducts(params);
        return response.data;
      }

      const response = await productsAPI.getProducts(params);
      // Handle different response structures
      const data = response.data.data || response.data;
      return {
        products: data.products || data || [],
        total: data.total || 0,
        page: data.page || 1,
        totalPages: data.totalPages || 1,
      };
    } catch (error: unknown) {
      console.warn("Failed to load more products from API");
      // In non-mock mode, return empty results or re-throw the error
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to load more products"
      );
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      // Use mock API if mock mode is enabled
      if (MOCK_MODE) {
        const response = await mockAPI.getCategories();
        return response.data.categories;
      }

      const response = await productsAPI.getCategories();
      return response.data.data?.categories || response.data.categories || [];
    } catch (error: unknown) {
      console.warn("Failed to fetch categories from API");
      // Only fallback to mock data if mock mode is enabled
      if (MOCK_MODE) {
        console.log("Using mock categories as fallback");
        return mockCategories;
      }
      // In non-mock mode, return empty array or re-throw the error
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch categories"
      );
    }
  }
);

export const fetchPharmacies = createAsyncThunk(
  "products/fetchPharmacies",
  async (_, { rejectWithValue }) => {
    try {
      // Use mock API if mock mode is enabled
      if (MOCK_MODE) {
        const response = await mockAPI.getPharmacies();
        return response.data.pharmacies;
      }

      const response = await productsAPI.getPharmacies();
      return response.data.data?.pharmacies || response.data.pharmacies || [];
    } catch (error: unknown) {
      console.warn("Failed to fetch pharmacies from API");
      // Only fallback to mock data if mock mode is enabled
      if (MOCK_MODE) {
        console.log("Using mock pharmacies as fallback");
        return mockPharmacies;
      }
      // In non-mock mode, return empty array or re-throw the error
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch pharmacies"
      );
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
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
    clearFilters: state => {
      state.searchQuery = "";
      state.selectedCategory = "";
      state.selectedPharmacy = "";
      state.filteredItems = state.items;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const products = action.payload.products || action.payload || [];
        state.items = products;
        state.filteredItems = filterProducts(state);
        // Update pagination info
        state.pagination.currentPage = action.payload.page || 1;
        state.pagination.totalPages = action.payload.totalPages || 1;
        state.pagination.total = action.payload.total || products.length;
        state.pagination.hasMore =
          state.pagination.currentPage < state.pagination.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Only use mock data as fallback if mock mode is enabled
        if (MOCK_MODE) {
          state.items = mockProducts;
        } else {
          state.items = []; // Keep empty array when API fails in non-mock mode
        }
        state.filteredItems = filterProducts(state);
      })
      // Load More Products
      .addCase(loadMoreProducts.pending, state => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreProducts.fulfilled, (state, action) => {
        state.loadingMore = false;
        const products = action.payload.products || action.payload || [];
        state.items = [...state.items, ...products];
        state.filteredItems = filterProducts(state);
        // Update pagination info
        state.pagination.currentPage = action.payload.page || 1;
        state.pagination.totalPages = action.payload.totalPages || 1;
        state.pagination.total = action.payload.total || products.length;
        state.pagination.hasMore =
          state.pagination.currentPage < state.pagination.totalPages;
      })
      .addCase(loadMoreProducts.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.payload as string;
        // Only use mock data as fallback if mock mode is enabled
        if (MOCK_MODE) {
          state.items = mockProducts;
        } else {
          state.items = []; // Keep empty array when API fails in non-mock mode
        }
        state.filteredItems = filterProducts(state);
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload as string;
        // Only use mock data as fallback if mock mode is enabled
        if (MOCK_MODE) {
          state.categories = mockCategories;
        } else {
          state.categories = []; // Keep empty array when API fails in non-mock mode
        }
      })
      // Fetch Pharmacies
      .addCase(fetchPharmacies.fulfilled, (state, action) => {
        state.pharmacies = action.payload;
      })
      .addCase(fetchPharmacies.rejected, (state, action) => {
        state.error = action.payload as string;
        // Only use mock data as fallback if mock mode is enabled
        if (MOCK_MODE) {
          state.pharmacies = [];
        } else {
          state.pharmacies = []; // Keep empty array when API fails in non-mock mode
        }
      });
  },
});

const filterProducts = (state: ProductsState) => {
  let filtered = [...state.items];

  if (state.searchQuery) {
    filtered = filtered.filter(
      product =>
        product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(state.searchQuery.toLowerCase())
    );
  }

  if (state.selectedCategory) {
    filtered = filtered.filter(
      product => product.category === state.selectedCategory
    );
  }

  if (state.selectedPharmacy) {
    filtered = filtered.filter(
      product => getPharmacyName(product.pharmacy) === state.selectedPharmacy
    );
  }

  return filtered;
};

export const {
  setSearchQuery,
  setSelectedCategory,
  setSelectedPharmacy,
  clearFilters,
} = productsSlice.actions;
export default productsSlice.reducer;
