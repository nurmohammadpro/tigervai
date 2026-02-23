"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Search, Clock, X, ArrowLeft } from "lucide-react";
import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- Sub-Component: Search List Content ---
interface SearchListProps {
  isDesktop: boolean;
  recentSearches: string[];
  searchQuery: string;
  handleSearch: (q: string) => void;
  removeRecentSearch: (q: string, e: React.MouseEvent) => void;
  clearRecentSearches: () => void;
}

const SearchContentList = ({
  isDesktop,
  recentSearches,
  searchQuery,
  handleSearch,
  removeRecentSearch,
  clearRecentSearches,
}: SearchListProps) => {
  return (
    <CommandList
      className={cn(!isDesktop && "max-h-[calc(100vh-120px)] pb-10")}
    >
      <CommandEmpty>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="rounded-full bg-gray-100 p-4 mb-3">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            No results found
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Try searching with different keywords
          </p>
          {searchQuery && (
            <Button
              onClick={() => handleSearch(searchQuery)}
              size="sm"
              className="bg-[var(--palette-btn)] hover:opacity-90"
            >
              Search for "{searchQuery}"
            </Button>
          )}
        </div>
      </CommandEmpty>

      {recentSearches.length > 0 && (
        <CommandGroup heading="Recent Searches">
          {recentSearches.map((search, index) => (
            <CommandItem
              key={`recent-${index}`}
              onSelect={() => handleSearch(search)}
              className="cursor-pointer group flex items-center justify-between py-3"
            >
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-400" />
                <span>{search}</span>
              </div>
              <button
                onClick={(e) => removeRecentSearch(search, e)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-3 w-3 text-gray-400 hover:text-red-500" />
              </button>
            </CommandItem>
          ))}
          <CommandItem
            onSelect={clearRecentSearches}
            className="cursor-pointer justify-center text-xs text-red-500 hover:text-red-600 hover:bg-red-50 mt-2"
          >
            Clear all recent searches
          </CommandItem>
        </CommandGroup>
      )}

      {recentSearches.length === 0 && !searchQuery && (
        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
          <div className="rounded-full bg-gray-100 p-4 mb-3">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            No recent searches
          </p>
          <p className="text-xs text-gray-500">
            Your search history will appear here
          </p>
        </div>
      )}
    </CommandList>
  );
};

export function SearchModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkDesktop = () =>
      setIsDesktop(window.matchMedia("(min-width: 1024px)").matches);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Load recent searches
  useEffect(() => {
    if (open) {
      const recent = localStorage.getItem("recentSearches");
      if (recent) {
        try {
          setRecentSearches(JSON.parse(recent));
        } catch {
          setRecentSearches([]);
        }
      }
    }
  }, [open]);

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(
      0,
      5
    );
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    router.push(`/search-product?q=${encodeURIComponent(query)}`);
    setOpen(false);
    setSearchQuery("");
  };

  const removeRecentSearch = (search: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== search);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const listProps = {
    isDesktop,
    recentSearches,
    searchQuery,
    handleSearch,
    removeRecentSearch,
    clearRecentSearches,
  };

  return (
    <>
      {/* Trigger Button */}
      {isDesktop ? (
        // Desktop: Search Icon Button
        <Button
          onClick={() => setOpen(true)}
          variant="ghost"
          size="icon"
          className="relative h-9 w-9  bg-palette-btn/5 rounded-full hover:bg-gray-100"
        >
          <Search className="h-5 w-5 text-gray-600" />
          <span className="sr-only">Search</span>
        </Button>
      ) : (
        // Mobile: Input-like Button
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 w-full pl-4 border border-gray-200 rounded-full bg-white hover:bg-gray-50 transition-colors text-left group"
        >
          <span className="text-sm text-gray-500 flex-1 truncate">
            Search...
          </span>
          <p className=" p-3 rounded-full bg-gray-950">
            <Search className="h-4 w-4 text-white group-hover:text-[var(--palette-btn)] transition-colors " />
          </p>
        </button>
      )}

      {isDesktop ? (
        /* --- DESKTOP: Command Dialog --- */
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput
            placeholder="Search products, brands, categories..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
          />
          <SearchContentList {...listProps} />
          <div className="border-t bg-gray-50 px-4 py-3">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Search for anything...</span>
              <div className="flex items-center gap-2">
                <Kbd>ESC</Kbd> to close
              </div>
            </div>
          </div>
        </CommandDialog>
      ) : (
        /* --- MOBILE: Sheet with Command --- */
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="bottom"
            className="w-full h-[100dvh] p-0 bg-white border-0"
          >
            <Command className="h-full border-none shadow-none">
              {/* Custom Mobile Header with Input */}
              <div className="flex items-center gap-2 p-2 border-b">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="shrink-0"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-[var(--palette-btn)]/20 transition-all"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSearch(searchQuery)
                    }
                    autoFocus
                  />
                </div>
              </div>

              {/* Search Results List */}
              <div className="px-2 py-2 h-full overflow-y-auto">
                <SearchContentList {...listProps} />
              </div>
            </Command>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
