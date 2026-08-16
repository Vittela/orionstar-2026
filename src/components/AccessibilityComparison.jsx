import { AlertTriangle, Check, Download, ExternalLink, X } from "lucide-react";

const criteria = {
  image: [
    ["Texto selecionável", "fail", "O conteúdo permanece preso aos pixels; leitores de tela não recebem texto."],
    ["Idioma declarado", "fail", "Uma imagem não informa o idioma do conteúdo às tecnologias assistivas."],
    ["Hierarquia e navegação", "fail", "Títulos, exemplos, notas e figuras não possuem estrutura navegável."],
    ["Ordem de leitura", "fail", "A composição em duas colunas depende apenas da interpretação visual."],
    ["Matemática acessível", "fail", "Raízes, frações e símbolos não têm representação semântica."],
    ["Descrição de figuras", "fail", "Os três diagramas não possuem texto alternativo ou descrição longa."],
    ["Conteúdo refluível", "fail", "O layout é fixo e exige zoom ou deslocamento em telas pequenas."],
  ],
  pdf: [
    ["Texto selecionável", "partial", "Há uma camada de texto OCR, mas a extração contém caracteres corrompidos e espaços indevidos."],
    ["Idioma declarado", "fail", "O arquivo declara inglês (en-US), embora o conteúdo esteja em português."],
    ["Hierarquia e navegação", "partial", "Existe uma árvore de marcação, porém não há sumário interno e a divisão em duas páginas fragmenta o conteúdo."],
    ["Ordem de leitura", "fail", "A extração lê a nota lateral e a Figura 1.3 antes do texto principal, alterando a sequência."],
    ["Matemática acessível", "fail", "Símbolos como π, √2 e ℝ desaparecem ou são extraídos de forma incorreta."],
    ["Descrição de figuras", "fail", "As ilustrações não foram preservadas no PDF e não há alternativas textuais equivalentes."],
    ["Conteúdo refluível", "fail", "A paginação fixa mantém a dependência de zoom e deslocamento."],
  ],
  epub: [
    ["Texto selecionável", "pass", "Todo o conteúdo está em texto Unicode pesquisável e compatível com leitores de tela."],
    ["Idioma declarado", "pass", "A publicação e seus documentos declaram corretamente pt-BR."],
    ["Hierarquia e navegação", "pass", "HTML semântico, sumário EPUB e landmarks permitem navegar por seções e figuras."],
    ["Ordem de leitura", "pass", "O conteúdo foi reorganizado em uma sequência linear e coerente."],
    ["Matemática acessível", "pass", "Expressões usam MathML e incluem alternativas textuais contextualizadas."],
    ["Descrição de figuras", "pass", "Cada figura tem legenda, texto alternativo e descrição detalhada."],
    ["Conteúdo refluível", "pass", "Texto e elementos se adaptam à largura, ao tamanho da fonte e às preferências do leitor."],
  ],
};

function CriterionIcon({ status }) {
  if (status === "pass") return <Check size={15} strokeWidth={2.5} aria-hidden="true" />;
  if (status === "partial") return <AlertTriangle size={15} strokeWidth={2.2} aria-hidden="true" />;
  return <X size={15} strokeWidth={2.5} aria-hidden="true" />;
}

function CriteriaList({ items }) {
  return (
    <ul className="criteria-list">
      {items.map(([label, status, comment]) => (
        <li key={label} className={`criterion criterion--${status}`}>
          <span className="criterion__icon"><CriterionIcon status={status} /></span>
          <span><strong>{label}</strong><small>{comment}</small></span>
        </li>
      ))}
    </ul>
  );
}

function FormatCard({ step, label, title, score, scoreLabel, tone, preview, items, action }) {
  return (
    <article className="format-card" style={{ "--format-tone": tone }}>
      <header className="format-card__header">
        <span className="format-card__step">{step}</span>
        <div>
          <p>{label}</p>
          <h3>{title}</h3>
        </div>
        <span className="format-card__score"><strong>{score}</strong><small>{scoreLabel}</small></span>
      </header>
      <div className="format-card__preview">{preview}</div>
      <CriteriaList items={items} />
      {action}
    </article>
  );
}

export function AccessibilityComparison() {
  const base = import.meta.env.BASE_URL;

  return (
    <div className="comparison-viewer">
      <header className="comparison-intro">
        <div>
          <span className="comparison-intro__label">Análise do mesmo conteúdo em três estágios</span>
          <h3>Da fidelidade visual à acessibilidade estrutural</h3>
        </div>
        <div className="comparison-legend" aria-label="Legenda dos resultados">
          <span><i className="legend-dot legend-dot--pass" />Atende</span>
          <span><i className="legend-dot legend-dot--partial" />Parcial</span>
          <span><i className="legend-dot legend-dot--fail" />Não atende</span>
        </div>
      </header>

      <p className="comparison-note">
        Resultados observados nestes arquivos específicos. A análise combina inspeção da estrutura, extração de texto e revisão do conteúdo.
      </p>

      <div className="comparison-grid" tabIndex="0" aria-label="Comparação horizontal dos três formatos">
        <FormatCard
          step="01"
          label="Fonte"
          title="Imagem digitalizada"
          score="0/7"
          scoreLabel="critérios"
          tone="#b54b4f"
          preview={<img src={`${base}artifacts/captura-de-livro.png`} alt="Página digitalizada do capítulo Números reais, com texto, fórmulas e três figuras." />}
          items={criteria.image}
          action={<a className="format-card__action" href={`${base}artifacts/captura-de-livro.png`} target="_blank" rel="noreferrer"><ExternalLink size={16} />Abrir imagem original</a>}
        />

        <FormatCard
          step="02"
          label="Automação"
          title="PDF com OCR avançado"
          score="1/7"
          scoreLabel="+ 2 parciais"
          tone="#c77a26"
          preview={<object data={`${base}artifacts/ocr-avancado-mathpix.pdf#toolbar=0&navpanes=0&view=FitH`} type="application/pdf" aria-label="Prévia do PDF com OCR"><span>A prévia do PDF não está disponível neste navegador.</span></object>}
          items={criteria.pdf}
          action={<a className="format-card__action" href={`${base}artifacts/ocr-avancado-mathpix.pdf`} target="_blank" rel="noreferrer"><ExternalLink size={16} />Examinar PDF completo</a>}
        />

        <FormatCard
          step="03"
          label="Reconstrução"
          title="EPUB semântico"
          score="7/7"
          scoreLabel="critérios"
          tone="#3a8d73"
          preview={
            <div className="epub-miniature">
              <span>CAPÍTULO 1</span>
              <strong>Números reais</strong>
              <p>Exemplo 1: O número π</p>
              <div><i>π</i><b>=</b><em>comprimento ÷ diâmetro</em></div>
              <small>Figura 1.1 — descrição detalhada disponível</small>
            </div>
          }
          items={criteria.epub}
          action={<a className="format-card__action format-card__action--primary" href={`${base}artifacts/reconstrucao-validada.epub`} download><Download size={16} />Baixar EPUB acessível</a>}
        />
      </div>
    </div>
  );
}
