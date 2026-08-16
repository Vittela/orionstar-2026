import { Check, X } from "lucide-react";

export function ComparisonPreview() {
  return (
    <div className="comparison-preview">
      <span className="comparison-preview__page" />
      <span className="comparison-preview__arrow">→</span>
      <span className="comparison-preview__status comparison-preview__status--partial">OCR</span>
      <span className="comparison-preview__arrow">→</span>
      <span className="comparison-preview__status comparison-preview__status--pass">EPUB</span>
      <X className="comparison-preview__x" size={13} />
      <Check className="comparison-preview__check" size={14} />
    </div>
  );
}
