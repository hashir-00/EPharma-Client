// Mock mode configuration
export const MOCK_MODE = import.meta.env.VITE_MOCK_MODE === "true";

// Debug logging for mock mode status
if (typeof window !== "undefined") {
  console.log("🔧 Mock Mode Debug:", {
    VITE_MOCK_MODE: import.meta.env.VITE_MOCK_MODE,
    MOCK_MODE: MOCK_MODE,
    MODE: import.meta.env.MODE,
  });
}

// Environment check utility
export const isDevelopment = import.meta.env.MODE === "development";
export const isProduction = import.meta.env.MODE === "production";

// Mock configuration options
export const mockConfig = {
  enabled: MOCK_MODE,
  delayMs: 500, // Simulate network delay
  failureRate: 0, // 0-1, chance of mock API calls failing
  logRequests: isDevelopment, // Log mock API calls in development
};
