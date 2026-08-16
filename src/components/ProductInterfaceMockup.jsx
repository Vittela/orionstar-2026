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
const statusNames = { ok: "Verificado", pending: "Revisar", error: "Erro" };

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
        <h3 id="import-title">Importar documento</h3>
        <p>Adicione um PDF ou uma imagem digitalizada para iniciar a reconstrução semântica.</p>
      </div>

      <button className="prototype-dropzone" type="button">
        <strong>Arraste o documento para esta área</strong>
        <span>ou selecione um arquivo do computador</span>
        <span className="prototype-dropzone__action">Selecionar arquivo</span>
        <small>PDF, JPG, PNG ou TIFF</small>
      </button>

      <fieldset className="processing-options">
        <legend>Como processar</legend>
        <div>
          <label className={processing === "local" ? "is-selected" : ""}>
            <input type="radio" name="processing" value="local" checked={processing === "local"} onChange={() => setProcessing("local")} />
            <span><strong>Local</strong><small>Prioriza privacidade e mantém os arquivos no dispositivo.</small></span>
          </label>
          <label className={processing === "cloud" ? "is-selected" : ""}>
            <input type="radio" name="processing" value="cloud" checked={processing === "cloud"} onChange={() => setProcessing("cloud")} />
            <span><strong>Nuvem</strong><small>Pode melhorar OCR e sugestões, mas requer conexão.</small></span>
          </label>
        </div>
      </fieldset>

      <div className="prototype-file-estimate">
        <span><strong>capitulo-numeros-reais.pdf</strong><small>1 página · estimativa de 40 segundos</small></span>
        <button type="button" onClick={onContinue}>Organizar e verificar</button>
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
      <header><h3 id="structure-panel-title">Estrutura</h3><span>{nodes.length} elementos</span></header>
      <div className="structure-summary"><strong>{verified} verificados</strong><span>{needsReview} para revisar</span></div>
      <nav className="structure-tree" aria-label="Estrutura semântica e ordem de leitura">
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

function InspectorPanel({ selected, altText, setAltText, onMessage }) {
  return (
    <aside className="workspace-panel inspector-panel" aria-labelledby="inspector-panel-title">
      <header><h3 id="inspector-panel-title">Editar elemento</h3><span>{getTypeName(selected)}</span></header>
      <ElementPreview selected={selected} />
      <div className="inspector-form">
        <label>Tipo de elemento<input value={getTypeName(selected)} readOnly /></label>
        <label>Ordem de leitura<div className="order-input"><button type="button" aria-label="Mover para trás">−</button><input value={nodes.findIndex((node) => node.id === selected.id) + 1} readOnly aria-label="Posição na ordem de leitura" /><button type="button" aria-label="Mover para frente">+</button></div></label>

        {selected.type === "figure" && <>
          <label>Texto alternativo<textarea value={altText} onChange={(event) => setAltText(event.target.value)} rows="4" /></label>
          <label>Descrição longa<textarea placeholder="Descreva relações, dados e contexto visual…" rows="4" /></label>
          <button className="secondary-action" type="button" onClick={() => { setAltText("Circunferência com o diâmetro marcado e uma seta indicando seu comprimento."); onMessage("Sugestão adicionada. Revise o texto antes de continuar."); }}>Sugerir texto alternativo</button>
        </>}

        {selected.type === "formula" && <>
          <label>Descrição textual<textarea defaultValue="Raiz quadrada de dois é aproximadamente um vírgula quatrocentos e quatorze." rows="5" /></label>
          <button className="secondary-action" type="button" onClick={() => onMessage("Descrição adicionada. Confira a pronúncia antes de continuar.")}>Sugerir descrição</button>
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
      <div className="workspace-context"><div><strong>capitulo-numeros-reais.pdf</strong><span>1 página · processamento local</span></div><span>Em revisão</span></div>
      <div className={`workspace-grid mobile-tab-${mobileTab}`}>
        <StructurePanel selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setMobileTab("inspector"); }} />
        <DocumentPanel selected={selected} />
        <InspectorPanel selected={selected} altText={altText} setAltText={setAltText} onMessage={setMessage} />
      </div>
      <nav className="workspace-mobile-tabs" aria-label="Painéis do espaço de trabalho">
        <button className={mobileTab === "structure" ? "is-active" : ""} type="button" aria-pressed={mobileTab === "structure"} onClick={() => setMobileTab("structure")}>Estrutura</button>
        <button className={mobileTab === "document" ? "is-active" : ""} type="button" aria-pressed={mobileTab === "document"} onClick={() => setMobileTab("document")}>Documento</button>
        <button className={mobileTab === "inspector" ? "is-active" : ""} type="button" aria-pressed={mobileTab === "inspector"} onClick={() => setMobileTab("inspector")}>Elemento</button>
      </nav>
      <footer className="workspace-actions">
        <span aria-live="polite">{message || "Este é um protótipo: as alterações não são salvas."}</span>
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
        <div className="prototype-brand"><strong>Conversor acessível</strong><span>Protótipo acadêmico</span></div>
        <nav aria-label="Etapas do processo">
          <button className={screen === "import" ? "is-current" : ""} type="button" aria-pressed={screen === "import"} onClick={() => setScreen("import")}>1. Importar</button>
          <button className={screen === "workspace" ? "is-current" : ""} type="button" aria-pressed={screen === "workspace"} onClick={() => setScreen("workspace")}>2. Organizar e revisar</button>
        </nav>
        <span className="prototype-mode">Processamento local</span>
      </header>
      {screen === "import" ? <ImportScreen onContinue={() => setScreen("workspace")} /> : <WorkspaceScreen />}
    </div>
  );
}
