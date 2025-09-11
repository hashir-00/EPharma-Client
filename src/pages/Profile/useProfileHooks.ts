import { useToast } from "@/hooks/use-toast";
import { AppDispatch, RootState } from "@/store";
import { getUserProfile, updateUserPassword, updateUserProfile } from "@/store/slices/authSlice";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

interface FormData{
    name: string;
    email: string;
    age: string | number;
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

interface UseProfileHooks{
    isEditing: {
        personalInfo: boolean;
        passwordInfo: boolean;
    };
    formData: FormData;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    setIsEditing: React.Dispatch<React.SetStateAction<{
        personalInfo: boolean;
        passwordInfo: boolean;
    }>>;
    emailStatus: {
        verified: boolean | undefined;
        bgColor: string;
        text: string;
    };
    memberSince: string;
    handleSubmitPassword: (e:React.FormEvent) => Promise<void>;
}

export function useProfileHooks(): UseProfileHooks {
     const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const { user } = useSelector((state: RootState) => state.auth);

  // Function to safely parse address
  const parseUserAddress = (addressString?: string) => {
    if (!addressString) {
      return {
        street: "",
        city: "",
        state: "",
        zipCode: "",
      };
    }

    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(addressString);
      return {
        street: parsed.street || "",
        city: parsed.city || "",
        state: parsed.state || "",
        zipCode: parsed.zipCode || "",
      };
    } catch {
      // If JSON parsing fails, treat as a simple string
      return {
        street: addressString,
        city: "",
        state: "",
        zipCode: "",
      };
    }
  };

  // Function to initialize form data from user
  const initializeFormData = useCallback((userData: typeof user) => {
    const userAddress = parseUserAddress(userData?.address);

    return {
      name: `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim(),
      email: userData?.email || "",
      age: userData?.age || "",
      phone: userData?.phone || "",
      address: userAddress,
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    };
  }, []);

  const [isEditing, setIsEditing] = useState({
    personalInfo: false,
    passwordInfo: false,
  });
  const [formData, setFormData] = useState(() => initializeFormData(user));

  // Update formData when user data changes (after fetch or refresh)
  useEffect(() => {
    if (user) {
      setFormData(initializeFormData(user));
    }
  }, [user, initializeFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
        try {
        // Parse the name field into firstName and lastName
        const nameParts = formData.name.trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        // Convert age to number if it's a string
        const profileData = {
            firstName,
            lastName,
            phone: formData.phone,
            email: formData.email,
            age:
            typeof formData.age === "string"
                ? parseInt(formData.age) || undefined
                : formData.age,
            address: JSON.stringify({
            street: formData.address.street,
            city: formData.address.city,
            state: formData.address.state,
            zipCode: formData.address.zipCode,
            }),
        };

        await dispatch(updateUserProfile(profileData)).unwrap();
        setIsEditing({ ...isEditing, personalInfo: false });
        toast({
            title: "Profile Updated",
            description: "Your profile information has been successfully updated.",
        });
        } catch (error) {
        console.error("Profile update error:", error);
        toast({
            title: "Update Failed",
            description: "Failed to update profile. Please try again.",
            variant: "destructive",
        });
        }
  };
  const handleSubmitPassword = async (e:React.FormEvent)=>{
      e.preventDefault();
      try {

        if(formData.newPassword !== formData.confirmNewPassword){
          toast({
            title: "Password Mismatch",
            description: "New passwords do not match.",
            variant: "destructive",
          });
          return;
        }

        const profileData: { oldPassword: string; newPassword: string } = {
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
        };
        if (formData.oldPassword) profileData.oldPassword = formData.oldPassword;
        if (formData.newPassword) profileData.newPassword = formData.newPassword;
    

        await dispatch(updateUserPassword(profileData)).unwrap();
        setIsEditing({ ...isEditing, passwordInfo: false });
        toast({
          title: "Password Updated",
          description: "Your password has been successfully updated.",
        });
      } catch (error) {
        console.error("Password update error:", error);
        toast({
          title: "Update Failed",
          description: "Failed to update password. Please try again.",
          variant: "destructive",
        });
      }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const emailStatus = {
    verified: user?.isEmailVerified,
    bgColor: user?.isEmailVerified
      ? "bg-success/10 text-success border-success/20"
      : "bg-destructive/10 text-destructive border-destructive/20",
    text: user?.isEmailVerified ? "Verified" : "Unverified",
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      })
    : "N/A";

  // Fetch user profile on component mount
  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

    return {
      isEditing,
      formData,
      handleSubmit,
      handleChange,
      setIsEditing,
      emailStatus,
        memberSince,
        handleSubmitPassword
    };
}