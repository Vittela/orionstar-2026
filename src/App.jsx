import { useState } from "react";
import { ArtifactCard } from "./components/ArtifactCard";
import { Header } from "./components/Header";

const artifacts = [
  {
    id: "flow",
    eyebrow: "01 · Processo",
    title: "Fluxo do sistema",
    description: "Da captura digital à publicação acessível.",
    accent: "#6d5bd0",
    preview: <div className="placeholder-preview placeholder-preview--flow"><i /><i /><i /><i /></div>,
  },
  {
    id: "mockup",
    eyebrow: "02 · Experiência",
    title: "Livro navegável",
    description: "Mockup interativo da leitura reconstruída.",
    accent: "#e07a5f",
    preview: <div className="placeholder-preview placeholder-preview--book"><i /><i /><i /></div>,
  },
  {
    id: "comparison",
    eyebrow: "03 · Evidências",
    title: "Comparativo de formatos",
    description: "Imagem, PDF com OCR e EPUB acessível lado a lado.",
    accent: "#3a8d73",
    preview: <div className="placeholder-preview placeholder-preview--comparison"><i /><i /><i /></div>,
  },
];

export default function App() {
  const [selectedArtifact, setSelectedArtifact] = useState(null);

  return (
    <main className="site-shell">
      <Header />
      <section className="artifact-section" aria-labelledby="artifacts-title">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Artefatos do projeto</p>
            <h2 id="artifacts-title">Explore o processo, o resultado e as evidências</h2>
          </div>
          <p>Selecione um artefato para abrir a visualização completa.</p>
        </div>

        <div className="artifact-grid">
          {artifacts.map((artifact) => (
            <ArtifactCard key={artifact.id} {...artifact} onOpen={() => setSelectedArtifact(artifact.id)} />
          ))}
        </div>
      </section>

      {selectedArtifact && (
        <div className="foundation-overlay" role="dialog" aria-modal="true">
          <p>Visualização de {selectedArtifact} em construção.</p>
          <button type="button" onClick={() => setSelectedArtifact(null)}>Fechar</button>
        </div>
      )}
    </main>
  );
}
