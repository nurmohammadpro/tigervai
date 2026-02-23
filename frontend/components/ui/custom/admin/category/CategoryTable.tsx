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
import { Edit2, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import { EditCategoryModal } from "./EditCategoryModal";
import { CategoryPaginationControls } from "./CategoryPaginationControls";
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
import { DeleteCategory } from "@/actions/brand-category";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SubDto {
  SubMain: string;
  subCategory: string[];
}

interface Category {
  _id: string;
  name: string;
  logoUrl?: string;
  sub: SubDto[];
  isTop?: boolean;
}

interface CategoryTableProps {
  data: Category[];
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

export function CategoryTable({
  data,
  pagination,
  onPaginationChange,
  isLoading,
  onRefresh,
}: CategoryTableProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleExpand = (categoryId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const { mutate, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-category"],
    mutationFn: (id: string) => DeleteCategory(id),
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error.message);
        return;
      }
      toast.success("Category deleted successfully");
      onRefresh();
    },
    onError: (error) => {
      toast.error(error.message || "unknown error");
    },
  });

  const handleDelete = async (id: string) => {
    mutate(id);
  };

  const getTotalSubcategories = (category: Category) => {
    return category.sub.reduce(
      (total, subMain) => total + subMain.subCategory.length,
      0
    );
  };

  return (
    <>
      <div className="border border-palette-accent-3 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-palette-accent-3/10 border-palette-accent-3">
              <TableHead className="text-palette-text w-12"></TableHead>
              <TableHead className="text-palette-text">Logo</TableHead>
              <TableHead className="text-palette-text">Name</TableHead>
              <TableHead className="text-palette-text">Status</TableHead>
              <TableHead className="text-palette-text">Subcategories</TableHead>
              <TableHead className="text-right text-palette-text">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-palette-text"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-palette-accent-3"
                >
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              data.map((category) => {
                const isExpanded = expandedRows.has(category._id);
                const totalSubcategories = getTotalSubcategories(category);

                return (
                  <>
                    {/* Main Row */}
                    <TableRow
                      key={category._id}
                      className="hover:bg-palette-accent-3/5 border-palette-accent-3/20"
                    >
                      <TableCell>
                        {category.sub.length > 0 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleExpand(category._id)}
                            className="h-6 w-6 p-0"
                          >
                            {isExpanded ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        {category.logoUrl ? (
                          <div className="relative w-10 h-10">
                            <Image
                              src={category.logoUrl}
                              alt={category.name}
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
                        {category.name}
                      </TableCell>
                      <TableCell>
                        {category.isTop && (
                          <span className="inline-block bg-palette-btn/20 text-palette-btn px-2 py-1 rounded text-xs">
                            Top Category
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-palette-text">
                          {category.sub.length > 0 ? (
                            <span>
                              {category.sub.length} group
                              {category.sub.length !== 1 && "s"} •{" "}
                              {totalSubcategories} item
                              {totalSubcategories !== 1 && "s"}
                            </span>
                          ) : (
                            <span className="text-palette-accent-3">
                              No subcategories
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingCategory(category)}
                            className="border-palette-accent-3 text-palette-text hover:bg-palette-accent-3/10"
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteConfirm(category._id)}
                            className="bg-palette-btn hover:opacity-90"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Subcategory Details */}
                    {isExpanded && category.sub.length > 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="bg-palette-accent-3/5 p-4"
                        >
                          <div className="space-y-3">
                            {category.sub.map((subMain, index) => (
                              <div
                                key={index}
                                className="border border-palette-accent-3/30 rounded-lg p-3 bg-palette-bg"
                              >
                                <div className="font-medium text-palette-text mb-2">
                                  {subMain.SubMain}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {subMain.subCategory.length > 0 ? (
                                    subMain.subCategory.map((item, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-block bg-palette-btn/10 text-palette-text px-3 py-1 rounded-full text-xs border border-palette-accent-3/20"
                                      >
                                        {item}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-xs text-palette-accent-3 italic">
                                      No items
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <CategoryPaginationControls
        page={pagination.page}
        limit={pagination.limit}
        total={pagination.total}
        totalPages={pagination.totalPages}
        onPageChange={(page) =>
          onPaginationChange({ page, limit: pagination.limit })
        }
        onLimitChange={(limit) => onPaginationChange({ page: 1, limit })}
      />

      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          open={!!editingCategory}
          onOpenChange={() => setEditingCategory(null)}
          onSuccess={() => {
            setEditingCategory(null);
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
              Delete Category
            </AlertDialogTitle>
            <AlertDialogDescription className="text-palette-accent-3">
              Are you sure you want to delete this category? This action cannot
              be undone.
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
