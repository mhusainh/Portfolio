import React from "react";

interface MarkdownRendererProps {
  content?: string | null;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content || !content.trim()) return null;

  // Split lines
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];

  let currentListItems: string[] = [];
  let isNumberedList = false;

  const flushList = (keyPrefix: string) => {
    if (currentListItems.length === 0) return null;
    const items = [...currentListItems];
    const numbered = isNumberedList;
    currentListItems = [];
    isNumberedList = false;

    if (numbered) {
      return (
        <ol key={`${keyPrefix}-ol`} className="list-decimal pl-5 space-y-1 my-2 font-sans text-sm md:text-base">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderFormattedInline(item)}
            </li>
          ))}
        </ol>
      );
    }

    return (
      <ul key={`${keyPrefix}-ul`} className="list-disc pl-5 space-y-1 my-2 font-sans text-sm md:text-base">
        {items.map((item, idx) => (
          <li key={idx} className="leading-relaxed">
            {renderFormattedInline(item)}
          </li>
        ))}
      </ul>
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Empty line -> flush list and skip or make small space
    if (!trimmed) {
      const flushed = flushList(`line-${i}`);
      if (flushed) nodes.push(flushed);
      continue;
    }

    // Unordered bullet list: starts with '- ' or '* ' or '• '
    const bulletMatch = trimmed.match(/^[-*•]\s+(.+)$/);
    if (bulletMatch) {
      if (isNumberedList) {
        const flushed = flushList(`line-${i}-sw`);
        if (flushed) nodes.push(flushed);
      }
      isNumberedList = false;
      currentListItems.push(bulletMatch[1]);
      continue;
    }

    // Numbered list: starts with '1. ', '2. ', etc.
    const numberMatch = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (numberMatch) {
      if (!isNumberedList && currentListItems.length > 0) {
        const flushed = flushList(`line-${i}-sw`);
        if (flushed) nodes.push(flushed);
      }
      isNumberedList = true;
      currentListItems.push(numberMatch[1]);
      continue;
    }

    // Flush any pending list before regular elements
    const flushed = flushList(`line-${i}-pre`);
    if (flushed) nodes.push(flushed);

    // Headers
    if (trimmed.startsWith("### ")) {
      nodes.push(
        <h4 key={`h3-${i}`} className="font-black uppercase text-base mt-3 mb-1">
          {renderFormattedInline(trimmed.slice(4))}
        </h4>
      );
      continue;
    }
    if (trimmed.startsWith("## ")) {
      nodes.push(
        <h3 key={`h2-${i}`} className="font-black uppercase text-lg mt-3 mb-1.5">
          {renderFormattedInline(trimmed.slice(3))}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith("# ")) {
      nodes.push(
        <h2 key={`h1-${i}`} className="font-black uppercase text-xl mt-4 mb-2">
          {renderFormattedInline(trimmed.slice(2))}
        </h2>
      );
      continue;
    }

    // Blockquote: starts with '> '
    if (trimmed.startsWith("> ")) {
      nodes.push(
        <blockquote key={`quote-${i}`} className="border-l-2 border-[#635BFF] dark:border-[#9D93FF] pl-3 italic my-2 text-sm opacity-90">
          {renderFormattedInline(trimmed.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Regular paragraph
    nodes.push(
      <p key={`p-${i}`} className="leading-relaxed my-1">
        {renderFormattedInline(trimmed)}
      </p>
    );
  }

  // Final flush if ended with list
  const finalFlushed = flushList("line-end");
  if (finalFlushed) nodes.push(finalFlushed);

  return <div className={`space-y-1.5 text-justify ${className}`}>{nodes}</div>;
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
