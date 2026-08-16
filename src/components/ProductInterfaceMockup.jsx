import { useMemo, useState } from "react";
import { SOURCES } from "../data/sources";

const nodes = [
  { id: "chapter", label: "Capítulo 1 · Números reais", type: "heading", level: 0, status: "ok" },
  { id: "note", label: "Nota sobre raízes", type: "note", level: 1, status: "ok" },
  { id: "intro", label: "Irracionais populares", type: "heading", level: 1, status: "ok" },
  { id: "formula", label: "Fórmula · aproximações", type: "formula", level: 2, status: "pending" },
  { id: "example", label: "Exemplo 1 · O número π", type: "heading", level: 1, status: "ok" },
  { id: "figure", label: "Figura 1.1 · Circunferência", type: "figure", level: 2, status: "pending" },
  { id: "table", label: "Tabela de propriedades", type: "table", level: 2, status: "error" },
];

const typeNames = { heading: "Título", note: "Nota", formula: "Fórmula", figure: "Figura", table: "Tabela" };
const statusNames = { ok: "Confirmado", pending: "Revisar", error: "Corrigir" };

const aiSuggestions = {
  chapter: { confidence: 98, text: "O tamanho e a posição indicam que este trecho abre o capítulo.", action: "Manter como título H1" },
  note: { confidence: 90, text: "O bloco lateral parece complementar o texto principal e pode ser marcado como nota.", action: "Manter como nota" },
  intro: { confidence: 95, text: "A mudança de assunto e o destaque visual indicam o início de uma nova seção.", action: "Manter como título H2" },
  formula: { confidence: 96, text: "A expressão foi reconhecida, mas a forma de leitura ainda precisa ser conferida.", action: "Usar a descrição sugerida" },
  example: { confidence: 94, text: "O rótulo e a posição indicam um exemplo dentro da seção atual.", action: "Manter como título H2" },
  figure: { confidence: 92, text: "A imagem mostra uma circunferência com o diâmetro destacado. A descrição precisa ser confirmada antes da exportação.", action: "Usar o texto alternativo sugerido" },
  table: { confidence: 71, text: "O conteúdo parece tabular, mas os cabeçalhos não puderam ser identificados com segurança.", action: "Marcar a primeira linha como cabeçalho" },
};

function getTypeName(node) {
  if (node.type === "heading") return `Título H${node.level + 1}`;
  return typeNames[node.type];
}

function StatusLabel({ status }) {
  return <span className={`status-label status-label--${status}`}>{statusNames[status]}</span>;
}

function ImportScreen({ onContinue }) {
  const [processing, setProcessing] = useState("local");

  return (
    <section className="prototype-import" aria-labelledby="import-title">
      <div className="prototype-import__heading">
        <h3 id="import-title">Analisar um documento</h3>
        <p>Envie um PDF ou uma imagem. A IA identifica títulos, ordem de leitura, fórmulas e figuras para montar uma primeira versão estruturada.</p>
      </div>

      <button className="prototype-dropzone" type="button">
        <strong>Arraste o documento para esta área</strong>
        <span>ou selecione um arquivo do computador</span>
        <span className="prototype-dropzone__action">Selecionar arquivo</span>
        <small>PDF, JPG, PNG ou TIFF</small>
      </button>

      <fieldset className="processing-options">
        <legend>Onde executar a análise</legend>
        <div>
          <label className={processing === "local" ? "is-selected" : ""}>
            <input type="radio" name="processing" value="local" checked={processing === "local"} onChange={() => setProcessing("local")} />
            <span><strong>No dispositivo</strong><small>O modelo processa o documento localmente e mantém o arquivo no computador.</small></span>
          </label>
          <label className={processing === "cloud" ? "is-selected" : ""}>
            <input type="radio" name="processing" value="cloud" checked={processing === "cloud"} onChange={() => setProcessing("cloud")} />
            <span><strong>Na nuvem</strong><small>Usa modelos mais completos para OCR e descrições, mas requer conexão.</small></span>
          </label>
        </div>
      </fieldset>

      <div className="prototype-file-estimate">
        <span><strong>capitulo-numeros-reais.pdf</strong><small>1 página · análise estimada em 40 segundos</small></span>
        <button type="button" onClick={onContinue}>Analisar documento</button>
      </div>
    </section>
  );
}

