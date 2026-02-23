"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Star, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import { EditBrandModal } from "./EditBrandModal";
import { BrandPaginationControls } from "./BrandPaginationControls";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { DeleteBrand, UpdateBrand } from "@/actions/brand-category";
import { toast } from "sonner";

interface Brand {
  _id: string;
  name: string;
  logoUrl?: string;
  categories?: string[];
  isTop?: boolean;
}

interface BrandTableProps {
  data: Brand[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPaginationChange: (pagination: { page: number; limit: number }) => void;
  isLoading?: boolean;
  onRefresh: () => void;
}

export function BrandTable({
  data,
  pagination,
  onPaginationChange,
  isLoading,
  onRefresh,
}: BrandTableProps) {
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { mutate: ShouldDelete, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-brand"],
    mutationFn: (id: string) => DeleteBrand(id),
    onSuccess: (data) => {
      if (data?.error) {
        toast.success(data.error?.message);
      }
      toast.success("Brand deleted successfully");
      setDeleteConfirm(null);
      onRefresh();
    },
    onError: (data) => {
      toast.error(data?.message || "Unknown error");
    },
  });
  const { mutate: UpdateToTop } = useMutation({
    mutationKey: ["delete-brand"],
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      UpdateBrand(id, payload),
    onSuccess: (data) => {
      if (data?.error) {
        toast.success(data.error?.message);
        return;
      }
      onRefresh();
      toast.success("Brand update successfully");
    },
    onError: (data) => {
      toast.error(data?.message || "Unknown error");
    },
  });

  const handleDelete = async (id: string) => {
    ShouldDelete(id);
  };

  const handleToggleTop = async (brand: Brand) => {
    const payload = {
      isTop: !brand.isTop,
    };
    UpdateToTop({ id: brand._id, payload });
  };

  return (
    <>
      <div className="border border-palette-accent-3 rounded-lg overflow-hidden bg-palette-bg">
        <Table>
          <TableHeader>
            <TableRow className="bg-palette-accent-3/10 border-palette-accent-3">
              <TableHead className="text-palette-text">Logo</TableHead>
              <TableHead className="text-palette-text">Name</TableHead>
              <TableHead className="text-palette-text">Categories</TableHead>
              <TableHead className="w-12 text-palette-text">Top</TableHead>
              <TableHead className="text-right text-palette-text">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-palette-text"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-palette-accent-3"
                >
                  No brands found
                </TableCell>
              </TableRow>
            ) : (
              data.map((brand) => (
                <TableRow
                  key={brand._id}
                  className="hover:bg-palette-accent-3/5 border-palette-accent-3/20"
                >
                  <TableCell>
                    {brand.logoUrl ? (
                      <div className="relative w-10 h-10">
                        <Image
                          src={brand.logoUrl}
                          alt={brand.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-palette-accent-3/20 rounded flex items-center justify-center text-xs text-palette-accent-3">
                        No Logo
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-palette-text">
                    {brand.name}
                  </TableCell>
                  <TableCell className="text-sm text-palette-accent-3">
                    {brand.categories?.length || 0} categories
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleTop(brand)}
                      className={`p-1 transition ${
                        brand.isTop
                          ? "text-palette-accent-1"
                          : "text-palette-accent-3/30 hover:text-palette-accent-3/60"
                      }`}
                      title={brand.isTop ? "Remove from top" : "Add to top"}
                    >
                      <Star size={18} fill="currentColor" />
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingBrand(brand)}
                        className="border-palette-accent-3 text-palette-text hover:bg-palette-accent-3/10"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteConfirm(brand._id)}
                        className="bg-palette-btn hover:opacity-90"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <BrandPaginationControls
        page={pagination.page}
        limit={pagination.limit}
        total={pagination.total}
        totalPages={pagination.totalPages}
        onPageChange={(page) =>
          onPaginationChange({ page, limit: pagination.limit })
        }
        onLimitChange={(limit) => onPaginationChange({ page: 1, limit })}
      />

      {editingBrand && (
        <EditBrandModal
          brand={editingBrand}
          open={!!editingBrand}
          onOpenChange={() => setEditingBrand(null)}
          onSuccess={() => {
            setEditingBrand(null);
            onRefresh();
          }}
        />
      )}

      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <AlertDialogContent className="bg-palette-bg border-palette-accent-3">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-palette-text">
              Delete Brand
            </AlertDialogTitle>
            <AlertDialogDescription className="text-palette-accent-3">
              Are you sure you want to delete this brand? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className="border-palette-accent-3 text-palette-text hover:bg-palette-accent-3/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={isDeleting}
              className="bg-palette-btn text-white hover:opacity-90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
