import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { UserItem } from "@/@types/getUser";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Loader2, Pen } from "lucide-react";
import { useCommonMutationApi } from "@/api-hook/mutation-common";

interface UserEditModalProps {
  user: UserItem | null;
}

export function UserEditModal({ user }: UserEditModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    role: user?.role || "user",
    shopName: user?.shopName || "",
    shopAddress: user?.shopAddress || "",
    vendorDescription: user?.vendorDescription || "",
  });
  const { mutate, isPending } = useCommonMutationApi({
    method: "PATCH",
    url: "/user/update-user",
    successMessage: "Profile updated successfully",
    onSuccess(data) {
      setIsOpen(false);
    },
  });

  if (!user) return null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    mutate({ ...formData, id: user._id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-2">
          <Pen className="w-4 h-4 text-green-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update information for <strong>{user.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="border-color-palette-accent-3"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="border-color-palette-accent-3"
            />
          </div>

          {/* Role */}
          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(v) => handleChange("role", v)}
            >
              <SelectTrigger className="border-color-palette-accent-3">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="border-color-palette-accent-3"
            />
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="border-color-palette-accent-3"
            />
          </div>

          {/* Vendor Fields - show only if role is vendor */}
          {formData.role === "vendor" && (
            <>
              <div>
                <Label htmlFor="shopName">Shop Name</Label>
                <Input
                  id="shopName"
                  value={formData.shopName}
                  onChange={(e) => handleChange("shopName", e.target.value)}
                  className="border-color-palette-accent-3"
                />
              </div>

              <div>
                <Label htmlFor="shopAddress">Shop Address</Label>
                <Input
                  id="shopAddress"
                  value={formData.shopAddress}
                  onChange={(e) => handleChange("shopAddress", e.target.value)}
                  className="border-color-palette-accent-3"
                />
              </div>

              <div>
                <Label htmlFor="vendorDescription">Vendor Description</Label>
                <Textarea
                  id="vendorDescription"
                  value={formData.vendorDescription}
                  onChange={(e) =>
                    handleChange("vendorDescription", e.target.value)
                  }
                  className="border-color-palette-accent-3"
                  rows={3}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter className="mt-6 flex gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button className="" disabled={isPending} onClick={handleSave}>
            {isPending ? (
              <Loader2 className="mr-2 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
