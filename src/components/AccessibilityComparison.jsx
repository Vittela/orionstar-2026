import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

const observations = [
  ["Papel no fluxo", "Saída intermediária de reconhecimento e transcrição, adequada para revisão textual.", "Publicação final reconstruída, empacotada para leitura e navegação assistiva."],
  ["Texto e fórmulas", "Transcrição legível e fórmulas preservadas em LaTeX, inclusive frações, raízes e símbolos.", "Texto revisado em Unicode e expressões convertidas para MathML com alternativas textuais."],
  ["Estrutura semântica", "O arquivo recebido é texto corrido: títulos e exemplos são reconhecíveis visualmente, mas não usam marcações de heading.", "Capítulo, seções, notas e figuras são representados por elementos semânticos explícitos."],
  ["Ordem de leitura", "Lineariza o conteúdo, mas posiciona a caixa “No computador” e a Figura 1.3 antes do trecho principal correspondente.", "A sequência foi reorganizada editorialmente para leitura contínua e navegação por seções."],
  ["Conteúdo visual", "Preserva as chamadas e legendas das figuras, mas não incorpora as três imagens nem descreve seu conteúdo.", "Incorpora as figuras, legendas, textos alternativos e descrições detalhadas."],
  ["Navegação e metadados", "Não se propõe a fornecer sumário EPUB, landmarks ou metadados de acessibilidade.", "Inclui documento de navegação, landmarks, idioma e metadados de acessibilidade."],
  ["Intervenção humana", "Oferece uma base editável de boa qualidade, mas ainda exige organização, conferência e complementação.", "Registra o resultado da revisão: corrige ordem, adiciona semântica e produz equivalentes para conteúdo não textual."],
];

function MarkdownOutputViewer() {
  const [source, setSource] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${import.meta.env.BASE_URL}artifacts/ocr-avancado-mathpix.md`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Não foi possível carregar o Markdown.");
        return response.text();
      })
      .then(setSource)
      .catch((requestError) => requestError.name !== "AbortError" && setError(requestError.message));
    return () => controller.abort();
  }, []);

  if (error) return <div className="research-viewer__status">{error}</div>;
  if (!source) return <div className="research-viewer__status">Carregando transcrição…</div>;

  return <article className="markdown-render"><ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{source}</ReactMarkdown></article>;
}

function EpubOutputViewer() {
  const [view, setView] = useState("content");
  const base = import.meta.env.BASE_URL;
  const source = view === "toc" ? `${base}epub-preview/EPUB/nav.xhtml` : `${base}epub-preview/EPUB/text/content.xhtml`;

  return (
    <div className="epub-embedded-viewer">
      <nav aria-label="Navegação da visualização EPUB">
        <button className={view === "toc" ? "is-active" : ""} type="button" aria-pressed={view === "toc"} onClick={() => setView("toc")}>Sumário</button>
        <button className={view === "content" ? "is-active" : ""} type="button" aria-pressed={view === "content"} onClick={() => setView("content")}>Conteúdo</button>
      </nav>
      <iframe key={source} src={source} title={view === "toc" ? "Sumário do EPUB reconstruído" : "Conteúdo do EPUB reconstruído"} sandbox="allow-same-origin allow-popups" />
    </div>
  );
}

function EvidencePanel({ id, title, description, activeStage, children, action }) {
  return (
    <article className={`research-panel research-panel--${id}${activeStage === id ? " is-mobile-active" : ""}`}>
      <header>
        <div><h3>{title}</h3><p>{description}</p></div>
        {action}
      </header>
      <div className="research-panel__viewport">{children}</div>
    </article>
  );
}

export function AccessibilityComparison() {
  const [activeStage, setActiveStage] = useState("markdown");
  const base = import.meta.env.BASE_URL;

  return (
    <div className="academic-comparison">
      <p className="comparison-lead">
        A mesma página é apresentada em três etapas: a imagem digitalizada, a transcrição automática e o EPUB reconstruído. Os painéis permitem consultar o conteúdo de cada arquivo; a tabela registra as diferenças observadas.
      </p>

      <nav className="comparison-mobile-tabs" aria-label="Selecionar etapa para visualizar">
        <button className={activeStage === "source" ? "is-active" : ""} type="button" aria-pressed={activeStage === "source"} onClick={() => setActiveStage("source")}>Imagem</button>
        <button className={activeStage === "markdown" ? "is-active" : ""} type="button" aria-pressed={activeStage === "markdown"} onClick={() => setActiveStage("markdown")}>Markdown</button>
        <button className={activeStage === "epub" ? "is-active" : ""} type="button" aria-pressed={activeStage === "epub"} onClick={() => setActiveStage("epub")}>EPUB</button>
      </nav>

      <section className="research-panels" aria-label="Visualização das três etapas">
        <EvidencePanel id="source" title="Imagem de origem" description="Página digitalizada usada no experimento" activeStage={activeStage} action={<a href={`${base}artifacts/captura-de-livro.png`} target="_blank" rel="noreferrer">Abrir imagem</a>}>
          <div className="source-image-viewer"><img src={`${base}artifacts/captura-de-livro.png`} alt="Página digitalizada do capítulo Números reais, usada como fonte do experimento." /></div>
        </EvidencePanel>

        <EvidencePanel id="markdown" title="Transcrição em Markdown" description="Saída automática do Mathpix com fórmulas em LaTeX" activeStage={activeStage} action={<a href={`${base}artifacts/ocr-avancado-mathpix.md`} download>Baixar arquivo</a>}>
          <MarkdownOutputViewer />
        </EvidencePanel>

        <EvidencePanel id="epub" title="EPUB reconstruído" description="Conteúdo reorganizado e enriquecido após revisão" activeStage={activeStage} action={<a href={`${base}artifacts/reconstrucao-validada.epub`} download>Baixar arquivo</a>}>
          <EpubOutputViewer />
        </EvidencePanel>
      </section>

      <section className="comparison-analysis" aria-labelledby="analysis-title">
        <h3 id="analysis-title">Diferenças observadas</h3>
        <div className="analysis-table-wrap">
          <table className="analysis-table">
            <thead><tr><th scope="col">Dimensão</th><th scope="col">Markdown do Mathpix</th><th scope="col">EPUB reconstruído</th></tr></thead>
            <tbody>
              {observations.map(([dimension, markdown, epub]) => <tr key={dimension}><th scope="row">{dimension}</th><td>{markdown}</td><td>{epub}</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>

      <section className="comparison-conclusion">
        <h3>Síntese</h3>
        <p>A transcrição preserva bem o texto e a notação matemática e funciona como base editável. O EPUB acrescenta a revisão da ordem de leitura, marcação estrutural, figuras com descrições, navegação e metadados. Ferramentas automatizadas ajudam na verificação, mas a revisão humana continua necessária.</p>
      </section>
    </div>
  );
}
