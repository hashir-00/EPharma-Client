import React from "react";
import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotFoundHooks } from "./useNotFoundHooks";

const NotFound: React.FC = () => {
  const { location } = useNotFoundHooks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/20 via-background to-secondary-light/20 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Illustration */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
          <span className="text-6xl font-bold text-primary">404</span>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-2">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Path: <code className="bg-accent px-2 py-1 rounded">{location.pathname}</code>
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full bg-gradient-primary hover:shadow-md transition-all duration-200">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <Link to="/marketplace">
            <Button variant="outline" className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Browse Products
            </Button>
          </Link>

          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-muted-foreground mt-8">
          If you believe this is an error, please{" "}
          <a href="mailto:support@medsupply.com" className="text-primary hover:underline">
            contact support
          </a>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
