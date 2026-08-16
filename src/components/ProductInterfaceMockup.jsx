import { useMemo, useState } from "react";
import { SOURCES } from "../data/sources";

const nodes = [
  { id: "chapter", parentId: null, label: "Capítulo 1 · Números reais", type: "heading", level: 0, status: "ok", region: { left: "67%", top: "2%", width: "29%", height: "4%" } },
  { id: "note", parentId: "chapter", label: "Nota sobre raízes", type: "note", level: 1, status: "ok", region: { left: "4%", top: "7%", width: "33%", height: "7%" } },
  { id: "intro", parentId: "chapter", label: "Irracionais populares", type: "heading", level: 1, status: "ok", region: { left: "38%", top: "6%", width: "58%", height: "10%" } },
  { id: "formula", parentId: "intro", label: "Fórmula · aproximações", type: "formula", level: 2, status: "pending", region: { left: "48%", top: "8%", width: "47%", height: "8%" } },
  { id: "example", parentId: "chapter", label: "Exemplo 1 · O número π", type: "heading", level: 1, status: "ok", region: { left: "38%", top: "16%", width: "58%", height: "33%" } },
  { id: "figure", parentId: "example", label: "Figura 1.1 · Circunferência", type: "figure", level: 2, status: "pending", region: { left: "56%", top: "27%", width: "33%", height: "22%" } },
  { id: "example-two", parentId: "chapter", label: "Exemplo 2 · Diagonal do quadrado", type: "heading", level: 1, status: "pending", region: { left: "38%", top: "50%", width: "58%", height: "19%" } },
];

const typeNames = { heading: "Título", note: "Nota", formula: "Fórmula", figure: "Figura" };
const statusNames = { ok: "Confirmado", pending: "Revisar", error: "Corrigir" };

const aiSuggestions = {
  chapter: { confidence: 98, text: "O tamanho e a posição indicam que este trecho abre o capítulo.", action: "Manter como título H1" },
  note: { confidence: 90, text: "O bloco lateral parece complementar o texto principal e pode ser marcado como nota.", action: "Manter como nota" },
  intro: { confidence: 95, text: "A mudança de assunto e o destaque visual indicam o início de uma nova seção.", action: "Manter como título H2" },
  formula: { confidence: 96, text: "A expressão foi reconhecida, mas a forma de leitura ainda precisa ser conferida.", action: "Usar a descrição sugerida" },
  example: { confidence: 94, text: "O rótulo e a posição indicam um exemplo dentro da seção atual.", action: "Manter como título H2" },
  figure: { confidence: 92, text: "A imagem mostra uma circunferência com o diâmetro destacado. A descrição precisa ser confirmada antes da exportação.", action: "Usar o texto alternativo sugerido" },
  "example-two": { confidence: 89, text: "O destaque tipográfico indica o início de um segundo exemplo dentro do capítulo.", action: "Manter como título H2" },
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
  const [zoom, setZoom] = useState(68);

  return (
    <section className="workspace-panel document-panel" aria-labelledby="document-panel-title">
      <header className="document-toolbar">
        <div><h3 id="document-panel-title">Documento original</h3><span aria-live="polite">Selecionado: {selected.label}</span></div>
        <div className="document-zoom" aria-label="Controles de zoom">
          <button type="button" aria-label="Diminuir zoom" onClick={() => setZoom((value) => Math.max(40, value - 10))}>−</button>
          <span>{zoom}%</span>
          <button type="button" aria-label="Aumentar zoom" onClick={() => setZoom((value) => Math.min(130, value + 10))}>+</button>
          <button type="button" onClick={() => setZoom(68)}>Página inteira</button>
        </div>
      </header>
      <div className="document-canvas">
        <div className="document-page" style={{ "--document-width": `${zoom}%` }}>
          <img src={`${import.meta.env.BASE_URL}artifacts/captura-de-livro.png`} alt="Página original sobre números reais" />
          <span className="document-highlight" style={selected.region} aria-hidden="true">
            {selected.status !== "ok" && <span className="document-warning">{selected.type === "figure" ? "Figura sem texto alternativo" : "Elemento para revisar"}</span>}
          </span>
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
        <StructureBranch parentId={null} selectedId={selectedId} onSelect={onSelect} root />
      </nav>
      <div className="structure-validation">
        <strong>Validação prevista</strong>
        <p><a href={SOURCES.ace.url} target="_blank" rel="noreferrer">Ace by DAISY</a> para acessibilidade e <a href={SOURCES.epubCheck.url} target="_blank" rel="noreferrer">EPUBCheck</a> para conformidade técnica.</p>
      </div>
    </aside>
  );
}

