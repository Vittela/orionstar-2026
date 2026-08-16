import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function ArtifactModal({ title, eyebrow, onClose, children, toolbar }) {
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div className="artifact-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} className="artifact-modal" role="dialog" aria-modal="true" aria-labelledby="viewer-title">
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
    </div>
  );
}
