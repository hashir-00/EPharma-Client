import React from "react";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  ShoppingBag,
  RefreshCw,
  Star,
  FileText,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout/Layout";
import ProductCard from "@/components/ProductCard";
import { useMarketplaceHooks } from "./useMarketplaceHooks";
import {
  getPharmacyName,
  isProductInStock,
  getStockDisplay,
} from "@/store/slices/productsSlice";

const Marketplace: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    filteredItems,
    searchQuery,
    selectedCategory,
    selectedPharmacy,
    loading,
    loadingMore,
    categories,
    pagination,
    formattedPharmacies,
    handleLoadMore,
    handleSearchChange,
    handleCategoryChange,
    handlePharmacyChange,
    handleAddToCart,
    clearFilter,
    navigate,
  } = useMarketplaceHooks();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Medical Supplies Marketplace
          </h1>
          <p className="text-muted-foreground">
            Discover quality medicines and health products from trusted
            pharmacies
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
                onChange={e => handleSearchChange(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory || "all"}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories && categories.length > 0 ? (
                  categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-categories" disabled>
                    No categories available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            {/* Pharmacy Filter */}
            <Select
              value={selectedPharmacy || "all"}
              onValueChange={handlePharmacyChange}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="All Pharmacies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pharmacies</SelectItem>
                {formattedPharmacies && formattedPharmacies.length > 0 ? (
                  formattedPharmacies.map(pharmacy => (
                    <SelectItem key={pharmacy.id} value={pharmacy.name}>
                      {pharmacy.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-pharmacies" disabled>
                    No pharmacies available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {searchQuery && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Search: "{searchQuery}"
                <button
                  onClick={() => clearFilter('search')}
                  className="ml-2 text-primary/70 hover:text-primary"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedCategory && (
              <Badge
                variant="secondary"
                className="bg-secondary/10 text-secondary"
              >
                Category: {selectedCategory}
                <button
                  onClick={() => clearFilter('category')}
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
                  onClick={() => clearFilter('pharmacy')}
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
              {loading
                ? "Loading..."
                : `${filteredItems?.length || 0} Products Found`}
            </h2>
            <p className="text-sm text-muted-foreground">
              {loading
                ? "Please wait while we fetch products..."
                : "Showing results for your search"}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Sort
            </Button>
            <div className="flex border rounded-md">
              <Button 
                variant={viewMode === 'grid' ? "default" : "ghost"} 
                size="sm" 
                className="border-r"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? "default" : "ghost"} 
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Display */}
        {loading ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={viewMode === 'grid' 
                  ? "bg-accent/50 rounded-lg h-96 animate-pulse"
                  : "bg-accent/50 rounded-lg h-32 animate-pulse"
                }
              />
            ))}
          </div>
        ) : filteredItems && filteredItems.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map(product => (
                <div 
                  key={product.id} 
                  className="bg-gradient-card rounded-xl border border-border/50 shadow-sm hover:shadow-medical transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="flex items-center p-6 space-x-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-24 h-24 bg-accent/50 rounded-lg overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        {product.requiresPrescription && (
                          <Badge
                            variant="secondary"
                            className="ml-2 bg-warning/10 text-warning border-warning/20"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Rx
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {product.description}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-warning text-warning" />
                          <span>4.8 (124)</span>
                        </div>
                        <span className="font-medium">
                          {getPharmacyName(product.pharmacy)}
                        </span>
                        {product.dosage && (
                          <span>{product.dosage}</span>
                        )}
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex-shrink-0 text-right space-y-3">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          ${product.price}
                        </p>
                        <Badge
                          variant={isProductInStock(product) ? "secondary" : "destructive"}
                          className={
                            isProductInStock(product)
                              ? "bg-success/10 text-success border-success/20"
                              : ""
                          }
                        >
                          {getStockDisplay(product)}
                        </Badge>
                      </div>
                      
                      <Button
                        className="bg-gradient-primary hover:shadow-md transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            quantity: 1,
                            image: product.image,
                            pharmacy: getPharmacyName(product.pharmacy),
                            requiresPrescription: product.requiresPrescription,
                          });
                        }}
                        disabled={!product.stockQuantity || product.stockQuantity <= 0}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <div className="bg-gradient-to-r from-accent/30 to-accent/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              {searchQuery || selectedCategory || selectedPharmacy ? (
                <Search className="h-12 w-12 text-muted-foreground" />
              ) : (
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              {searchQuery || selectedCategory || selectedPharmacy
                ? "No products match your criteria"
                : "No products available"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery || selectedCategory || selectedPharmacy
                ? "Try adjusting your search criteria or browse our available categories and pharmacies"
                : "We are currently updating our inventory. Please check back later or contact support for assistance."}
            </p>
            {(searchQuery || selectedCategory || selectedPharmacy) && (
              <Button
                onClick={() => {
                  clearFilter('search');
                  clearFilter('category');
                  clearFilter('pharmacy');
                }}
                className="mr-3"
              >
                Clear All Filters
              </Button>
            )}
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </Button>
          </div>
        )}

        {/* Load More */}
        {filteredItems && filteredItems.length > 0 && pagination.hasMore && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Loading More...
                </>
              ) : (
                "Load More Products"
              )}
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Marketplace;
