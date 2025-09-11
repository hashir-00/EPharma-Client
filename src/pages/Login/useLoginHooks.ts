import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/store/slices/authSlice";
import { useToast } from "@/hooks/use-toast";
import { RootState, AppDispatch } from "@/store";

interface LoginFormData {
  email: string;
  password: string;
}

interface UseLoginHooks {
  formData: LoginFormData;
  showPassword: boolean;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShowPassword: (show: boolean) => void;
}

export function useLoginHooks(): UseLoginHooks {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { loading } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(loginUser(formData)).unwrap();
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error as string || "An error occurred during login.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return {
    formData,
    showPassword,
    loading,
    handleSubmit,
    handleChange,
    setShowPassword,
  };
}
