import { useState } from "react";
import { Check, Contrast, Download, Menu, Minus, Plus, X } from "lucide-react";

const sections = [
  ["inicio", "Números reais"],
  ["irracionais", "Irracionais populares"],
  ["exemplo-pi", "Exemplo 1 · O número pi"],
  ["exemplo-quadrado", "Exemplo 2 · O quadrado"],
  ["conjunto-reais", "O conjunto dos reais"],
];

export function BookReaderMockup() {
  const [fontScale, setFontScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("inicio");
  const base = import.meta.env.BASE_URL;

  const goToSection = (id) => {
    setCurrentSection(id);
    setSidebarOpen(false);
    document.getElementById(`reader-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`reader-app${highContrast ? " reader-app--contrast" : ""}`}>
      <header className="reader-toolbar">
        <div className="reader-toolbar__identity">
          <button className="reader-tool reader-tool--menu" type="button" onClick={() => setSidebarOpen((open) => !open)} aria-label="Abrir sumário">
            <Menu size={18} />
          </button>
          <span className="reader-logo" aria-hidden="true">re:</span>
          <span><small>Biblioteca acessível</small><strong>Números reais</strong></span>
        </div>

        <div className="reader-toolbar__controls" aria-label="Preferências de leitura">
          <div className="reader-font-controls">
            <button className="reader-tool" type="button" onClick={() => setFontScale((size) => Math.max(0.85, size - 0.1))} aria-label="Diminuir texto"><Minus size={16} /></button>
            <span aria-live="polite">{Math.round(fontScale * 100)}%</span>
            <button className="reader-tool" type="button" onClick={() => setFontScale((size) => Math.min(1.35, size + 0.1))} aria-label="Aumentar texto"><Plus size={16} /></button>
          </div>
          <button className={`reader-tool${highContrast ? " is-active" : ""}`} type="button" onClick={() => setHighContrast((active) => !active)} aria-pressed={highContrast} aria-label="Alternar alto contraste"><Contrast size={17} /></button>
          <a className="reader-download" href={`${base}artifacts/reconstrucao-validada.epub`} download><Download size={16} /><span>Baixar EPUB</span></a>
        </div>
      </header>

      <div className="reader-layout">
        <button className={`reader-backdrop${sidebarOpen ? " is-visible" : ""}`} type="button" onClick={() => setSidebarOpen(false)} aria-label="Fechar sumário" />
        <aside className={`reader-sidebar${sidebarOpen ? " is-open" : ""}`}>
          <div className="reader-sidebar__mobile-head">
            <strong>Sumário</strong>
            <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Fechar sumário"><X size={18} /></button>
          </div>
          <p>Conteúdo</p>
          <nav aria-label="Sumário do livro">
            <ol>
              {sections.map(([id, label], index) => (
                <li key={id}>
                  <button className={currentSection === id ? "is-current" : ""} type="button" onClick={() => goToSection(id)}>
                    <span>{String(index + 1).padStart(2, "0")}</span>{label}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <div className="reader-accessibility-note"><Check size={16} /><span><strong>EPUB Accessibility 1.1</strong>Estrutura validada para navegação assistiva.</span></div>
        </aside>

        <main className="reader-content" style={{ "--reader-scale": fontScale }}>
          <article className="reader-page">
            <div className="reader-page__meta"><span>CAPÍTULO 1</span><span>Tempo de leitura · 8 min</span></div>
            <section id="reader-inicio" className="reader-section">
              <h1>Números reais</h1>
              <aside className="reader-note" aria-labelledby="note-roots">
                <strong id="note-roots">Nota sobre raízes</strong>
                <p>Trataremos com mais detalhe as raízes — como <span role="math" aria-label="raiz quadrada de dois">√2</span> e <span role="math" aria-label="raiz quadrada de três">√3</span> — na Seção 1.9.</p>
              </aside>
            </section>

            <section id="reader-irracionais" className="reader-section">
              <p className="reader-eyebrow">CONCEITO</p>
              <h2>Números irracionais populares</h2>
              <p>A seguir são apresentados alguns números irracionais e suas aproximações decimais:</p>
              <ul className="reader-math-list">
                <li aria-label="raiz quadrada de dois é aproximadamente um vírgula quatrocentos e quatorze">√2 ≈ 1,4142136</li>
                <li aria-label="logaritmo de três na base dois é aproximadamente um vírgula quinhentos e oitenta e quatro">log₂(3) ≈ 1,5849625</li>
                <li aria-label="raiz quadrada de três é aproximadamente um vírgula setecentos e trinta e dois">√3 ≈ 1,7320508</li>
                <li aria-label="número e é aproximadamente dois vírgula setecentos e dezoito">e ≈ 2,7182818</li>
              </ul>
            </section>

            <section id="reader-exemplo-pi" className="reader-section">
              <p className="reader-eyebrow">EXEMPLO 1</p>
              <h2>O número pi</h2>
              <p>Quando dividimos o comprimento de uma circunferência pela medida de seu diâmetro, obtemos um número constante, representado pela letra grega π.</p>
              <div className="reader-equation" role="math" aria-label="pi é igual ao comprimento da circunferência dividido pelo diâmetro da circunferência"><b>π</b><span>=</span><span className="reader-fraction"><i>comprimento da circunferência</i><i>diâmetro da circunferência</i></span></div>
              <figure className="reader-figure">
                <img src={`${base}reader/EPUB/images/figura-1-1-circunferencia.png`} alt="Circunferência com o diâmetro marcado e uma seta indicando seu comprimento." />
                <figcaption><span>Figura 1.1</span>Uma circunferência e seu diâmetro.</figcaption>
                <details><summary>Ouvir descrição detalhada</summary><p>O diagrama mostra um círculo de contorno preto. Uma linha horizontal vermelha atravessa o centro e está identificada como diâmetro. Sobre a metade superior, uma seta curva representa o comprimento da circunferência.</p></details>
              </figure>
            </section>

            <section id="reader-exemplo-quadrado" className="reader-section">
              <p className="reader-eyebrow">EXEMPLO 2</p>
              <h2>Diagonal de um quadrado de lado inteiro</h2>
              <p>Um quadrado com lados de 1 metro tem diagonal de <span role="math" aria-label="raiz quadrada de dois metros">√2 m</span>, um número irracional.</p>
              <figure className="reader-figure">
                <img src={`${base}reader/EPUB/images/figura-1-2-quadrado.png`} alt="Quadrado de lado 1 metro com diagonal de raiz quadrada de 2 metros." />
                <figcaption><span>Figura 1.2</span>Um quadrado cujos lados medem 1 metro.</figcaption>
                <details><summary>Ouvir descrição detalhada</summary><p>O quadrado tem contorno preto, lados identificados como 1 metro e uma linha diagonal vermelha identificada como raiz quadrada de 2 metros.</p></details>
              </figure>
            </section>

            <section id="reader-conjunto-reais" className="reader-section">
              <p className="reader-eyebrow">RELAÇÕES</p>
              <h2>O conjunto dos números reais</h2>
              <p>Unindo os números racionais aos irracionais, obtemos o conjunto dos números reais, representado pelo símbolo <span role="math" aria-label="R maiúsculo de traço duplo">ℝ</span>.</p>
              <figure className="reader-figure reader-figure--wide">
                <img src={`${base}reader/EPUB/images/figura-1-3-subconjuntos.png`} alt="Diagrama hierárquico dos números reais e seus subconjuntos." />
                <figcaption><span>Figura 1.3</span>O conjunto dos números reais e seus subconjuntos.</figcaption>
                <details><summary>Ouvir descrição detalhada</summary><p>Os números reais se dividem em racionais e irracionais. Entre os racionais estão os inteiros e as frações não inteiras. Entre os inteiros estão os naturais, os negativos e o zero.</p></details>
              </figure>
            </section>
          </article>
        </main>
      </div>
    </div>
  );
}
