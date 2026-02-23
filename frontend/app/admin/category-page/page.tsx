"use client";

import { useState, useCallback } from "react";
import { CreateCategoryModal } from "@/components/ui/custom/admin/category/CreateCategoryModal";
import { CategoryTable } from "@/components/ui/custom/admin/category/CategoryTable";
import { useQueryWrapper } from "@/api-hook/react-query-wrapper";

export default function CategoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const {
    data: categoriesData,
    isLoading,
    refetch,
  } = useQueryWrapper(
    ["categories", pagination],
    `/category?page=${pagination.page}&limit=${pagination.limit}`
  );

  const handleCreateSuccess = useCallback(() => {
    setIsModalOpen(false);
    refetch();
  }, [refetch]);

  return (
    <div className="space-y-6 p-6  min-h-screen container mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-palette-text">
          Category Management
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-palette-btn text-white rounded-lg hover:opacity-90 transition"
        >
          Create Category
        </button>
      </div>

      <CreateCategoryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleCreateSuccess}
      />

      <CategoryTable
        data={categoriesData?.data || []}
        pagination={{
          page: pagination.page,
          limit: pagination.limit,
          total: categoriesData?.total || 0,
          totalPages: categoriesData?.totalPages || 0,
        }}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        onRefresh={refetch}
      />
    </div>
  );
}
