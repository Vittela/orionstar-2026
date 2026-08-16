import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function ArtifactModal({ title, eyebrow, onClose, children, toolbar }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <section className="artifact-modal" role="dialog" aria-modal="true" aria-labelledby="viewer-title">
      <header className="artifact-modal__header">
        <div>
          <p>{eyebrow}</p>
          <h2 id="viewer-title">{title}</h2>
        </div>
        <div className="artifact-modal__actions">
          {toolbar}
          <button ref={closeButtonRef} className="icon-button icon-button--close" type="button" onClick={onClose}>
            <X size={20} aria-hidden="true" />
            <span>Fechar</span>
          </button>
        </div>
      </header>
      <div className="artifact-modal__content">{children}</div>
    </section>
  );
}
