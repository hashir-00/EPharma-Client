import { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "@/store";
import {
  setSearchQuery,
  setSelectedCategory,
  setSelectedPharmacy,
  fetchProducts,
  fetchCategories,
  fetchPharmacies,
  loadMoreProducts,
} from "@/store/slices/productsSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { useToast } from "@/hooks/use-toast";

interface UseMarketplaceHooks {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  filteredItems: any[];
  searchQuery: string;
  selectedCategory: string;
  selectedPharmacy: string;
  loading: boolean;
  loadingMore: boolean;
  categories: string[];
  pharmacies: string[];
  pagination: any;
  formattedPharmacies: Array<{ id: string; name: string }>;
  handleLoadMore: () => void;
  handleSearchChange: (value: string) => void;
  handleCategoryChange: (value: string) => void;
  handlePharmacyChange: (value: string) => void;
  handleAddToCart: (product: any) => void;
  clearFilter: (filterType: 'search' | 'category' | 'pharmacy') => void;
  navigate: ReturnType<typeof useNavigate>;
}

export function useMarketplaceHooks(): UseMarketplaceHooks {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const {
    filteredItems,
    searchQuery,
    selectedCategory,
    selectedPharmacy,
    loading,
    loadingMore,
    categories,
    pharmacies,
    pagination,
  } = useSelector((state: RootState) => state.products);

  // Load initial data
  useEffect(() => {
    dispatch(fetchPharmacies());
    dispatch(fetchProducts({}));
    dispatch(fetchCategories());
  }, [dispatch]);

  // Debounced search effect to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery || selectedCategory || selectedPharmacy) {
        dispatch(
          fetchProducts({
            search: searchQuery,
            category: selectedCategory,
            pharmacy: selectedPharmacy,
            page: 1, // Reset to first page when filters change
          })
        );
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [dispatch, searchQuery, selectedCategory, selectedPharmacy]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && pagination.hasMore) {
      dispatch(
        loadMoreProducts({
          search: searchQuery,
          category: selectedCategory,
          pharmacy: selectedPharmacy,
          page: pagination.currentPage + 1,
          limit: 20,
        })
      );
    }
  }, [
    dispatch,
    loadingMore,
    pagination.hasMore,
    pagination.currentPage,
    searchQuery,
    selectedCategory,
    selectedPharmacy,
  ]);

  const handleSearchChange = (value: string) => {
    dispatch(setSearchQuery(value));
  };

  const handleCategoryChange = (value: string) => {
    dispatch(setSelectedCategory(value === "all" ? "" : value));
  };

  const handlePharmacyChange = (value: string) => {
    dispatch(setSelectedPharmacy(value === "all" ? "" : value));
  };

  const handleAddToCart = (product: any) => {
    dispatch(addToCart(product));
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const clearFilter = (filterType: 'search' | 'category' | 'pharmacy') => {
    switch (filterType) {
      case 'search':
        dispatch(setSearchQuery(""));
        break;
      case 'category':
        dispatch(setSelectedCategory(""));
        break;
      case 'pharmacy':
        dispatch(setSelectedPharmacy(""));
        break;
    }
  };

  const formattedPharmacies = pharmacies.map((pharmacy: string, index) => ({
    id: index.toString(),
    name: pharmacy || "Unnamed Pharmacy",
  }));

  return {
    viewMode,
    setViewMode,
    filteredItems,
    searchQuery,
    selectedCategory,
    selectedPharmacy,
    loading,
    loadingMore,
    categories,
    pharmacies,
    pagination,
    formattedPharmacies,
    handleLoadMore,
    handleSearchChange,
    handleCategoryChange,
    handlePharmacyChange,
    handleAddToCart,
    clearFilter,
    navigate,
  };
}