function DocumentPanel({ selected }) {
  const [zoom, setZoom] = useState(86);

  return (
    <section className="workspace-panel document-panel" aria-labelledby="document-panel-title">
      <header className="document-toolbar">
        <div><h3 id="document-panel-title">Documento original</h3><span aria-live="polite">Selecionado: {selected.label}</span></div>
        <div className="document-zoom" aria-label="Controles de zoom">
          <button type="button" aria-label="Diminuir zoom" onClick={() => setZoom((value) => Math.max(60, value - 10))}>−</button>
          <span>{zoom}%</span>
          <button type="button" aria-label="Aumentar zoom" onClick={() => setZoom((value) => Math.min(120, value + 10))}>+</button>
          <button type="button" onClick={() => setZoom(86)}>Ajustar</button>
        </div>
      </header>
      <div className="document-canvas">
        <div className="document-page" style={{ "--document-width": `${zoom}%` }}>
          <img src={`${import.meta.env.BASE_URL}artifacts/captura-de-livro.png`} alt="Página original sobre números reais" />
          <span className={`document-highlight document-highlight--${selected.type}`} aria-hidden="true" />
          {selected.status !== "ok" && <span className="document-warning">{selected.type === "figure" ? "Figura sem texto alternativo" : "Elemento para revisar"}</span>}
        </div>
      </div>
    </section>
  );
}

function StructurePanel({ selectedId, onSelect }) {
  const verified = nodes.filter((node) => node.status === "ok").length;
  const needsReview = nodes.length - verified;

  return (
    <aside className="workspace-panel structure-panel" aria-labelledby="structure-panel-title">
      <header><h3 id="structure-panel-title">Estrutura sugerida</h3><span>{nodes.length} elementos</span></header>
      <div className="structure-summary"><strong>{verified} confirmadas</strong><span>{needsReview} para revisar</span></div>
      <nav className="structure-tree" aria-label="Estrutura sugerida e ordem de leitura">
        {nodes.map((node, index) => (
          <button
            key={node.id}
            className={`tree-level-${node.level}${selectedId === node.id ? " is-selected" : ""}`}
            type="button"
            aria-pressed={selectedId === node.id}
            onClick={() => onSelect(node.id)}
            style={{ "--tree-level": node.level, "--tree-indent": `${node.level * 24}px` }}
          >
            <span className="tree-order">{index + 1}</span>
            <span className="tree-node-label"><strong>{node.label}</strong><small>{getTypeName(node)}</small></span>
            <StatusLabel status={node.status} />
          </button>
        ))}
      </nav>
      <div className="structure-validation">
        <strong>Validação prevista</strong>
        <p><a href={SOURCES.ace.url} target="_blank" rel="noreferrer">Ace by DAISY</a> para acessibilidade e <a href={SOURCES.epubCheck.url} target="_blank" rel="noreferrer">EPUBCheck</a> para conformidade técnica.</p>
      </div>
    </aside>
  );
}

function ElementPreview({ selected }) {
  return (
    <section className="element-preview" aria-labelledby="selected-element-title">
      <p className="sr-only" aria-live="polite">Elemento selecionado: {selected.label}. Estado: {statusNames[selected.status]}.</p>
      <header>
        <div><span>{getTypeName(selected)}</span><h4 id="selected-element-title">{selected.label}</h4></div>
        <StatusLabel status={selected.status} />
      </header>

      {selected.type === "figure" && <div className="element-preview__figure"><img src={`${import.meta.env.BASE_URL}epub-preview/EPUB/images/figura-1-1-circunferencia.png`} alt="Circunferência com o diâmetro marcado e uma seta indicando seu comprimento" /></div>}
      {selected.type === "formula" && <div className="element-preview__formula"><span>√2 ≈ 1,4142136</span><small>Representação matemática reconhecida</small></div>}
      {selected.type === "table" && <p className="element-preview__message"><strong>Cabeçalhos ausentes.</strong> A estrutura da tabela precisa ser definida.</p>}
      {["heading", "note"].includes(selected.type) && <blockquote>{selected.label}</blockquote>}
    </section>
  );
}

function AiSuggestion({ selected, onApply }) {
  const suggestion = aiSuggestions[selected.id];

  return (
    <section className="ai-suggestion" aria-labelledby="ai-suggestion-title">
      <header>
        <strong id="ai-suggestion-title">Sugestão da IA</strong>
        <span>{suggestion.confidence}% de confiança</span>
      </header>
      <p>{suggestion.text}</p>
      <div>
        <span>Proposta</span>
        <strong>{suggestion.action}</strong>
      </div>
      <button type="button" onClick={onApply}>Aplicar sugestão</button>
      <small>Confira o resultado antes de continuar.</small>
    </section>
  );
}

