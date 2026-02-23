import DOMPurify from "isomorphic-dompurify";

// Simple helper to check for HTML tags
const isHtml = (text: string) => /<[a-z][\s\S]*>/i.test(text);

export default function DescriptionComponent({ params }: { params: any }) {
  const description = params ?? "No description available.";

  // CASE A: It is HTML (from Tiptap/CKEditor)
  if (isHtml(description)) {
    return (
      <div
        className=" leading-relaxed prose prose-sm max-w-full mx-0 w-full"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
      />
    );
  }

  // CASE B: It is just plain text
  return <p className="text-gray-600 leading-relaxed">{description}</p>;
}
