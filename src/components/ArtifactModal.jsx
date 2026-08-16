import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export function ArtifactModal({ title, eyebrow, onClose, children, toolbar }) {
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const titleRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    const pageContent = document.getElementById("site-content");
    const wasPageInert = pageContent?.inert ?? false;
    const previousAriaHidden = pageContent?.getAttribute("aria-hidden");
    document.body.style.overflow = "hidden";
    titleRef.current?.focus();
    if (pageContent) {
      pageContent.inert = true;
      pageContent.setAttribute("aria-hidden", "true");
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = [...(dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
      ) ?? [])].filter((element) => element.getClientRects().length > 0 && !element.closest("[inert]"));
      if (!focusable.length) {
        event.preventDefault();
        titleRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && [first, titleRef.current].includes(document.activeElement)) {
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
      if (pageContent) {
        pageContent.inert = wasPageInert;
        if (previousAriaHidden === null) pageContent.removeAttribute("aria-hidden");
        else pageContent.setAttribute("aria-hidden", previousAriaHidden);
      }
      window.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [onClose]);

  return createPortal(
    <div className="artifact-modal-backdrop">
      <button className="modal-backdrop-dismiss" type="button" tabIndex="-1" aria-hidden="true" onClick={onClose} />
      <section ref={dialogRef} className="artifact-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="artifact-modal__header">
          <div>
            <p>{eyebrow}</p>
            <h2 ref={titleRef} id={titleId} tabIndex="-1">{title}</h2>
          </div>
          <div className="artifact-modal__actions">
            {toolbar}
            <button ref={closeButtonRef} className="icon-button icon-button--close" type="button" aria-label="Fechar visualização" onClick={onClose}>
              <X size={20} aria-hidden="true" />
              <span>Fechar</span>
            </button>
          </div>
        </header>
        <div className="artifact-modal__content">{children}</div>
      </section>
    </div>,
    document.body,
  );
}
