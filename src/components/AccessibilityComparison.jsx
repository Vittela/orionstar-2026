import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

const observations = [
  ["Uso no projeto", "É o ponto de partida para revisar o texto e as fórmulas extraídos pelo OCR.", "É a versão preparada para leitura e navegação com tecnologias assistivas."],
  ["Texto e fórmulas", "O texto está legível e as fórmulas foram preservadas em LaTeX, incluindo frações, raízes e símbolos.", "O texto foi revisado, e as expressões matemáticas foram convertidas para MathML com alternativas textuais."],
  ["Estrutura do documento", "Embora títulos e exemplos sejam visíveis, o Markdown não os identifica como cabeçalhos.", "Capítulo, seções, notas e figuras receberam marcação semântica."],
  ["Ordem de leitura", "A caixa “No computador” e a Figura 1.3 aparecem antes do trecho principal ao qual se referem.", "A ordem foi ajustada para que o conteúdo possa ser lido de forma contínua e navegado por seções."],
  ["Figuras", "O texto mantém as chamadas e legendas, mas as três imagens não foram incluídas nem descritas.", "As figuras foram incluídas com legendas, textos alternativos e descrições mais detalhadas."],
  ["Navegação e metadados", "O Markdown não contém sumário de EPUB, landmarks nem metadados de acessibilidade.", "O EPUB inclui sumário, landmarks, idioma e metadados de acessibilidade."],
  ["Trabalho de revisão", "A transcrição oferece uma boa base, mas ainda precisa ser organizada, conferida e complementada.", "Na versão final, a ordem foi corrigida, a estrutura foi marcada e o conteúdo visual recebeu equivalentes textuais."],
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

  if (error) return <div className="research-viewer__status" role="alert">{error}</div>;
  if (!source) return <div className="research-viewer__status" role="status" aria-live="polite">Carregando transcrição…</div>;

  return <article className="markdown-render"><ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{source}</ReactMarkdown></article>;
}

function EpubOutputViewer() {
  const [view, setView] = useState("content");
  const base = import.meta.env.BASE_URL;
  const source = view === "toc" ? `${base}epub-preview/EPUB/nav.xhtml` : `${base}epub-preview/EPUB/text/content.xhtml`;

  return (
    <div className="epub-embedded-viewer">
      <div className="epub-embedded-viewer__controls" role="group" aria-label="Navegação da visualização EPUB">
        <button className={view === "toc" ? "is-active" : ""} type="button" aria-pressed={view === "toc"} aria-controls="epub-preview-frame" onClick={() => setView("toc")}>Sumário</button>
        <button className={view === "content" ? "is-active" : ""} type="button" aria-pressed={view === "content"} aria-controls="epub-preview-frame" onClick={() => setView("content")}>Conteúdo</button>
      </div>
      <iframe id="epub-preview-frame" key={source} src={source} title={view === "toc" ? "Sumário do EPUB reconstruído" : "Conteúdo do EPUB reconstruído"} sandbox="allow-same-origin allow-popups" />
    </div>
  );
}

function EvidencePanel({ id, title, description, activeStage, children, action }) {
  const headingId = `comparison-panel-title-${id}`;
  return (
    <article id={`comparison-panel-${id}`} className={`research-panel research-panel--${id}${activeStage === id ? " is-mobile-active" : ""}`} aria-labelledby={headingId}>
      <header>
        <div><h3 id={headingId}>{title}</h3><p>{description}</p></div>
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
        Abaixo, é possível conferir a página digitalizada, o texto gerado pelo Mathpix e o EPUB depois da revisão. Em seguida, a tabela mostra o que mudou de uma versão para outra.
      </p>
      <p className="comparison-source-note">
        A amostra corresponde à página 3 de <cite>Pré-cálculo: operações, equações, funções e trigonometria</cite>, de Francisco Magalhães Gomes (Cengage Learning, 2019). <a href="https://ime.unicamp.br/~chico/pre-calculo/livro.htm" target="_blank" rel="noreferrer">Consultar dados bibliográficos<span className="sr-only"> (abre em nova aba)</span></a>.
      </p>

      <div className="comparison-mobile-tabs" role="group" aria-label="Selecionar etapa para visualizar">
        <button className={activeStage === "source" ? "is-active" : ""} type="button" aria-pressed={activeStage === "source"} aria-controls="comparison-panel-source" onClick={() => setActiveStage("source")}>Imagem</button>
        <button className={activeStage === "markdown" ? "is-active" : ""} type="button" aria-pressed={activeStage === "markdown"} aria-controls="comparison-panel-markdown" onClick={() => setActiveStage("markdown")}>Markdown</button>
        <button className={activeStage === "epub" ? "is-active" : ""} type="button" aria-pressed={activeStage === "epub"} aria-controls="comparison-panel-epub" onClick={() => setActiveStage("epub")}>EPUB</button>
      </div>

      <section className="research-panels" aria-label="Visualização das três etapas">
        <EvidencePanel id="source" title="Imagem de origem" description="Página 3 do livro Pré-cálculo" activeStage={activeStage} action={<a href={`${base}artifacts/captura-de-livro.png`} target="_blank" rel="noreferrer">Abrir imagem<span className="sr-only"> em nova aba</span></a>}>
          <div className="source-image-viewer"><img src={`${base}artifacts/captura-de-livro.png`} alt="Página 3 do livro Pré-cálculo, de Francisco Magalhães Gomes, com conteúdo do capítulo Números reais." /></div>
        </EvidencePanel>

        <EvidencePanel id="markdown" title="Transcrição em Markdown" description="Texto extraído automaticamente pelo Mathpix" activeStage={activeStage} action={<a href={`${base}artifacts/ocr-avancado-mathpix.md`} download>Baixar Markdown</a>}>
          <MarkdownOutputViewer />
        </EvidencePanel>

        <EvidencePanel id="epub" title="EPUB reconstruído" description="Versão organizada depois da revisão" activeStage={activeStage} action={<a href={`${base}artifacts/reconstrucao-validada.epub`} download>Baixar EPUB</a>}>
          <EpubOutputViewer />
        </EvidencePanel>
      </section>

      <section className="comparison-analysis" aria-labelledby="analysis-title">
        <h3 id="analysis-title">O que muda entre as versões</h3>
        <div className="analysis-table-wrap">
          <table className="analysis-table">
            <caption className="sr-only">Comparação de acessibilidade entre a transcrição em Markdown e o EPUB reconstruído</caption>
            <thead><tr><th scope="col">Aspecto</th><th scope="col">Markdown do Mathpix</th><th scope="col">EPUB reconstruído</th></tr></thead>
            <tbody>
              {observations.map(([dimension, markdown, epub]) => <tr key={dimension}><th scope="row">{dimension}</th><td>{markdown}</td><td>{epub}</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>

      <section className="comparison-conclusion">
        <h3>Em resumo</h3>
        <p>O Mathpix preserva bem o texto e a notação matemática, por isso sua transcrição é um bom ponto de partida. Para chegar ao EPUB, ainda foi preciso corrigir a ordem de leitura, marcar a estrutura, incluir as figuras e escrever suas descrições. As ferramentas de verificação ajudam, mas não substituem essa revisão.</p>
      </section>
    </div>
  );
}
