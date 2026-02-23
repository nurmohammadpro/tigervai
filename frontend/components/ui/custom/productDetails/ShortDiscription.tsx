import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const ShortDescription = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(getComputedStyle(textRef.current).lineHeight);
      const maxHeight = lineHeight * 2; // 2 lines
      setShouldShowButton(textRef?.current?.scrollHeight > maxHeight);
    }
  }, [text]);

  return (
    <div className="shadow rounded border border-border bg-card">
      <div className="p-2">
        <div className="text-black relative">
          <div
            ref={textRef}
            className={`transition-all duration-300 ${
              isExpanded ? "" : "line-clamp-2 pr-16"
            }`}
            style={{
              display: "-webkit-box",
              WebkitLineClamp: isExpanded ? "unset" : 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {text}
          </div>
          {shouldShowButton && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="absolute right-2 bottom-2 text-[#4692F5] hover:text-[#4692F5]/80 text-xs sm:text-sm font-medium bg-card"
            >
              See more
            </button>
          )}
          {shouldShowButton && isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="mt-1 text-[#4692F5] hover:text-[#4692F5]/80 text-xs sm:text-sm font-medium inline-block"
            >
              See less
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShortDescription;
