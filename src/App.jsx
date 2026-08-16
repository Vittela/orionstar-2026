import { lazy, Suspense, useCallback, useState } from "react";
import { ArtifactCard } from "./components/ArtifactCard";
import { ArtifactModal } from "./components/ArtifactModal";
import { FlowPreview } from "./components/FlowPreview";
import { Header } from "./components/Header";

const ExcalidrawViewer = lazy(() =>
  import("./components/ExcalidrawViewer").then((module) => ({ default: module.ExcalidrawViewer })),
);

const artifacts = [
  {
    id: "flow",
    eyebrow: "01 · Processo",
    title: "Fluxo do sistema",
    description: "Da captura digital à publicação acessível.",
    accent: "#6d5bd0",
    preview: <FlowPreview />,
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
  const closeArtifact = useCallback(() => setSelectedArtifact(null), []);

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

      {selectedArtifact === "flow" && (
        <ArtifactModal eyebrow="01 · Processo" title="Fluxo do sistema" onClose={closeArtifact}>
          <Suspense fallback={<div className="viewer-status"><span className="viewer-spinner" aria-hidden="true" /><strong>Preparando o visualizador…</strong></div>}>
            <ExcalidrawViewer file="diagrams/fluxo.excalidraw" />
          </Suspense>
        </ArtifactModal>
      )}

      {selectedArtifact && selectedArtifact !== "flow" && (
        <ArtifactModal eyebrow="Artefato" title="Visualização em construção" onClose={closeArtifact}>
          <div className="viewer-status"><strong>Este artefato será integrado na próxima etapa.</strong></div>
        </ArtifactModal>
      )}
    </main>
  );
}
