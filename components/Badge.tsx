export default function Badge({ text, className = "" }: { text: string; className?: string }) {
  return <span className={`badge ${className || "bg-gray-100 text-gray-700 border-gray-300"}`}>{text}</span>;
}
