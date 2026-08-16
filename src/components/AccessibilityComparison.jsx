import { useEffect, useState } from "react";
import { Download, ExternalLink, FileCode2, FileImage, Library, List, TextSearch } from "lucide-react";
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
  ["Navegação e metadados", "Não se propõe a fornecer sumário EPUB, landmarks ou metadados de acessibilidade.", "Inclui documento de navegação, landmarks, idioma e metadados da EPUB Accessibility 1.1."],
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
        <button className={view === "toc" ? "is-active" : ""} type="button" onClick={() => setView("toc")}><List size={14} />Sumário</button>
        <button className={view === "content" ? "is-active" : ""} type="button" onClick={() => setView("content")}><Library size={14} />Conteúdo</button>
      </nav>
      <iframe key={source} src={source} title={view === "toc" ? "Sumário do EPUB reconstruído" : "Conteúdo do EPUB reconstruído"} sandbox="allow-same-origin allow-popups" />
    </div>
  );
}

function EvidencePanel({ id, label, title, description, icon, activeStage, children, actions }) {
  return (
    <article className={`research-panel research-panel--${id}${activeStage === id ? " is-mobile-active" : ""}`}>
      <header>
        <span className="research-panel__index">{label}</span>
        <span className="research-panel__icon">{icon}</span>
        <div><h4>{title}</h4><p>{description}</p></div>
        <div className="research-panel__actions">{actions}</div>
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
      <header className="research-heading">
        <div><span>ARTEFATO 3 · ESTUDO COMPARATIVO</span><h3>Reconhecimento de conteúdo e reconstrução acessível</h3></div>
        <dl><div><dt>Objeto</dt><dd>1 página didática digitalizada</dd></div><div><dt>Método</dt><dd>Inspeção estrutural e visual dos arquivos</dd></div></dl>
      </header>

      <section className="research-question" aria-labelledby="research-question-title">
        <TextSearch size={19} /><div><strong id="research-question-title">Questão observada</strong><p>Quais informações são preservadas pela transcrição automatizada e quais dependem de reconstrução semântica e revisão humana para formar uma publicação acessível?</p></div>
      </section>

      <nav className="comparison-mobile-tabs" aria-label="Selecionar estágio para visualizar">
        <button className={activeStage === "source" ? "is-active" : ""} type="button" onClick={() => setActiveStage("source")}>Fonte</button>
        <button className={activeStage === "markdown" ? "is-active" : ""} type="button" onClick={() => setActiveStage("markdown")}>Markdown</button>
        <button className={activeStage === "epub" ? "is-active" : ""} type="button" onClick={() => setActiveStage("epub")}>EPUB</button>
      </nav>

      <section className="research-panels" aria-label="Visualização dos três estágios">
        <EvidencePanel id="source" label="01" title="Imagem de origem" description="Referência visual do conteúdo" icon={<FileImage size={17} />} activeStage={activeStage} actions={<a href={`${base}artifacts/captura-de-livro.png`} target="_blank" rel="noreferrer" aria-label="Abrir imagem em nova aba"><ExternalLink size={15} /></a>}>
          <div className="source-image-viewer"><img src={`${base}artifacts/captura-de-livro.png`} alt="Página digitalizada do capítulo Números reais, usada como fonte do experimento." /></div>
        </EvidencePanel>

        <EvidencePanel id="markdown" label="02" title="Saída Mathpix · Markdown" description="Transcrição automática com LaTeX" icon={<FileCode2 size={17} />} activeStage={activeStage} actions={<a href={`${base}artifacts/ocr-avancado-mathpix.md`} download aria-label="Baixar Markdown"><Download size={15} /></a>}>
          <MarkdownOutputViewer />
        </EvidencePanel>

        <EvidencePanel id="epub" label="03" title="EPUB reconstruído" description="Publicação semântica após revisão" icon={<Library size={17} />} activeStage={activeStage} actions={<a href={`${base}artifacts/reconstrucao-validada.epub`} download aria-label="Baixar EPUB"><Download size={15} /></a>}>
          <EpubOutputViewer />
        </EvidencePanel>
      </section>

      <section className="comparison-analysis" aria-labelledby="analysis-title">
        <header><span>ANÁLISE</span><h3 id="analysis-title">Observações por dimensão</h3></header>
        <div className="analysis-table" role="table" aria-label="Comparação entre a saída Markdown e o EPUB reconstruído">
          <div className="analysis-row analysis-row--head" role="row"><span role="columnheader">Dimensão</span><span role="columnheader">Markdown Mathpix</span><span role="columnheader">EPUB reconstruído</span></div>
          {observations.map(([dimension, markdown, epub]) => <div className="analysis-row" role="row" key={dimension}><strong role="rowheader">{dimension}</strong><p role="cell">{markdown}</p><p role="cell">{epub}</p></div>)}
        </div>
      </section>

      <section className="comparison-conclusion"><strong>Síntese</strong><p>A transcrição Markdown preserva com boa qualidade o texto e a notação matemática, cumprindo bem seu papel como base editável. A acessibilidade do EPUB surge em uma etapa distinta: revisão da ordem, marcação estrutural, reinserção e descrição de figuras, conversão para MathML, navegação e metadados. A verificação combina ferramentas automatizadas e revisão humana.</p></section>
    </div>
  );
}
