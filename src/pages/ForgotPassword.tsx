import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Heart, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword: React.FC = () => {
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock password reset - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmailSent(true);
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/20 via-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="bg-gradient-primary p-3 rounded-xl">
              <Heart className="h-8 w-8 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-2xl text-foreground">MedSupply</span>
          </Link>
        </div>

        <Card className="bg-gradient-card shadow-medical border-border/50">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              {emailSent ? 'Check Your Email' : 'Reset Password'}
            </CardTitle>
            <CardDescription>
              {emailSent 
                ? 'We\'ve sent you password reset instructions'
                : 'Enter your email to receive reset instructions'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {emailSent ? (
              <div className="text-center space-y-6">
                <div className="bg-success/10 p-6 rounded-xl">
                  <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                  <p className="text-success font-medium mb-2">Email Sent Successfully</p>
                  <p className="text-sm text-muted-foreground">
                    We've sent password reset instructions to <strong>{email}</strong>
                  </p>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setEmailSent(false)}
                    className="w-full"
                  >
                    Try Different Email
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary hover:shadow-md transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Instructions'}
                </Button>
              </form>
            )}

            <div className="text-center space-y-4">
              <Link 
                to="/login" 
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-center text-muted-foreground mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;