function StructureBranch({ parentId, selectedId, onSelect, root = false }) {
  const branch = nodes.filter((node) => node.parentId === parentId);

  return (
    <ol className={root ? "structure-tree__root" : "structure-tree__children"}>
      {branch.map((node) => {
        const order = nodes.findIndex((item) => item.id === node.id) + 1;
        const hasChildren = nodes.some((item) => item.parentId === node.id);

        return (
          <li className="structure-tree__item" key={node.id}>
            <button
              className={`structure-node${selectedId === node.id ? " is-selected" : ""}`}
              type="button"
              aria-pressed={selectedId === node.id}
              onClick={() => onSelect(node.id)}
            >
              <span className="tree-order">{order}</span>
              <span className="tree-node-label"><strong>{node.label}</strong><small>{getTypeName(node)}</small></span>
              <StatusLabel status={node.status} />
            </button>
            {hasChildren && <StructureBranch parentId={node.id} selectedId={selectedId} onSelect={onSelect} />}
          </li>
        );
      })}
    </ol>
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
      {["heading", "note"].includes(selected.type) && <blockquote>{selected.label}</blockquote>}
    </section>
  );
}

function AiSuggestion({ selected, onApply }) {
  const suggestion = aiSuggestions[selected.id];
  const titleId = `ai-suggestion-title-${selected.id}`;

  return (
    <section className="ai-review-card" aria-labelledby={titleId}>
      <header className="ai-review-card__header">
        <div>
          <strong id={titleId}>Sugestão da IA</strong>
          <span>Assistente de revisão</span>
        </div>
        <span className="ai-review-card__confidence">{suggestion.confidence}%</span>
      </header>
      <p className="ai-review-card__reason">{suggestion.text}</p>
      <div className="ai-review-card__proposal">
        <div>
          <span>Proposta</span>
          <strong>{suggestion.action}</strong>
        </div>
        <button type="button" onClick={onApply} aria-label={`Aplicar sugestão: ${suggestion.action}`}>Aplicar</button>
      </div>
      <small className="ai-review-card__note">Confira o resultado antes de continuar.</small>
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

        {["heading", "note"].includes(selected.type) && <>
          <label>Nível hierárquico<select defaultValue="level"><option value="level">{selected.level === 0 ? "H1 — título do capítulo" : "H2 — seção"}</option></select></label>
          <label>Idioma do trecho<select defaultValue="pt-BR"><option value="pt-BR">Português (Brasil)</option></select></label>
          <label>Conteúdo<textarea defaultValue={selected.label} rows="5" /></label>
        </>}
      </div>
    </aside>
  );
}

function WorkspaceScreen({ onChangeFile }) {
  const [selectedId, setSelectedId] = useState("figure");
  const [mobileTab, setMobileTab] = useState("document");
  const [altText, setAltText] = useState("");
  const [message, setMessage] = useState("");
  const selected = useMemo(() => nodes.find((node) => node.id === selectedId) ?? nodes[0], [selectedId]);

  return (
    <section className="prototype-workspace">
      <div className="workspace-context">
        <div><strong>capitulo-numeros-reais.pdf</strong><span>1 página · análise concluída</span></div>
        <button className="workspace-change-file" type="button" onClick={onChangeFile}>Trocar arquivo</button>
      </div>
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
      {screen === "import" ? <ImportScreen onContinue={() => setScreen("workspace")} /> : <WorkspaceScreen onChangeFile={() => setScreen("import")} />}
    </div>
  );
}
