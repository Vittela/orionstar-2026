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
  return (
    <section className="workspace-panel document-panel" aria-labelledby="document-panel-title">
      <header><h3 id="document-panel-title">Documento</h3><span>Página 1 de 1 · 86%</span></header>
      <div className="document-canvas">
        <img src={`${import.meta.env.BASE_URL}artifacts/captura-de-livro.png`} alt="Página original sobre números reais" />
        <span className={`document-highlight document-highlight--${selected.type}`} aria-hidden="true" />
        {selected.status !== "ok" && <span className="document-warning">{selected.type === "figure" ? "Figura sem texto alternativo" : "Elemento para revisar"}</span>}
      </div>
      <footer><button type="button" aria-label="Diminuir zoom">−</button><span>86%</span><button type="button" aria-label="Aumentar zoom">+</button><button type="button">Ajustar</button></footer>
    </section>
  );
}

function StructurePanel({ selectedId, onSelect }) {
  return (
    <section className="workspace-panel structure-panel" aria-labelledby="structure-panel-title">
      <header><h3 id="structure-panel-title">Estrutura e ordem de leitura</h3><span>7 elementos</span></header>
      <div className="structure-tree">
        {nodes.map((node, index) => (
          <button key={node.id} className={selectedId === node.id ? "is-selected" : ""} type="button" onClick={() => onSelect(node.id)} style={{ "--tree-level": node.level }}>
            <span className="tree-order">{index + 1}</span>
            <span className="tree-node-label"><strong>{node.label}</strong><small>{typeNames[node.type]}</small></span>
            <StatusLabel status={node.status} />
          </button>
        ))}
      </div>
      <button className="structure-add" type="button">Adicionar elemento</button>
    </section>
  );
}

function InspectorPanel({ selected, altText, setAltText, onMessage }) {
  return (
    <section className="workspace-panel inspector-panel" aria-labelledby="inspector-panel-title">
      <header><h3 id="inspector-panel-title">Revisar elemento</h3><span>{typeNames[selected.type]}</span></header>
      <div className="inspector-form">
        <label>Tipo de elemento<input value={typeNames[selected.type]} readOnly /></label>
        <label>Ordem de leitura<div className="order-input"><button type="button" aria-label="Mover para trás">−</button><input value={nodes.findIndex((node) => node.id === selected.id) + 1} readOnly aria-label="Posição na ordem de leitura" /><button type="button" aria-label="Mover para frente">+</button></div></label>

        {selected.type === "figure" && <>
          <div className="inspector-figure"><img src={`${import.meta.env.BASE_URL}epub-preview/EPUB/images/figura-1-1-circunferencia.png`} alt="Prévia da figura selecionada" /></div>
          <label>Texto alternativo<textarea value={altText} onChange={(event) => setAltText(event.target.value)} rows="4" /></label>
          <label>Descrição longa<textarea placeholder="Descreva relações, dados e contexto visual…" rows="3" /></label>
          <button className="secondary-action" type="button" onClick={() => { setAltText("Circunferência com o diâmetro marcado e uma seta indicando seu comprimento."); onMessage("Sugestão inserida como rascunho; revise antes de aprovar."); }}>Sugerir texto alternativo</button>
        </>}

        {selected.type === "formula" && <>
          <div className="mathml-preview"><small>Prévia MathML</small><span>√2 ≈ 1,4142136</span></div>
          <label>Descrição textual<textarea defaultValue="Raiz quadrada de dois é aproximadamente um vírgula quatrocentos e quatorze." rows="4" /></label>
          <button className="secondary-action" type="button" onClick={() => onMessage("Descrição sugerida; confirme a pronúncia antes de aprovar.")}>Sugerir descrição</button>
        </>}

        {selected.type === "table" && <>
          <p className="inspector-alert"><strong>Cabeçalhos ausentes.</strong> Defina-os para permitir navegação célula a célula.</p>
          <label>Cabeçalhos de coluna<select defaultValue="first-row"><option value="first-row">Usar primeira linha</option></select></label>
          <label>Cabeçalhos de linha<select defaultValue="undefined"><option value="undefined">Não definido</option></select></label>
        </>}

        {["heading", "note"].includes(selected.type) && <>
          <label>Nível hierárquico<select defaultValue="level"><option value="level">{selected.level === 0 ? "H1 — título do capítulo" : "H2 — seção"}</option></select></label>
          <label>Idioma do trecho<select defaultValue="pt-BR"><option value="pt-BR">Português (Brasil)</option></select></label>
          <label>Conteúdo<textarea defaultValue={selected.label} rows="4" /></label>
        </>}
      </div>
    </section>
  );
}

