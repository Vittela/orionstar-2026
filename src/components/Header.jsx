export function Header() {
  return (
    <header className="project-header">
      <div className="event-mark" aria-label="OrionStar 2026">
        <span>OrionHub Lab · UFAL</span>
        <span aria-hidden="true" className="event-mark__line" />
        <strong>OrionStar 2026</strong>
      </div>

      <h1>
        Reconstrução semântica acessível
        <span>de livros digitalizados</span>
      </h1>

      <p className="project-header__summary">
        De PDFs e imagens a EPUBs navegáveis por tecnologias assistivas
      </p>

      <p className="project-header__author">
        Projeto de <strong>João Victor Correia de Araujo da Silva</strong>
      </p>
    </header>
  );
}
