"use client";

import { useState, useCallback } from "react";

import { useQuery } from "@tanstack/react-query";
import { CreateBrandModal } from "@/components/ui/custom/admin/brand/CreateBrandModal";
import { BrandTable } from "@/components/ui/custom/admin/brand/BrandTable";
import { useQueryWrapper } from "@/api-hook/react-query-wrapper";

export default function BrandPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const {
    data: brandsData,
    isLoading,
    refetch,
  } = useQueryWrapper(
    ["brands", pagination],
    `/brand?page=${pagination.page}&limit=${pagination.limit}`
  );

  const handleCreateSuccess = useCallback(() => {
    setIsModalOpen(false);
    refetch();
  }, [refetch]);

  return (
    <div className="space-y-6 p-6 bg-palette-bg">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-palette-text">
          Brand Management
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-palette-btn text-white rounded-lg hover:opacity-90 transition"
        >
          Create Brand
        </button>
      </div>

      <CreateBrandModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleCreateSuccess}
      />

      <BrandTable
        data={brandsData?.data || []}
        pagination={{
          page: pagination.page,
          limit: pagination.limit,
          total: brandsData?.total || 0,
          totalPages: brandsData?.totalPages || 0,
        }}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        onRefresh={refetch}
      />
    </div>
  );
}
