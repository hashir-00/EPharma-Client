import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseForgotPasswordHooks {
  email: string;
  loading: boolean;
  emailSent: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setEmail: (email: string) => void;
  setEmailSent: (sent: boolean) => void;
}

export function useForgotPasswordHooks(): UseForgotPasswordHooks {
  const { toast } = useToast();

  const [email, setEmail] = useState("");
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

  return {
    email,
    loading,
    emailSent,
    handleSubmit,
    setEmail,
    setEmailSent,
  };
}
