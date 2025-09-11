import React from "react";
import { User, Mail, Phone, MapPin, Save, Edit, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
// import { Textarea } from '@/components/ui/textarea';
import Layout from "@/components/Layout/Layout";
import { useProfileHooks } from "./useProfileHooks";

const Profile: React.FC = () => {
  const {
    formData,
    handleChange,
    handleSubmit,
    isEditing,
    setIsEditing,
    emailStatus,
    memberSince,
    handleSubmitPassword,
  } = useProfileHooks();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl ">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
          <div className="text-center lg:text-left w-full">
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your account information and prescriptions
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <Button
              onClick={() =>
          setIsEditing({
            ...isEditing,
            personalInfo: !isEditing.personalInfo,
          })
              }
              variant={isEditing.personalInfo ? "outline" : "default"}
              className={isEditing.personalInfo ? "" : "bg-gradient-primary "}
              style={{ width: "100%" }}
            >
              {isEditing.personalInfo ? (
          <>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </>
              ) : (
          <>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!isEditing.personalInfo}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        disabled={!isEditing.personalInfo}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing.personalInfo}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing.personalInfo}
                        className="pl-10"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label className="text-base font-semibold flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      Address Information
                    </Label>

                    <div className="space-y-2">
                      <Label htmlFor="address.street">Street Address</Label>
                      <Input
                        id="address.street"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        disabled={!isEditing.personalInfo}
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address.city">City</Label>
                        <Input
                          id="address.city"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleChange}
                          disabled={!isEditing.personalInfo}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address.state">State</Label>
                        <Input
                          id="address.state"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleChange}
                          disabled={!isEditing.personalInfo}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address.zipCode">ZIP Code</Label>
                        <Input
                          id="address.zipCode"
                          name="address.zipCode"
                          value={formData.address.zipCode}
                          onChange={handleChange}
                          disabled={!isEditing.personalInfo}
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing.personalInfo && (
                    <div className="flex space-x-4 pt-4">
                      <Button type="submit" className="bg-gradient-primary">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setIsEditing({
                            personalInfo: false,
                            passwordInfo: false,
                          })
                        }
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Account Status */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Status</span>
                  <Badge className={emailStatus.bgColor}>
                    {emailStatus.text}
                  </Badge>
                </div>
                {/* <div className="flex items-center justify-between">
                  <span className="text-sm">Account Type</span>
                  <Badge variant="secondary">Regular</Badge>
                </div> */}
                <div className="flex items-center justify-between">
                  <span className="text-sm">Member Since</span>
                  <span className="text-sm text-muted-foreground">
                    {memberSince}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Password */}
            <div className="space-y-6">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() =>
                      setIsEditing({
                        ...isEditing,
                        passwordInfo: !isEditing.passwordInfo,
                      })
                    }
                    variant={isEditing.passwordInfo ? "outline" : "default"}
                    className={
                      isEditing.passwordInfo ? "" : "bg-gradient-primary"
                    }
                  >
                    {isEditing.passwordInfo ? (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Password
                      </>
                    )}
                  </Button>
                  <form onSubmit={handleSubmitPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="old-password">Old Password</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="old-password"
                          type="password"
                          name="oldPassword"
                          value={formData.oldPassword}
                          placeholder="Enter your old password"
                          onChange={handleChange}
                          disabled={!isEditing.passwordInfo}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="new-password"
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          placeholder="Enter your new password"
                          onChange={handleChange}
                          disabled={!isEditing.passwordInfo}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type="password"
                          name="confirmNewPassword"
                          value={formData.confirmNewPassword}
                          placeholder="Confirm new password"
                          onChange={handleChange}
                          disabled={!isEditing.passwordInfo}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {isEditing.passwordInfo && (
                      <div className="flex space-x-4 pt-4">
                        <Button type="submit" className="bg-gradient-primary">
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setIsEditing({
                              personalInfo: false,
                              passwordInfo: false,
                            })
                          }
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
