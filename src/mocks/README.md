# Mock Data Configuration

This folder contains mock data and configuration for development and testing purposes.

## Files

- `config.ts` - Mock mode configuration and environment settings
- `products.ts` - Mock product, category, and pharmacy data
- `api.ts` - Mock API implementation
- `index.ts` - Main exports for the mocks module

## Usage

### Environment Variables

Set `VITE_MOCK_MODE=true` in your `.env` file to enable mock mode.

### Development vs Production

- **Development**: Use `.env.development` with `VITE_MOCK_MODE=true` for offline development
- **Production**: Use `.env` with `VITE_MOCK_MODE=false` for real API calls

### Mock Configuration

You can customize mock behavior in `config.ts`:

```typescript
export const mockConfig = {
  enabled: MOCK_MODE,
  delayMs: 500, // Simulate network delay
  failureRate: 0, // 0-1, chance of mock API calls failing
  logRequests: isDevelopment, // Log mock API calls in development
};
```

### Adding New Mock Data

1. Add your mock data to the appropriate file (e.g., `products.ts`)
2. Update the mock API implementation in `api.ts`
3. Export new data from `index.ts`

## Benefits

- **Offline Development**: Work without backend dependency
- **Testing**: Predictable data for testing scenarios
- **Performance**: Faster development iteration
- **Reliability**: No network-related failures during development
