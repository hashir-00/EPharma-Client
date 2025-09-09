import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Shield, Clock, Truck, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout/Layout';
import heroImage from '@/assets/hero-medical.jpg';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'Verified Pharmacies',
      description: 'All our partner pharmacies are licensed and certified'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for your needs'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Same-day delivery available in most areas'
    },
  ];

  const categories = [
    { name: 'Prescription Drugs', count: '500+', color: 'bg-primary' },
    { name: 'Over-the-Counter', count: '800+', color: 'bg-secondary' },
    { name: 'Vitamins & Supplements', count: '300+', color: 'bg-warning' },
    { name: 'Medical Devices', count: '200+', color: 'bg-success' },
  ];

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
            <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground drop-shadow-lg">
              Your Trusted Medical Supplies Marketplace
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto drop-shadow">
              Find and order prescription medications, health products, and medical supplies from verified pharmacies near you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search medicines, health products..."
                  className="pl-10 h-12 bg-background/90 backdrop-blur border-border/50"
                />
              </div>
              <Button 
                size="lg" 
                className="bg-background text-primary hover:bg-background/90 shadow-lg"
                onClick={() => navigate('/marketplace')}
              >
                Search Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-primary-foreground/80">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>
              <span>Trusted by 10,000+ customers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-accent/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose MedSupply?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing safe, reliable, and convenient access to medical supplies
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 bg-gradient-card border-border/50 hover:shadow-medical transition-all duration-300">
                <CardContent className="space-y-4">
                  <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Browse Categories</h2>
            <p className="text-muted-foreground">Find what you need across our comprehensive product range</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className="group cursor-pointer hover:shadow-medical transition-all duration-300 bg-gradient-card border-border/50"
                onClick={() => navigate('/marketplace')}
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className={`w-12 h-12 rounded-full ${category.color} mx-auto opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{category.name}</h3>
                  <p className="text-2xl font-bold text-primary">{category.count}</p>
                  <p className="text-xs text-muted-foreground">products available</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-primary-foreground">Ready to Get Started?</h2>
            <p className="text-primary-foreground/90">
              Join thousands of satisfied customers who trust MedSupply for their health needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => navigate('/marketplace')}
                className="bg-background hover:bg-background/90 text-foreground"
              >
                Browse Products
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/register')}
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;