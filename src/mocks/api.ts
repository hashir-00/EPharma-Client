import { mockProducts, mockCategories, mockPharmacies } from './products';
import { mockConfig } from './config';

// Utility to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Utility to simulate API failures
const shouldFail = () => Math.random() < mockConfig.failureRate;

// Mock API responses
export const mockAPI = {
  // Products API
  async getProducts(params?: {
    search?: string;
    category?: string;
    pharmacy?: string;
    page?: number;
    limit?: number;
  }) {
    if (mockConfig.logRequests) {
      console.log('Mock API: getProducts called with params:', params);
    }
    
    await delay(mockConfig.delayMs);
    
    if (shouldFail()) {
      throw new Error('Mock API: Network error');
    }

    let filtered = [...mockProducts];

    // Apply filters
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.genericName?.toLowerCase().includes(searchLower)
      );
    }

    if (params?.category) {
      filtered = filtered.filter(product => product.category === params.category);
    }

    if (params?.pharmacy) {
      filtered = filtered.filter(product => product.pharmacy === params.pharmacy);
    }

    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filtered.slice(startIndex, endIndex);

    return {
      data: {
        products: paginatedProducts,
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      }
    };
  },

  async getCategories() {
    if (mockConfig.logRequests) {
      console.log('Mock API: getCategories called');
    }
    
    await delay(mockConfig.delayMs);
    
    if (shouldFail()) {
      throw new Error('Mock API: Network error');
    }

    return {
      data: {
        categories: mockCategories
      }
    };
  },

  async getPharmacies() {
    if (mockConfig.logRequests) {
      console.log('Mock API: getPharmacies called');
    }
    
    await delay(mockConfig.delayMs);
    
    if (shouldFail()) {
      throw new Error('Mock API: Network error');
    }

    return {
      data: {
        pharmacies: mockPharmacies
      }
    };
  },

  async getProductById(id: string) {
    if (mockConfig.logRequests) {
      console.log('Mock API: getProductById called with id:', id);
    }
    
    await delay(mockConfig.delayMs);
    
    if (shouldFail()) {
      throw new Error('Mock API: Network error');
    }

    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }

    return {
      data: product
    };
  },
};
