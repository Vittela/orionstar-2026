import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Cloud,
  Download,
  ExternalLink,
  FileImage,
  FileText,
  GripVertical,
  HardDrive,
  Image,
  ListTree,
  Menu,
  MonitorUp,
  Play,
  ScanText,
  Settings2,
  Sparkles,
  Table2,
  Upload,
} from "lucide-react";
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

function StatusIcon({ status }) {
  if (status === "ok") return <Check size={13} aria-label="Item verificado" />;
  if (status === "error") return <CircleAlert size={13} aria-label="Erro" />;
  return <AlertTriangle size={13} aria-label="Revisão pendente" />;
}

function ImportScreen({ onContinue }) {
  const [processing, setProcessing] = useState("local");

  return (
    <section className="prototype-import" aria-labelledby="import-title">
      <div className="prototype-import__heading">
        <span>ETAPA 1 DE 2</span>
        <h3 id="import-title">Importar documento</h3>
        <p>Adicione um PDF ou uma imagem digitalizada para iniciar a reconstrução semântica.</p>
      </div>

      <button className="prototype-dropzone" type="button">
        <Upload size={26} />
        <strong>Arraste o documento para esta área</strong>
        <span>ou selecione um arquivo do computador</span>
        <em>Selecionar arquivo</em>
        <small><b>PDF</b><b>JPG / PNG</b><b>TIFF</b></small>
      </button>

      <fieldset className="processing-options">
        <legend>Modo de processamento</legend>
        <p>Você poderá alterar esta escolha antes de iniciar a análise.</p>
        <div>
          <label className={processing === "local" ? "is-selected" : ""}>
            <input type="radio" name="processing" value="local" checked={processing === "local"} onChange={() => setProcessing("local")} />
            <span className="processing-options__icon"><HardDrive size={19} /></span>
            <span><strong>Local</strong><small>Mais privado; pode ser menos preciso em digitalizações de baixa qualidade.</small></span>
          </label>
          <label className={processing === "cloud" ? "is-selected" : ""}>
            <input type="radio" name="processing" value="cloud" checked={processing === "cloud"} onChange={() => setProcessing("cloud")} />
            <span className="processing-options__icon"><Cloud size={19} /></span>
            <span><strong>Nuvem (IA)</strong><small>Mais rápido e preciso em OCR e texto alternativo; requer conexão.</small></span>
          </label>
        </div>
      </fieldset>

      <div className="prototype-file-estimate">
        <FileText size={20} />
        <span><strong>capitulo-numeros-reais.pdf</strong><small>1 página · processamento estimado em 40 segundos</small></span>
        <button type="button" onClick={onContinue}>Organizar e verificar <ChevronRight size={16} /></button>
      </div>
    </section>
  );
}

function DocumentPanel({ selected }) {
  return (
    <section className="workspace-panel document-panel" aria-label="Pré-visualização do documento">
      <header><span><FileImage size={15} />Documento</span><small>Página 1 de 1 · 86%</small></header>
      <div className="document-canvas">
        <img src={`${import.meta.env.BASE_URL}artifacts/captura-de-livro.png`} alt="Página original sobre números reais" />
        <span className={`document-highlight document-highlight--${selected.type}`} aria-hidden="true" />
        {selected.status !== "ok" && <span className="document-warning"><AlertTriangle size={13} />{selected.type === "figure" ? "Sem texto alternativo" : "Revisar elemento"}</span>}
      </div>
      <footer><button type="button">−</button><span>86%</span><button type="button">+</button><button type="button">Ajustar</button></footer>
    </section>
  );
}

function StructurePanel({ selectedId, onSelect }) {
  return (
    <section className="workspace-panel structure-panel" aria-label="Estrutura semântica">
      <header><span><ListTree size={15} />Estrutura</span><small>7 elementos</small></header>
      <div className="structure-tree">
        <p>ORDEM DE LEITURA</p>
        {nodes.map((node, index) => (
          <button key={node.id} className={`${selectedId === node.id ? "is-selected" : ""} status-${node.status}`} type="button" onClick={() => onSelect(node.id)} style={{ "--tree-level": node.level }}>
            <GripVertical size={12} className="tree-grip" />
            <span className="tree-order">{index + 1}</span>
            <span className="tree-node-icon">{node.type === "formula" ? "∑" : node.type === "figure" ? <Image size={13} /> : node.type === "table" ? <Table2 size={13} /> : <ChevronDown size={13} />}</span>
            <span className="tree-node-label"><strong>{node.label}</strong><small>{typeNames[node.type]}</small></span>
            <span className="tree-status"><StatusIcon status={node.status} /></span>
          </button>
        ))}
      </div>
      <button className="structure-add" type="button">+ Adicionar elemento</button>
    </section>
  );
}

