import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout/Layout";
import heroImage from "@/assets/hero-medical.jpg";
import { useHomeHooks } from "./useHomeHooks";

const Home: React.FC = () => {
  const { navigate, isAuthenticated, features, categories } = useHomeHooks();

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative py-20 px-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-secondary/70"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Your Trusted <span className="text-warning">Health Partner</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get your medications delivered safely and quickly from verified
              pharmacies near you.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                <Input
                  placeholder="Search for medicines, health products..."
                  className="flex-1 bg-white border-0 text-foreground placeholder:text-muted-foreground"
                />
                <Button
                  onClick={() => navigate("/marketplace")}
                  className="bg-warning hover:bg-warning/90 text-warning-foreground font-semibold px-8"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Button
                    onClick={() => navigate("/register")}
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 font-semibold"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    onClick={() => navigate("/marketplace")}
                    size="lg"
                    variant="outline"
                    className="border-white text-primary hover:bg-blue-100"
                  >
                    Browse Products
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => navigate("/marketplace")}
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-semibold"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose MedSupply?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're committed to providing safe, reliable, and convenient access
              to healthcare products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-gradient-card border-border/50 hover:shadow-medical transition-all duration-300 group"
              >
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-primary p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Shop by Category
            </h2>
            <p className="text-muted-foreground text-lg">
              Find what you need from our extensive product categories
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="bg-gradient-card border-border/50 hover:shadow-medical transition-all duration-300 cursor-pointer group"
                onClick={() => navigate("/marketplace")}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.count} products
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 ${category.color} rounded-xl opacity-20 group-hover:opacity-30 transition-opacity`}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={() => navigate("/marketplace")}
              size="lg"
              className="bg-gradient-primary"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Health Journey?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust MedSupply for their
            healthcare needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Button
                  onClick={() => navigate("/register")}
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground text-primary hover:bg-primary-foreground hover:text-green-500"
                >
                  Sign Up Now
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90"
                >
                  Sign In
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/marketplace")}
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
