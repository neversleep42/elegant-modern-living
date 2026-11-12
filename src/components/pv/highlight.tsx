export function Highlighted({ text }: { text: string }) {
  const parts = text.split(/(\{\{\s*\w+\s*\}\})/g);
  return <>{parts.map((p, i) => (/^\{\{/.test(p) ? <span key={i} className="var-chip">{p}</span> : <span key={i}>{p}</span>))}</>;
}