function InspectorPanel({ selected, altText, setAltText, onMessage }) {
  return (
    <section className="workspace-panel inspector-panel" aria-label="Inspetor do elemento">
      <header><span><Settings2 size={15} />Inspetor</span><small>{typeNames[selected.type]}</small></header>
      <div className="inspector-form">
        <label>Tipo de elemento<select value={selected.type} readOnly><option value={selected.type}>{typeNames[selected.type]}</option></select></label>
        <label>Ordem de leitura<div className="order-input"><button type="button">−</button><input value={nodes.findIndex((node) => node.id === selected.id) + 1} readOnly /><button type="button">+</button></div></label>

        {selected.type === "figure" && <>
          <div className="inspector-figure"><img src={`${import.meta.env.BASE_URL}epub-preview/EPUB/images/figura-1-1-circunferencia.png`} alt="Prévia da figura selecionada" /></div>
          <label>Texto alternativo<textarea value={altText} onChange={(event) => setAltText(event.target.value)} rows="4" /></label>
          <label>Descrição longa<textarea placeholder="Descreva relações, dados e contexto visual…" rows="3" /></label>
          <button className="ai-suggestion" type="button" onClick={() => { setAltText("Circunferência com o diâmetro marcado e uma seta indicando seu comprimento."); onMessage("Sugestão inserida como rascunho; a revisão humana continua obrigatória."); }}><Sparkles size={14} />Sugerir com IA</button>
        </>}

        {selected.type === "formula" && <>
          <div className="mathml-preview"><small>PRÉVIA MATHML</small><span>√2 ≈ 1,4142136</span></div>
          <label>Descrição textual<textarea defaultValue="Raiz quadrada de dois é aproximadamente um vírgula quatrocentos e quatorze." rows="4" /></label>
          <button className="ai-suggestion" type="button" onClick={() => onMessage("Descrição sugerida; confirme a pronúncia antes de aprovar.")}><Sparkles size={14} />Sugerir descrição</button>
        </>}

        {selected.type === "table" && <>
          <div className="inspector-alert"><CircleAlert size={15} /><span><strong>Cabeçalhos ausentes</strong>Defina os cabeçalhos para permitir navegação célula a célula.</span></div>
          <label>Cabeçalhos de coluna<select><option>Usar primeira linha</option></select></label>
          <label>Cabeçalhos de linha<select><option>Não definido</option></select></label>
        </>}

        {["heading", "note"].includes(selected.type) && <>
          <label>Nível hierárquico<select><option>{selected.level === 0 ? "H1 — título do capítulo" : "H2 — seção"}</option></select></label>
          <label>Idioma do trecho<select><option>Português (Brasil)</option></select></label>
          <label>Conteúdo<textarea defaultValue={selected.label} rows="4" /></label>
        </>}
      </div>
    </section>
  );
}