function CompliancePanel({ onSelectIssue }) {
  const groups = [
    ["Estrutura e navegação", "3 de 3", "ok"],
    ["Conteúdo não textual", "4 de 6", "pending"],
    ["Metadados de acessibilidade", "5 de 5", "ok"],
    ["Declaração de conformidade", "Pendente", "pending"],
  ];

  return (
    <section className="workspace-panel compliance-panel" aria-labelledby="compliance-panel-title">
      <header><h3 id="compliance-panel-title">Verificação</h3><span>14 de 17 itens</span></header>
      <div className="compliance-groups">
        {groups.map(([title, count, status], index) => (
          <button key={title} type="button" onClick={() => status === "pending" && onSelectIssue(index === 1 ? "figure" : "formula")}>
            <span><strong>{title}</strong><small>{count}</small></span>
            <StatusLabel status={status} />
          </button>
        ))}
      </div>
      <p className="compliance-tools">Validação prevista com <a href={SOURCES.ace.url} target="_blank" rel="noreferrer">Ace by DAISY</a> e <a href={SOURCES.epubCheck.url} target="_blank" rel="noreferrer">EPUBCheck</a>.</p>
    </section>
  );
}

function WorkspaceScreen() {
  const [selectedId, setSelectedId] = useState("figure");
  const [mobileTab, setMobileTab] = useState("structure");
  const [altText, setAltText] = useState("");
  const [message, setMessage] = useState("");
  const selected = useMemo(() => nodes.find((node) => node.id === selectedId) ?? nodes[0], [selectedId]);

  const selectFromCompliance = (id) => {
    setSelectedId(id);
    setMobileTab("inspector");
    setMessage("Pendência localizada. Revise o elemento selecionado.");
  };

  return (
    <section className="prototype-workspace">
      <div className="workspace-context"><strong>capitulo-numeros-reais.pdf</strong><span>1 página · processamento local</span></div>
      <div className={`workspace-grid mobile-tab-${mobileTab}`}>
        <DocumentPanel selected={selected} />
        <StructurePanel selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setMobileTab("inspector"); }} />
        <InspectorPanel selected={selected} altText={altText} setAltText={setAltText} onMessage={setMessage} />
        <CompliancePanel onSelectIssue={selectFromCompliance} />
      </div>
      <nav className="workspace-mobile-tabs" aria-label="Painéis do espaço de trabalho">
        <button className={mobileTab === "document" ? "is-active" : ""} type="button" aria-pressed={mobileTab === "document"} onClick={() => setMobileTab("document")}>Documento</button>
        <button className={mobileTab === "structure" ? "is-active" : ""} type="button" aria-pressed={mobileTab === "structure"} onClick={() => setMobileTab("structure")}>Estrutura</button>
        <button className={mobileTab === "inspector" ? "is-active" : ""} type="button" aria-pressed={mobileTab === "inspector"} onClick={() => setMobileTab("inspector")}>Elemento</button>
        <button className={mobileTab === "compliance" ? "is-active" : ""} type="button" aria-pressed={mobileTab === "compliance"} onClick={() => setMobileTab("compliance")}>Verificação</button>
      </nav>
      <footer className="workspace-actions">
        <span aria-live="polite">{message || "Protótipo navegável; nenhuma alteração é enviada."}</span>
        <button type="button" onClick={() => setMessage("Prévia de leitura iniciada para o elemento selecionado.")}>Ouvir prévia</button>
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
          <button className={screen === "workspace" ? "is-current" : ""} type="button" aria-pressed={screen === "workspace"} onClick={() => setScreen("workspace")}>2. Organizar e verificar</button>
        </nav>
        <span className="prototype-mode">Processamento local</span>
      </header>
      {screen === "import" ? <ImportScreen onContinue={() => setScreen("workspace")} /> : <WorkspaceScreen />}
    </div>
  );
}
