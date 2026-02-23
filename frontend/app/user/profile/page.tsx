"use client";

import { useState } from "react";
import {
  Edit,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQueryWrapper } from "@/api-hook/react-query-wrapper";
import { UserResponse } from "@/@types/userType";
import { useCommonMutationApi } from "@/api-hook/mutation-common";

interface UpdateUserData {
  name?: string;
  email?: string;
  shopName?: string;
  shopAddress?: string;
  id: string;
}

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user data
  const { data, isLoading, refetch } = useQueryWrapper<UserResponse>(
    ["get-my-profile"],
    "/user/get-my-profile"
  );

  // Update mutation
  const updateMutation = useCommonMutationApi({
    method: "PATCH",
    url: "/user/update-user",
    successMessage: "Profile updated successfully",
  });

  const user = data?.data;
  const isVendor = user?.role === "vendor";

  // Edit state
  const [editData, setEditData] = useState<UpdateUserData>({
    name: user?.name || "",
    email: user?.email || "",
    shopName: user?.shopName || "",
    shopAddress: user?.shopAddress || "",
    id: user?._id || "",
  });

  const handleEditChange = (field: keyof UpdateUserData, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(editData);
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || "",
      email: user?.email || "",
      shopName: user?.shopName || "",
      shopAddress: user?.shopAddress || "",
      id: user?._id || "",
    });
    setIsEditing(false);
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6 w-full container mx-auto px-5 md:px-0">
        <div className="flex justify-between items-start gap-4 mt-11">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b bg-gradient-to-r from-palette-bg to-white">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-palette-text/60">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full container mx-auto px-5 md:px-0">
      {/* Header */}
      <div className="flex justify-between items-start gap-4 mt-11">
        <div>
          <h2 className="text-3xl font-bold text-palette-text">
            Account Information
          </h2>
          <p className="text-palette-text/60 text-sm mt-2">
            Manage your account details and personal settings.
          </p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-palette-btn hover:bg-palette-btn/90 text-white gap-2 whitespace-nowrap"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Card */}
      <Card className="border-0 shadow-sm overflow-hidden">
        {/* Header Section with Avatar */}
        <CardHeader className="border-b bg-gradient-to-r from-palette-bg to-white p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
              <AvatarImage src={isVendor ? user.shopLogo : undefined} />
              <AvatarFallback className="bg-palette-btn text-white text-2xl font-bold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-palette-text">
                  {user.name}
                </h3>
                <Badge
                  variant="outline"
                  className="border-palette-btn text-palette-btn bg-palette-btn/10 capitalize"
                >
                  {user.role}
                </Badge>
              </div>
              <p className="text-palette-text/60 text-sm">
                Member since {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-lg font-semibold text-palette-text mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-palette-btn" />
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-palette-text/70 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleEditChange("name", e.target.value)}
                      className="h-11"
                    />
                  ) : (
                    <p className="text-palette-text font-medium text-base py-2 px-3 bg-palette-bg rounded-lg">
                      {user.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-palette-text/70 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editData.email}
                      onChange={(e) =>
                        handleEditChange("email", e.target.value)
                      }
                      className="h-11"
                    />
                  ) : (
                    <p className="text-palette-text font-medium text-base py-2 px-3 bg-palette-bg rounded-lg">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Vendor Information */}
            {isVendor && (
              <div className="pt-6 border-t">
                <h4 className="text-lg font-semibold text-palette-text mb-4 flex items-center gap-2">
                  <Store className="w-5 h-5 text-palette-btn" />
                  Shop Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Shop Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-palette-text/70 flex items-center gap-2">
                      <Store className="w-4 h-4" />
                      Shop Name
                    </Label>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={editData.shopName}
                        onChange={(e) =>
                          handleEditChange("shopName", e.target.value)
                        }
                        className="h-11"
                      />
                    ) : (
                      <p className="text-palette-text font-medium text-base py-2 px-3 bg-palette-bg rounded-lg">
                        {user.shopName || "Not provided"}
                      </p>
                    )}
                  </div>

                  {/* Shop Address */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-palette-text/70 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Shop Address
                    </Label>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={editData.shopAddress}
                        onChange={(e) =>
                          handleEditChange("shopAddress", e.target.value)
                        }
                        className="h-11"
                      />
                    ) : (
                      <p className="text-palette-text font-medium text-base py-2 px-3 bg-palette-bg rounded-lg">
                        {user.shopAddress || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Account Details (Read-only) */}
            <div className="pt-6 border-t">
              <h4 className="text-lg font-semibold text-palette-text mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-palette-btn" />
                Account Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-palette-text/70">
                    Account Created
                  </Label>
                  <p className="text-palette-text font-medium text-base py-2 px-3 bg-palette-bg rounded-lg">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-palette-text/70">
                    Last Updated
                  </Label>
                  <p className="text-palette-text font-medium text-base py-2 px-3 bg-palette-bg rounded-lg">
                    {formatDate(user.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-8 border-t">
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="flex-1 bg-palette-btn hover:bg-palette-btn/90 text-white gap-2 h-11 font-semibold"
              >
                {updateMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                onClick={handleCancel}
                disabled={updateMutation.isPending}
                variant="outline"
                className="flex-1 h-11 font-semibold"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
