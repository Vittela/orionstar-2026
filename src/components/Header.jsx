import { ExternalLink } from "lucide-react";
import { SOURCES } from "../data/sources";

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

      <nav className="project-header__references" aria-label="Base normativa do projeto">
        <span>Base normativa</span>
        {[SOURCES.lbi, SOURCES.epubAccessibility, SOURCES.wcag, SOURCES.mathml].map((source) => (
          <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
            {source.shortLabel}<ExternalLink size={11} aria-hidden="true" />
          </a>
        ))}
      </nav>
    </header>
  );
}