function CompliancePanel({ onSelectIssue }) {
  const groups = [
    ["Estrutura e navegação", "3/3", "ok", ["Ordem de leitura definida", "Hierarquia coerente", "Sumário gerado"]],
    ["Conteúdo não textual", "4/6", "pending", ["2 imagens com texto alternativo", "1 fórmula pendente", "1 tabela sem cabeçalhos"]],
    ["Metadados de acessibilidade", "5/5", "ok", ["accessMode", "accessibilityFeature", "accessibilitySummary"]],
    ["Conformidade declarada", "Pendente", "pending", ["WCAG 2.2 AA · aguardando revisão"]],
  ];

  return (
    <section className="workspace-panel compliance-panel" aria-label="Conformidade">
      <header><span><ScanText size={15} />Conformidade</span><small>Tempo real</small></header>
      <div className="compliance-summary"><strong>82%</strong><span><b>14 de 17 requisitos</b><small>3 pendências para revisar</small></span></div>
      <div className="compliance-progress"><i /></div>
      <div className="compliance-groups">
        {groups.map(([title, count, status, items], index) => (
          <section key={title}>
            <button type="button" onClick={() => status === "pending" && onSelectIssue(index === 1 ? "figure" : "formula")}>
              <span className={`compliance-status status-${status}`}><StatusIcon status={status} /></span>
              <span><strong>{title}</strong><small>{count}</small></span>
              <ChevronRight size={14} />
            </button>
            <ul>{items.map((item) => <li key={item}><Check size={11} />{item}</li>)}</ul>
          </section>
        ))}
      </div>
      <div className="compliance-validation">
        <p>VALIDAÇÃO PREVISTA</p>
        <a href={SOURCES.ace.url} target="_blank" rel="noreferrer"><strong>Ace by DAISY</strong><small>Avaliação automatizada de acessibilidade</small><ExternalLink size={11} /></a>
        <a href={SOURCES.epubCheck.url} target="_blank" rel="noreferrer"><strong>EPUBCheck</strong><small>Conformidade técnica do pacote EPUB</small><ExternalLink size={11} /></a>
      </div>
      <div className="compliance-badge"><AlertTriangle size={17} /><span><strong>EPUB Accessibility 1.1</strong><small>WCAG 2.2 AA · declaração pendente</small></span></div>
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
    setMobileTab("structure");
    setMessage("Pendência localizada na estrutura.");
  };

  return (
    <section className="prototype-workspace">
      <div className="workspace-context"><span><strong>capitulo-numeros-reais.pdf</strong>1 página · processamento local</span><span><i />Salvo automaticamente</span></div>
      <div className={`workspace-grid mobile-tab-${mobileTab}`}>
        <DocumentPanel selected={selected} />
        <StructurePanel selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setMobileTab("inspector"); }} />
        <InspectorPanel selected={selected} altText={altText} setAltText={setAltText} onMessage={setMessage} />
        <CompliancePanel onSelectIssue={selectFromCompliance} />
      </div>
      <nav className="workspace-mobile-tabs" aria-label="Painéis do espaço de trabalho">
        <button className={mobileTab === "structure" ? "is-active" : ""} type="button" onClick={() => setMobileTab("structure")}><ListTree size={17} />Estrutura</button>
        <button className={mobileTab === "inspector" ? "is-active" : ""} type="button" onClick={() => setMobileTab("inspector")}><Settings2 size={17} />Inspetor</button>
        <button className={mobileTab === "compliance" ? "is-active" : ""} type="button" onClick={() => setMobileTab("compliance")}><ScanText size={17} />Conformidade<i>3</i></button>
      </nav>
      <footer className="workspace-actions">
        <span className="workspace-live-message" aria-live="polite">{message || "Protótipo navegável · nenhuma alteração é enviada"}</span>
        <button type="button" onClick={() => setMessage("Prévia de leitura iniciada para o elemento selecionado.")}><Play size={15} />Ouvir prévia</button>
        <button className="workspace-export" type="button" onClick={() => setMessage("Exportação requer confirmação: ainda existem 3 itens pendentes.")}><Download size={15} />Exportar EPUB acessível</button>
      </footer>
    </section>
  );
}

export function ProductInterfaceMockup() {
  const [screen, setScreen] = useState("workspace");

  return (
    <div className="product-prototype">
      <header className="prototype-header">
        <div className="prototype-brand"><span><BookOpen size={18} /></span><strong>Conversor Acessível</strong><small>protótipo acadêmico</small></div>
        <nav aria-label="Etapas do processo">
          <button className={screen === "import" ? "is-current" : "is-complete"} type="button" onClick={() => setScreen("import")}><i>{screen === "workspace" ? <Check size={12} /> : "1"}</i><span><small>Etapa 1</small>Importar</span></button>
          <em />
          <button className={screen === "workspace" ? "is-current" : ""} type="button" onClick={() => setScreen("workspace")}><i>2</i><span><small>Etapa 2</small>Organizar e verificar</span></button>
        </nav>
        <div className="prototype-mode"><MonitorUp size={15} />Modo local</div>
        <button className="prototype-menu" type="button" aria-label="Abrir menu"><Menu size={18} /></button>
      </header>
      {screen === "import" ? <ImportScreen onContinue={() => setScreen("workspace")} /> : <WorkspaceScreen />}
    </div>
  );
}
