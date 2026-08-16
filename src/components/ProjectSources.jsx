import { SOURCES } from "../data/sources";

const groups = [
  {
    title: "Direitos e acessibilidade",
    sources: [SOURCES.lbi, SOURCES.epubAccessibility, SOURCES.wcag],
  },
  {
    title: "Representação do conteúdo",
    sources: [SOURCES.mathml, SOURCES.pdfReadingOrder, SOURCES.adobeAutoTag],
  },
  {
    title: "Verificação do EPUB",
    sources: [SOURCES.ace, SOURCES.epubCheck],
  },
];

export function ProjectSources() {
  return (
    <footer className="project-sources" aria-labelledby="sources-title">
      <div className="project-sources__heading">
        <h2 id="sources-title">Referências</h2>
        <p>Normas, estudos e ferramentas consultados durante o desenvolvimento.</p>
      </div>
      <div className="source-groups">
        {groups.map((group) => (
          <section key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.shortLabel}<span className="sr-only"> (abre em nova aba)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </footer>
  );
}
