import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, loginSuccess } from "@/store/slices/authSlice";
import { useToast } from "@/hooks/use-toast";
import { RootState, AppDispatch } from "@/store";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface UseRegisterHooks {
  formData: RegisterFormData;
  showPassword: boolean;
  showConfirmPassword: boolean;
  authLoading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
}

export function useRegisterHooks(): UseRegisterHooks {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { loading: authLoading } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(
        registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
      ).unwrap();

      toast({
        title: "Welcome to MedSupply!",
        description: "Your account has been created successfully.",
      });

      navigate("/");
    } catch (error) {
      // Fallback to mock registration for development
      const mockUser = {
        id: Date.now().toString(),
        email: formData.email,
        name: formData.name,
        prescriptions: [],
      };

      const mockToken = "mock-jwt-token-" + Date.now();

      dispatch(loginSuccess({ user: mockUser, token: mockToken }));

      toast({
        title: "Welcome to MedSupply!",
        description: "Your account has been created successfully (demo mode).",
      });

      navigate("/");
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
    showConfirmPassword,
    authLoading,
    handleSubmit,
    handleChange,
    setShowPassword,
    setShowConfirmPassword,
  };
}