function InspectorPanel({ selected, altText, setAltText, onMessage }) {
  const applySuggestion = () => {
    if (selected.type === "figure") {
      setAltText("Circunferência com o diâmetro marcado e uma seta indicando seu comprimento.");
    }
    onMessage("Sugestão aplicada ao rascunho. Confira o resultado antes de exportar.");
  };

  return (
    <aside className="workspace-panel inspector-panel" aria-labelledby="inspector-panel-title">
      <header><h3 id="inspector-panel-title">Revisar elemento</h3><span>{getTypeName(selected)}</span></header>
      <ElementPreview selected={selected} />
      <div className="inspector-form">
        <AiSuggestion selected={selected} onApply={applySuggestion} />
        <label>Tipo de elemento<input value={getTypeName(selected)} readOnly /></label>
        <label>Ordem de leitura<div className="order-input"><button type="button" aria-label="Mover para trás">−</button><input value={nodes.findIndex((node) => node.id === selected.id) + 1} readOnly aria-label="Posição na ordem de leitura" /><button type="button" aria-label="Mover para frente">+</button></div></label>

        {selected.type === "figure" && <>
          <label>Texto alternativo<textarea value={altText} onChange={(event) => setAltText(event.target.value)} rows="4" /></label>
          <label>Descrição longa<textarea placeholder="Descreva relações, dados e contexto visual…" rows="4" /></label>
        </>}

        {selected.type === "formula" && <>
          <label>Descrição textual<textarea defaultValue="Raiz quadrada de dois é aproximadamente um vírgula quatrocentos e quatorze." rows="5" /></label>
        </>}

        {selected.type === "table" && <>
          <label>Cabeçalhos de coluna<select defaultValue="first-row"><option value="first-row">Usar primeira linha</option></select></label>
          <label>Cabeçalhos de linha<select defaultValue="undefined"><option value="undefined">Não definido</option></select></label>
        </>}

        {["heading", "note"].includes(selected.type) && <>
          <label>Nível hierárquico<select defaultValue="level"><option value="level">{selected.level === 0 ? "H1 — título do capítulo" : "H2 — seção"}</option></select></label>
          <label>Idioma do trecho<select defaultValue="pt-BR"><option value="pt-BR">Português (Brasil)</option></select></label>
          <label>Conteúdo<textarea defaultValue={selected.label} rows="5" /></label>
        </>}
      </div>
    </aside>
  );
}

function WorkspaceScreen() {
  const [selectedId, setSelectedId] = useState("figure");
  const [mobileTab, setMobileTab] = useState("document");
  const [altText, setAltText] = useState("");
  const [message, setMessage] = useState("");
  const selected = useMemo(() => nodes.find((node) => node.id === selectedId) ?? nodes[0], [selectedId]);

  return (
    <section className="prototype-workspace">
      <div className="workspace-context"><div><strong>capitulo-numeros-reais.pdf</strong><span>1 página · modelo executado no dispositivo</span></div><span>Análise concluída</span></div>
      <div className={`workspace-grid mobile-tab-${mobileTab}`}>
        <StructurePanel selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setMobileTab("inspector"); }} />
        <DocumentPanel selected={selected} />
        <InspectorPanel selected={selected} altText={altText} setAltText={setAltText} onMessage={setMessage} />
      </div>
      <nav className="workspace-mobile-tabs" aria-label="Painéis do espaço de trabalho">
        <button className={mobileTab === "structure" ? "is-active" : ""} type="button" aria-pressed={mobileTab === "structure"} onClick={() => setMobileTab("structure")}>Estrutura</button>
        <button className={mobileTab === "document" ? "is-active" : ""} type="button" aria-pressed={mobileTab === "document"} onClick={() => setMobileTab("document")}>Documento</button>
        <button className={mobileTab === "inspector" ? "is-active" : ""} type="button" aria-pressed={mobileTab === "inspector"} onClick={() => setMobileTab("inspector")}>Revisão</button>
      </nav>
      <footer className="workspace-actions">
        <span aria-live="polite">{message || "A IA montou uma primeira versão. Revise as sugestões antes de exportar."}</span>
        <button type="button" onClick={() => setMessage("A leitura em voz alta seria iniciada aqui.")}>Ouvir prévia</button>
        <button className="workspace-export" type="button" onClick={() => setMessage("Revise os três itens pendentes antes de exportar.")}>Exportar EPUB</button>
      </footer>
    </section>
  );
}

export function ProductInterfaceMockup() {
  const [screen, setScreen] = useState("workspace");

  return (
    <div className="product-prototype">
      <header className="prototype-header">
        <div className="prototype-brand"><strong>Conversor acessível</strong><span>Revisão assistida por IA</span></div>
        <nav aria-label="Etapas do processo">
          <button className={screen === "import" ? "is-current" : ""} type="button" aria-pressed={screen === "import"} onClick={() => setScreen("import")}>1. Enviar arquivo</button>
          <button className={screen === "workspace" ? "is-current" : ""} type="button" aria-pressed={screen === "workspace"} onClick={() => setScreen("workspace")}>2. Revisar sugestões</button>
        </nav>
        <span className="prototype-mode">Modelo local</span>
      </header>
      {screen === "import" ? <ImportScreen onContinue={() => setScreen("workspace")} /> : <WorkspaceScreen />}
    </div>
  );
}
