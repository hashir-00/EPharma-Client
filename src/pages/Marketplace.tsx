import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Filter, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout/Layout';
import ProductCard from '@/components/ProductCard';
import { RootState } from '@/store';
import { setSearchQuery, setSelectedCategory, setSelectedPharmacy } from '@/store/slices/productsSlice';

const Marketplace: React.FC = () => {
  const dispatch = useDispatch();
  const { filteredItems, searchQuery, selectedCategory, selectedPharmacy, loading } = useSelector(
    (state: RootState) => state.products
  );

  const categories = ['Pain Relief', 'Blood Pressure', 'Vitamins', 'Antibiotics', 'Diabetes'];
  const pharmacies = ['MedMart Pharmacy', 'HealthPlus Pharmacy', 'WellCare Pharmacy', 'CityMed Pharmacy'];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Medical Supplies Marketplace</h1>
          <p className="text-muted-foreground">
            Discover quality medicines and health products from trusted pharmacies
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gradient-card rounded-xl p-6 mb-8 border border-border/50 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search medicines, health products..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="pl-10 bg-background/50"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={(value) => dispatch(setSelectedCategory(value))}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Pharmacy Filter */}
            <Select value={selectedPharmacy} onValueChange={(value) => dispatch(setSelectedPharmacy(value))}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="All Pharmacies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Pharmacies</SelectItem>
                {pharmacies.map(pharmacy => (
                  <SelectItem key={pharmacy} value={pharmacy}>{pharmacy}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {searchQuery && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Search: "{searchQuery}"
                <button 
                  onClick={() => dispatch(setSearchQuery(''))}
                  className="ml-2 text-primary/70 hover:text-primary"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                Category: {selectedCategory}
                <button 
                  onClick={() => dispatch(setSelectedCategory(''))}
                  className="ml-2 text-secondary/70 hover:text-secondary"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedPharmacy && (
              <Badge variant="secondary" className="bg-success/10 text-success">
                Pharmacy: {selectedPharmacy}
                <button 
                  onClick={() => dispatch(setSelectedPharmacy(''))}
                  className="ml-2 text-success/70 hover:text-success"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {filteredItems.length} Products Found
            </h2>
            <p className="text-sm text-muted-foreground">
              Showing results for your search
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Sort
            </Button>
            <div className="flex border rounded-md">
              <Button variant="ghost" size="sm" className="border-r">
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-accent/50 rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-accent/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse our categories
            </p>
            <Button 
              onClick={() => {
                dispatch(setSearchQuery(''));
                dispatch(setSelectedCategory(''));
                dispatch(setSelectedPharmacy(''));
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {filteredItems.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Marketplace;