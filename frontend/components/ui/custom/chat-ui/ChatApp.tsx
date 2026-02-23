"use client";

import type React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, ArrowDown, Loader2 } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ContactsList from "./ContactsList";
import pb from "@/lib/poacktbase";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";

export interface Message {
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  is_seen_receiver: string;
  message: string;
  receiver: string;
  room_id: string;
  sender: string;
  updated: string;
}

const MESSAGES_PER_PAGE = 50;

export default function ChatApp() {
  const [chatData, setChatData] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const selectedContact = searchParams.get("conversationId");
  const receiverId = searchParams.get("receiverId");
  const names = searchParams.get("name");

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);

  const { data: user } = useUser();
  const currentUserId = user?.id;

  const handelPushToChat = (id: string, receiverId: string, name: string) => {
    router.push(
      `${pathName}?conversationId=${id}&receiverId=${receiverId}&name=${name}`,
    );
  };

  useEffect(() => {
    if (selectedContact) {
      fetchChatData(1);
    }
  }, [selectedContact]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
    setShowScrollButton(false);
  }, []);

  const fetchChatData = async (currentPage: number, isLoadMore = false) => {
    if (!selectedContact) return;

    try {
      setIsLoading(true);
      const result = await pb
        .collection("message")
        .getList(currentPage, MESSAGES_PER_PAGE, {
          filter: `room_id = "${selectedContact}"`,
          sort: "created",
        });

      setTotalItems(result.totalItems);

      if (isLoadMore) {
        if (scrollAreaRef.current) {
          previousScrollHeightRef.current = scrollAreaRef.current.scrollHeight;
        }

        setChatData((prev) => {
          const existingIds = new Set(prev.map((msg) => msg.id));
          const newMessages = result.items.filter(
            (msg) => !existingIds.has(msg.id),
          );
          return [...(newMessages as Message[]), ...prev];
        });
      } else {
        setChatData(result.items as Message[]);
        setTimeout(() => scrollToBottom("auto"), 100);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (previousScrollHeightRef.current && scrollAreaRef.current) {
      const newScrollHeight = scrollAreaRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - previousScrollHeightRef.current;
      scrollAreaRef.current.scrollTop = scrollDiff;
      previousScrollHeightRef.current = 0;
    }
  }, [chatData]);

  const handleScroll = useCallback(() => {
    if (!scrollAreaRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

    setIsUserScrolling(scrollTop > 0);
    setShowScrollButton(!isAtBottom && scrollTop > 100);
  }, []);

  useEffect(() => {
    if (!selectedContact) return;

    setChatData([]);
    setPage(1);
    fetchChatData(1, false);

    pb.collection("message").subscribe("*", (e) => {
      console.log("Real-time message:", e.action, e.record);

      if (e.action === "create") {
        const newMessage = e.record as Message;

        if (newMessage.room_id === selectedContact) {
          setChatData((prev) => {
            if (prev.some((msg) => msg.id === newMessage.id)) return prev;

            const updated = [...prev, newMessage];
            setTimeout(() => scrollToBottom("smooth"), 100);

            return updated;
          });
        }
      } else if (e.action === "update") {
        const updatedMessage = e.record as Message;
        if (updatedMessage.room_id === selectedContact) {
          setChatData((prev) =>
            prev.map((msg) =>
              msg.id === updatedMessage.id ? updatedMessage : msg,
            ),
          );
        }
      } else if (e.action === "delete") {
        setChatData((prev) => prev.filter((msg) => msg.id !== e.record.id));
      }
    });

    return () => {
      pb.collection("message").unsubscribe("*");
    };
  }, [selectedContact, currentUserId, scrollToBottom]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchChatData(nextPage, true);
  };

  const hasMore = chatData.length < totalItems;

  const handleSendMessage = async () => {
    if (
      !inputMessage.trim() ||
      !selectedContact ||
      !currentUserId ||
      !receiverId
    ) {
      return toast.error("Please enter a message.");
    }

    try {
      const newMessage = {
        room_id: selectedContact,
        sender: currentUserId,
        receiver: receiverId,
        message: inputMessage.trim(),
        is_seen_receiver: "false",
      };

      await pb.collection("message").create(newMessage);
      const room = await pb
        .collection("chat_room")
        .getFirstListItem(`room_id = "${selectedContact}"`);

      await pb.collection("chat_room").update(room.id, {
        last_message_send: new Date().toISOString(),
      });
      setInputMessage("");

      setTimeout(() => scrollToBottom("smooth"), 100);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[92dvh] bg-[var(--palette-bg)]">
      {/* Contacts List */}
      <div
        className={`
        ${selectedContact ? "hidden md:flex" : "flex"}
        w-full md:w-96 flex-col bg-white shadow-sm
      `}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 bg-white">
          <h1 className="text-2xl font-bold text-[var(--palette-text)]">
            Messages
          </h1>
        </div>
        <ContactsList
          selectedContact={selectedContact}
          setSelectedContact={handelPushToChat}
        />
      </div>

      {/* Chat Area */}
      <div
        className={`
        ${selectedContact ? "flex" : "hidden md:flex"}
        flex-1 flex-col bg-white
      `}
      >
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-4 border-b border-gray-200 px-4 md:px-6 py-4 bg-white shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-gray-100 rounded-full"
                onClick={() => router.push(pathName)}
              >
                <ArrowLeft className="h-5 w-5 text-[var(--palette-text)]" />
              </Button>
              <Avatar className="h-11 w-11 border-2 border-[var(--palette-btn)]/20">
                <AvatarFallback className="bg-[var(--palette-accent-2)] text-white font-semibold">
                  {names?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold text-[var(--palette-text)] text-lg">
                  {names}
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 relative overflow-hidden bg-[var(--palette-bg)]">
              <ScrollArea
                className="h-full px-4 md:px-6 py-6"
                ref={scrollAreaRef}
                onScroll={handleScroll}
              >
                <div className="flex flex-col gap-4 max-w-5xl mx-auto">
                  {/* Load More Button */}
                  {hasMore && (
                    <div className="flex justify-center mb-2">
                      <Button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        variant="outline"
                        size="sm"
                        className="rounded-full border-[var(--palette-accent-1)]/20 hover:bg-white hover:border-[var(--palette-btn)] transition-all"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Load Previous Messages"
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Messages */}
                  {chatData.map((message, index) => {
                    const isSent = message.sender === currentUserId;
                    const showAvatar =
                      index === 0 ||
                      chatData[index - 1].sender !== message.sender;

                    return (
                      <div
                        key={message.id}
                        className={`flex gap-2 ${
                          isSent ? "justify-end" : "justify-start"
                        } ${showAvatar ? "mt-2" : "mt-0.5"}`}
                      >
                        {!isSent && showAvatar && (
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className="bg-[var(--palette-accent-1)] text-white text-xs">
                              {names?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        {!isSent && !showAvatar && <div className="w-8" />}

                        <div
                          className={`
                            max-w-[85%] md:max-w-[60%] rounded-2xl px-4 py-2.5 shadow-sm
                            ${
                              isSent
                                ? "bg-[var(--palette-btn)] text-white rounded-br-md"
                                : "bg-white text-[var(--palette-text)] border border-gray-200 rounded-bl-md"
                            }
                          `}
                        >
                          <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                            {message.message}
                          </p>
                          <span
                            className={`text-[11px] mt-1.5 block ${
                              isSent ? "text-white/80" : "text-gray-500"
                            }`}
                          >
                            {new Date(message.created).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Scroll to Bottom Button */}
              {showScrollButton && (
                <Button
                  size="icon"
                  className="absolute bottom-6 right-6 bg-[var(--palette-btn)] hover:bg-[var(--palette-accent-3)] text-white rounded-full shadow-lg h-12 w-12 transition-all"
                  onClick={() => scrollToBottom("smooth")}
                >
                  <ArrowDown className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 px-4 md:px-6 py-4 bg-white">
              <div className="flex items-end gap-3 max-w-5xl mx-auto">
                <Input
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 rounded-full border-gray-300 focus:border-[var(--palette-btn)] focus:ring-[var(--palette-btn)] px-5 py-6 text-[15px] resize-none"
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-[var(--palette-btn)] hover:bg-[var(--palette-accent-3)] text-white rounded-full h-12 w-12 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-[var(--palette-bg)]">
            <div className="text-center px-6">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--palette-btn)]/10 flex items-center justify-center">
                <Send className="h-10 w-10 text-[var(--palette-btn)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--palette-text)] mb-2">
                Welcome to Messages
              </h2>
              <p className="text-gray-500">
                Select a conversation to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
