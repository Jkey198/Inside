interface RichTextProps {
  text: string;
}

// Content only uses `inline code`, so a full markdown parser would be overkill
export function RichText({ text }: RichTextProps) {
  return (
    <>
      {text.split("`").map((part, index) =>
        index % 2 === 1 ? (
          <code
            key={index}
            className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.85em] text-slate-800"
          >
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}
