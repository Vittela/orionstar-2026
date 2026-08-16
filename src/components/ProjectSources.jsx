import { ExternalLink } from "lucide-react";
import { SOURCES } from "../data/sources";

const groups = [
  {
    title: "Direitos e acessibilidade",
    description: "Base legal e critérios aplicáveis à publicação.",
    sources: [SOURCES.lbi, SOURCES.epubAccessibility, SOURCES.wcag],
  },
  {
    title: "Representação do conteúdo",
    description: "Referências para matemática e ordem de leitura.",
    sources: [SOURCES.mathml, SOURCES.pdfReadingOrder, SOURCES.adobeAutoTag],
  },
  {
    title: "Verificação do EPUB",
    description: "Ferramentas com funções complementares de avaliação.",
    sources: [SOURCES.ace, SOURCES.epubCheck],
  },
];

export function ProjectSources() {
  return (
    <footer className="project-sources" aria-labelledby="sources-title">
      <div className="project-sources__heading">
        <p>Referências</p>
        <h2 id="sources-title">Bases normativas e ferramentas relacionadas</h2>
        <span>Links oficiais utilizados para fundamentar decisões e critérios apresentados nos artefatos.</span>
      </div>
      <div className="source-groups">
        {groups.map((group) => (
          <section key={group.title}>
            <h3>{group.title}</h3>
            <p>{group.description}</p>
            <ul>
              {group.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer">{source.shortLabel}<ExternalLink size={13} aria-hidden="true" /></a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="project-sources__note">
        O <a href={SOURCES.epubCheck.url} target="_blank" rel="noreferrer">EPUBCheck</a> verifica conformidade técnica com as especificações EPUB; o <a href={SOURCES.ace.url} target="_blank" rel="noreferrer">Ace by DAISY</a> auxilia a avaliação automatizada de acessibilidade. Ambos complementam, mas não substituem, revisão humana e testes com tecnologias assistivas.
      </p>
    </footer>
  );
}
