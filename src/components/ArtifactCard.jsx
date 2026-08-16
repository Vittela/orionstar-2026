export function ArtifactCard({ eyebrow, title, description, preview, onOpen, accent }) {
  return (
    <button className="artifact-card" type="button" onClick={onOpen} style={{ "--accent": accent }}>
      <span className="artifact-card__preview" aria-hidden="true">
        {preview}
      </span>
      <span className="artifact-card__body">
        <span className="artifact-card__eyebrow">{eyebrow}</span>
        <span className="artifact-card__title">{title}</span>
        <span className="artifact-card__description">{description}</span>
      </span>
    </button>
  );
}
