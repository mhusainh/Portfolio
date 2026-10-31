import React from "react";

interface MarkdownRendererProps {
  content?: string | null;
  className?: string;
  clamp?: number; // optional line clamp (e.g. 3)
}

export function MarkdownRenderer({ content, className = "", clamp }: MarkdownRendererProps) {
  if (!content || !content.trim()) return null;

  // Split into paragraphs by double linebreaks (standard Markdown)
  // while preserving single linebreaks within lists or code
  const rawParagraphs = content.split(/\n\s*\n/);
  const nodes: React.ReactNode[] = [];

  rawParagraphs.forEach((para, pIdx) => {
    const trimmedPara = para.trim();
    if (!trimmedPara) return;

    // Split lines inside this paragraph block
    const lines = trimmedPara.split("\n");

    // Check if entire block is a list
    const isList = lines.some((l) => /^[-*•]\s+/.test(l.trim()) || /^\d+[.)]\s+/.test(l.trim()));

    if (!isList) {
      // Check for headers
      if (trimmedPara.startsWith("### ")) {
        nodes.push(
          <h4 key={`h3-${pIdx}`} className="font-black uppercase text-base mt-3 mb-1 break-words">
            {renderFormattedInline(trimmedPara.slice(4))}
          </h4>
        );
        return;
      }
      if (trimmedPara.startsWith("## ")) {
        nodes.push(
          <h3 key={`h2-${pIdx}`} className="font-black uppercase text-lg mt-3 mb-1.5 break-words">
            {renderFormattedInline(trimmedPara.slice(3))}
          </h3>
        );
        return;
      }
      if (trimmedPara.startsWith("# ")) {
        nodes.push(
          <h2 key={`h1-${pIdx}`} className="font-black uppercase text-xl mt-4 mb-2 break-words">
            {renderFormattedInline(trimmedPara.slice(2))}
          </h2>
        );
        return;
      }
      if (trimmedPara.startsWith("> ")) {
        nodes.push(
          <blockquote key={`quote-${pIdx}`} className="border-l-2 border-[#635BFF] dark:border-[#9D93FF] pl-3 italic my-2 text-sm opacity-90 break-words">
            {renderFormattedInline(trimmedPara.slice(2))}
          </blockquote>
        );
        return;
      }

      // Regular paragraph: join soft linebreaks with a space so it forms one flowing block
      // This allows CSS text-justify to wrap and justify lines naturally!
      const joinedParagraphText = lines.map((l) => l.trim()).join(" ");
      nodes.push(
        <p
          key={`p-${pIdx}`}
          className="leading-relaxed my-1.5 text-justify [text-justify:inter-word] break-words [overflow-wrap:anywhere]"
        >
          {renderFormattedInline(joinedParagraphText)}
        </p>
      );
      return;
    }

    // It's a list block
    let currentListItems: string[] = [];
    let isNumbered = false;

    const flushCurrentList = (key: string) => {
      if (currentListItems.length === 0) return null;
      const items = [...currentListItems];
      const num = isNumbered;
      currentListItems = [];

      if (num) {
        return (
          <ol key={`${key}-ol`} className="list-decimal pl-5 space-y-1 my-2 font-inherit break-words [overflow-wrap:anywhere]">
            {items.map((it, idx) => (
              <li key={idx} className="leading-relaxed font-inherit break-words [overflow-wrap:anywhere]">
                {renderFormattedInline(it)}
              </li>
            ))}
          </ol>
        );
      }

      return (
        <ul key={`${key}-ul`} className="list-disc pl-5 space-y-1 my-2 font-inherit break-words [overflow-wrap:anywhere]">
          {items.map((it, idx) => (
            <li key={idx} className="leading-relaxed font-inherit break-words [overflow-wrap:anywhere]">
              {renderFormattedInline(it)}
            </li>
          ))}
        </ul>
      );
    };

    lines.forEach((line, lIdx) => {
      const trimmedLine = line.trim();
      const bulletMatch = trimmedLine.match(/^[-*•]\s+(.+)$/);
      if (bulletMatch) {
        if (isNumbered) {
          const flushed = flushCurrentList(`p${pIdx}-l${lIdx}-sw`);
          if (flushed) nodes.push(flushed);
        }
        isNumbered = false;
        currentListItems.push(bulletMatch[1]);
        return;
      }

      const numberMatch = trimmedLine.match(/^\d+[.)]\s+(.+)$/);
      if (numberMatch) {
        if (!isNumbered && currentListItems.length > 0) {
          const flushed = flushCurrentList(`p${pIdx}-l${lIdx}-sw`);
          if (flushed) nodes.push(flushed);
        }
        isNumbered = true;
        currentListItems.push(numberMatch[1]);
        return;
      }

      // Non-list line within list block
      const flushed = flushCurrentList(`p${pIdx}-l${lIdx}`);
      if (flushed) nodes.push(flushed);
      if (trimmedLine) {
        nodes.push(
          <p key={`p${pIdx}-text-${lIdx}`} className="leading-relaxed my-1 text-justify [text-justify:inter-word] break-words [overflow-wrap:anywhere]">
            {renderFormattedInline(trimmedLine)}
          </p>
        );
      }
    });

    const finalFlushed = flushCurrentList(`p${pIdx}-end`);
    if (finalFlushed) nodes.push(finalFlushed);
  });

  const clampStyle: React.CSSProperties = clamp
    ? {
        display: "-webkit-box",
        WebkitLineClamp: clamp,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }
    : {};

  return (
    <div
      style={clampStyle}
      className={`space-y-1.5 break-words [overflow-wrap:anywhere] max-w-full ${className}`}
    >
      {nodes}
    </div>
  );
}

/**
 * Parses inline formatting:
 * **bold**, *italic*, `code`, and [link text](url)
 */
function renderFormattedInline(text: string): React.ReactNode {
  // Regex to split by inline tokens
  // Matches: **bold**, *italic*, `code`, [text](url)
  const pattern = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold: **text**
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={index} className="font-black text-black dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return (
        <em key={index} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Code: `code`
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 bg-[#E2FF00]/30 dark:bg-[#9D93FF]/30 border border-black/20 dark:border-white/20 rounded font-mono text-[0.88em] font-bold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Link: [label](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="underline font-bold text-[#635BFF] dark:text-[#9D93FF] hover:text-[#FF6B35] transition-colors"
        >
          {label}
        </a>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}
