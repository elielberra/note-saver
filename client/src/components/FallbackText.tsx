import "./FallbackText.css";

export default function FallbackText({ text }: { text: string }) {
  return (
    <div id="fallback-text-section">
      <p id="text">{text}</p>
    </div>
  );
}
