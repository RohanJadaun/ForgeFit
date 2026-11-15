function cleanReply(value) {
  return String(value || "")
    .replace(/\\?<br\s*\/?\s*>/gi, "; ")
    .replace(/&#x20;|&#32;|&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\\([|*_.])/g, "$1")
    .replace(/<\/?[a-z][^>]*>/gi, "");
}

function inlineFormat(value) {
  return value.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    return part;
  });
}

const tableCells = (line) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
const isTableDivider = (line) => /^\|?[\s:|-]+\|?$/.test(line.trim()) && line.includes("-");

function CoachReply({ text }) {
  const lines = cleanReply(text).replace(/\r/g, "").split("\n").map((line) => line.trim()).filter(Boolean);
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    if (lines[index].includes("|") && lines[index + 1] && isTableDivider(lines[index + 1])) {
      const headers = tableCells(lines[index]);
      index += 2;
      const rows = [];
      while (index < lines.length && lines[index].includes("|")) rows.push(tableCells(lines[index++]));
      blocks.push(<div key={`table-${index}`} className="space-y-2">{rows.map((row, rowIndex) => {
        const title = row[0] || "Details";
        const details = headers.slice(1).flatMap((header, cellIndex) => {
          if (/why|reason|helps/i.test(header)) return [];
          const value = row[cellIndex + 1];
          return value ? [<span key={header}><strong>{header}:</strong> {inlineFormat(value)}</span>] : [];
        });
        return <div key={`row-${rowIndex}`} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700"><strong className="text-slate-900">{inlineFormat(title)}</strong>{details.length > 0 && <ul className="mt-1 list-disc space-y-0.5 pl-5">{details.map((detail, detailIndex) => <li key={detailIndex}>{detail}</li>)}</ul>}</div>;
      })}</div>);
      continue;
    }

    const heading = lines[index].match(/^#{1,3}\s+(.+)$/) || lines[index].match(/^\*\*(.+)\*\*$/);
    if (heading) {
      blocks.push(<h4 key={`heading-${index}`} className="font-semibold text-slate-900">{inlineFormat(heading[1].replace(/^\*\*|\*\*$/g, ""))}</h4>);
      index += 1;
      continue;
    }

    const listItem = lines[index].match(/^(?:[-*•]|\d+[.)])\s+(.+)$/);
    if (listItem) {
      const ordered = /^\d+[.)]/.test(lines[index]);
      const items = [];
      while (index < lines.length) {
        const match = lines[index].match(/^(?:[-*•]|\d+[.)])\s+(.+)$/);
        if (!match) break;
        items.push(match[1]);
        index += 1;
      }
      const List = ordered ? "ol" : "ul";
      blocks.push(<List key={`list-${index}`} className={`${ordered ? "list-decimal" : "list-disc"} space-y-1 pl-5`}>{items.map((item, itemIndex) => <li key={itemIndex}>{inlineFormat(item)}</li>)}</List>);
      continue;
    }

    const paragraph = [lines[index++]];
    while (index < lines.length && !/^#{1,3}\s+/.test(lines[index]) && !/^(?:[-*•]|\d+[.)])\s+/.test(lines[index]) && !(lines[index].includes("|") && lines[index + 1] && isTableDivider(lines[index + 1]))) paragraph.push(lines[index++]);
    const sentences = paragraph.join(" ").split(/(?<=[.!?])\s+(?=[A-Z0-9])/).filter(Boolean);
    if (sentences.length > 2 && paragraph.join(" ").length > 180) {
      blocks.push(<ul key={`sentences-${index}`} className="list-disc space-y-1 pl-5">{sentences.slice(0, 4).map((sentence, sentenceIndex) => <li key={sentenceIndex}>{inlineFormat(sentence)}</li>)}</ul>);
    } else {
      blocks.push(<p key={`paragraph-${index}`}>{inlineFormat(paragraph.join(" "))}</p>);
    }
  }

  return <div className="space-y-2 leading-relaxed">{blocks}</div>;
}

export default CoachReply;
