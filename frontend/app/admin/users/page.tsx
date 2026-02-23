"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useQueryWrapper } from "@/api-hook/react-query-wrapper";
import { ChevronDown, Eye, Trash2 } from "lucide-react";

import type { UserItem, UserResponse } from "@/@types/getUser";
import { UserEditModal } from "./UserInfoModal";
import { useCommonMutationApi } from "@/api-hook/mutation-common";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

export default function UserManagement() {
  const isMobile = useIsMobile();

  // Filter states for possible role and deleted filters (optional)
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterDeleted, setFilterDeleted] = useState<string | null>(null);

  // Pagination & sorting state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Modal state for displaying user details and delete confirmation
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Compose query params for backend
  const queryParams = new URLSearchParams();
  queryParams.set("page", page.toString());
  queryParams.set("limit", limit.toString());
  queryParams.set("sortBy", sortBy);
  queryParams.set("sortOrder", sortOrder);
  if (filterRole) queryParams.set("role", filterRole);
  if (filterDeleted) queryParams.set("isDeleted", filterDeleted);

  // Fetch users with react-query wrapper
  const { data, isLoading, refetch } = useQueryWrapper<UserResponse>(
    ["users", page, limit, sortBy, sortOrder, filterRole, filterDeleted],
    `/user/find-all-users?${queryParams.toString()}`
  );

  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const { mutate, isPending } = useCommonMutationApi({
    method: "DELETE",
    url: "/user/delete-user",
    successMessage: "useDelete updated successfully",
    onSuccess(data) {
      refetch();
      closeUserModal();
    },
  });

  const openUserModal = (user: UserItem) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setIsUserModalOpen(false);
  };

  const openDeleteModal = (user: UserItem) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      mutate(userToDelete._id);
      // TODO: trigger data refetch or cache update
    }
  };

  return (
    <div className="container mx-auto max-w-full px-6 py-8 text-color-palette-text">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>

      {/* Filters Popover */}
      <div className="mb-6 flex justify-start">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-1 border-color-palette-accent-3 text-color-palette-text"
            >
              Sort & Order <ChevronDown size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="start"
            className="w-64 bg-color-palette-bg border border-color-palette-accent-3 bg-white"
          >
            <div className="mb-4">
              <h3 className="text-color-palette-accent-1 mb-1 font-semibold">
                Sort By
              </h3>
              <RadioGroup value={sortBy} onValueChange={setSortBy}>
                <div className="flex flex-col gap-1">
                  <label className="inline-flex items-center cursor-pointer">
                    <RadioGroupItem value="name" id="sort-name" />
                    <span className="ml-2 text-color-palette-text">Name</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <RadioGroupItem value="createdAt" id="sort-createdAt" />
                    <span className="ml-2 text-color-palette-text">
                      Created At
                    </span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <RadioGroupItem value="email" id="sort-email" />
                    <span className="ml-2 text-color-palette-text">Email</span>
                  </label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <h3 className="text-color-palette-accent-1 mb-1 font-semibold">
                Order
              </h3>
              <RadioGroup
                value={sortOrder}
                onValueChange={(v) => setSortOrder(v as "asc" | "desc")}
              >
                <div className="flex flex-col gap-1">
                  <label className="inline-flex items-center cursor-pointer">
                    <RadioGroupItem value="asc" id="order-asc" />
                    <span className="ml-2 text-color-palette-text">
                      Ascending
                    </span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <RadioGroupItem value="desc" id="order-desc" />
                    <span className="ml-2 text-color-palette-text">
                      Descending
                    </span>
                  </label>
                </div>
              </RadioGroup>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-color-palette-accent-3 rounded-lg">
        <Table className="min-w-full">
          <TableHeader className="bg-color-palette-btn text-white">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-4 text-color-palette-accent-3"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : data && data.data.length > 0 ? (
              data.data.map((user: UserItem) => (
                <TableRow
                  key={user._id}
                  className="hover:bg-color-palette-accent-2 transition cursor-pointer"
                >
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell>
                    {user.isDeleted ? (
                      <span className="text-red-500 font-semibold">
                        Deleted
                      </span>
                    ) : (
                      <span className="text-green-600 font-semibold">
                        Active
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center flex justify-center items-center gap-2">
                    <UserEditModal user={user} />
                    <Eye
                      className=" w-4 h-4"
                      onClick={() => openUserModal(user)}
                    />
                    <Button
                      variant="ghost"
                      className="text-red-500 hover:bg-red-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(user);
                      }}
                      aria-label={`Delete user ${user.name}`}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-4 text-color-palette-accent-3"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-color-palette-accent-3">
        <div>
          Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of{" "}
          {total} users
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="border-color-palette-accent-3 text-color-palette-text"
          >
            Previous
          </Button>
          <div
            className="px-4 py-2 rounded bg-color-palette-btn text-white"
            style={{ minWidth: 100, textAlign: "center" }}
          >
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="border-color-palette-accent-3 text-color-palette-text"
          >
            Next
          </Button>
        </div>
      </div>

      {/* User Details Modal */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information for user{" "}
              <strong>{selectedUser?.name}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-color-palette-text mt-4">
            <p>
              <strong>Name:</strong> {selectedUser?.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser?.email}
            </p>
            <p>
              <strong>Role:</strong> {selectedUser?.role}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedUser?.isDeleted ? "Deleted" : "Active"}
            </p>
            <p>
              <strong>Phone:</strong> {selectedUser?.phone || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {selectedUser?.address || "N/A"}
            </p>
            {selectedUser?.shopName && (
              <>
                <p>
                  <strong>Shop Name:</strong> {selectedUser.shopName}
                </p>
                <p>
                  <strong>Shop Address:</strong>{" "}
                  {selectedUser.shopAddress || "N/A"}
                </p>
                <p>
                  <strong>Vendor Description:</strong>{" "}
                  {selectedUser.vendorDescription || "N/A"}
                </p>
              </>
            )}
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(selectedUser?.createdAt || "").toLocaleString()}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(selectedUser?.updatedAt || "").toLocaleString()}
            </p>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsUserModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user{" "}
              <strong>{userToDelete?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={closeDeleteModal}
              className="border-color-palette-accent-3 text-color-palette-text"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => {
                confirmDeleteUser();
              }}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
