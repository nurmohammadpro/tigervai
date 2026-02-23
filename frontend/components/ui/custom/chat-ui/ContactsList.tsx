"use client";
import React, { useEffect, useState, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle } from "lucide-react";
import pb from "@/lib/poacktbase";
import { useUser } from "@/hooks/useUser";

export interface ChatRoom {
  buyer_id: string;
  buyer_name: string;
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  is_buyer_seen: boolean;
  is_seller_seen: boolean;
  last_message_send: string;
  room_id: string;
  seller_id: string;
  seller_name: string;
  updated: string;
}

const ITEMS_PER_PAGE = 10;

const ContactsList = ({
  selectedContact,
  setSelectedContact,
}: {
  selectedContact: string | null;
  setSelectedContact: (id: string, receiverId: string, name: string) => void;
}) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { data: user } = useUser();

  console.log("user", user);

  const fetchRooms = async (currentPage: number) => {
    try {
      setIsLoading(true);
      const result = await pb
        .collection("chat_room")
        .getList(currentPage, ITEMS_PER_PAGE, {
          filter: `buyer_id = "${user?.id}" || seller_id = "${user?.id}"`,
          sort: "-last_message_send",
        });
      console.log("result", result);
      setTotalItems(result.totalItems);

      if (currentPage === 1) {
        setChatRooms(result.items as ChatRoom[]);
      } else {
        setChatRooms((prev) => {
          const existingIds = new Set(prev.map((room) => room.id));
          const newRooms = result.items.filter(
            (room) => !existingIds.has(room.id),
          );
          return [...prev, ...newRooms] as ChatRoom[];
        });
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRoom = useCallback((updatedRoom: ChatRoom) => {
    setChatRooms((prev) => {
      const existingIndex = prev.findIndex(
        (room) => room.id === updatedRoom.id,
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = updatedRoom;
        return updated.sort(
          (a, b) =>
            new Date(b.last_message_send).getTime() -
            new Date(a.last_message_send).getTime(),
        );
      } else {
        return [updatedRoom, ...prev].sort(
          (a, b) =>
            new Date(b.last_message_send).getTime() -
            new Date(a.last_message_send).getTime(),
        );
      }
    });
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    fetchRooms(1);

    pb.collection("chat_room").subscribe("*", (e) => {
      console.log("Real-time update:", e.action, e.record);

      if (e.action === "create" || e.action === "update") {
        updateRoom(e.record as ChatRoom);
      } else if (e.action === "delete") {
        setChatRooms((prev) => prev.filter((room) => room.id !== e.record.id));
      }
    });

    return () => {
      pb.collection("chat_room").unsubscribe("*");
    };
  }, [updateRoom, user]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRooms(nextPage);
  };

  const hasMore = chatRooms.length < totalItems;

  // Helper function to format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    } else if (diffInDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <ScrollArea className="flex-1 bg-[var(--palette-bg)]">
      <div className="divide-y divide-gray-100">
        {chatRooms.map((room) => {
          const contactName =
            user?.id === room.buyer_id ? room.seller_name : room.buyer_name;
          const isUnread =
            user?.id === room.seller_id
              ? !room.is_seller_seen
              : !room.is_buyer_seen;
          const isSelected = selectedContact === room.room_id;

          return (
            <button
              key={room.id}
              onClick={() =>
                setSelectedContact(
                  room.room_id,
                  room?.buyer_id === user?.id
                    ? room?.seller_id
                    : room?.buyer_id,
                  contactName,
                )
              }
              className={`
                w-full flex items-center gap-3 px-4 md:px-5 py-4 text-left transition-all duration-200 relative
                ${
                  isSelected
                    ? "bg-[var(--palette-btn)]/10 border-l-4 border-[var(--palette-btn)]"
                    : "bg-white hover:bg-gray-50 border-l-4 border-transparent"
                }
              `}
            >
              <div className="relative">
                <Avatar className="h-12 w-12 flex-shrink-0 border-2 border-gray-100">
                  <AvatarFallback
                    className={`font-semibold text-white ${
                      isSelected
                        ? "bg-[var(--palette-btn)]"
                        : "bg-[var(--palette-accent-1)]"
                    }`}
                  >
                    {contactName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {isUnread && (
                  <div className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[var(--palette-btn)] border-2 border-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3
                    className={`font-semibold truncate ${
                      isUnread ? "text-[var(--palette-text)]" : "text-gray-700"
                    }`}
                  >
                    {contactName}
                  </h3>
                  <span
                    className={`text-xs flex-shrink-0 ml-2 ${
                      isUnread
                        ? "text-[var(--palette-btn)] font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {formatTime(room.last_message_send)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  Tap to view conversation
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {hasMore && (
        <div className="p-4">
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            variant="outline"
            className="w-full rounded-full border-gray-300 hover:bg-white hover:border-[var(--palette-btn)] transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Conversations"
            )}
          </Button>
        </div>
      )}

      {chatRooms.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--palette-btn)]/10 flex items-center justify-center mb-4">
            <MessageCircle className="h-10 w-10 text-[var(--palette-btn)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--palette-text)] mb-2">
            No conversations yet
          </h3>
          <p className="text-sm text-gray-500 max-w-xs">
            Start a conversation to see it appear here
          </p>
        </div>
      )}

      {chatRooms.length === 0 && isLoading && (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--palette-btn)]" />
        </div>
      )}
    </ScrollArea>
  );
};

export default ContactsList;
