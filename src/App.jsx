import { lazy, Suspense, useCallback, useState } from "react";
import { ArtifactCard } from "./components/ArtifactCard";
import { ArtifactModal } from "./components/ArtifactModal";
import { Header } from "./components/Header";
import { ProductInterfaceMockup } from "./components/ProductInterfaceMockup";
import { ProjectSources } from "./components/ProjectSources";

const ExcalidrawViewer = lazy(() =>
  import("./components/ExcalidrawViewer").then((module) => ({ default: module.ExcalidrawViewer })),
);

const AccessibilityComparison = lazy(() =>
  import("./components/AccessibilityComparison").then((module) => ({ default: module.AccessibilityComparison })),
);

const previewPath = (file) => `${import.meta.env.BASE_URL}previews/${file}`;

const artifacts = [
  {
    id: "flow",
    eyebrow: "01 · Etapas",
    title: "Fluxo do projeto",
    description: "Veja como uma página digitalizada chega a um EPUB acessível.",
    accent: "#6d5bd0",
    preview: <img className="artifact-preview-image artifact-preview-image--flow" src={previewPath("fluxo.svg")} alt="" />,
  },
  {
    id: "mockup",
    eyebrow: "02 · Interface",
    title: "Conversor acessível",
    description: "Uma proposta de tela para importar o arquivo, revisar a estrutura e preparar o EPUB.",
    accent: "#e07a5f",
    preview: <img className="artifact-preview-image artifact-preview-image--interface" src={previewPath("interface.svg")} alt="" />,
  },
  {
    id: "comparison",
    eyebrow: "03 · Comparação",
    title: "Comparação entre versões",
    description: "Página original, transcrição do Mathpix e EPUB final, lado a lado.",
    accent: "#3a8d73",
    preview: <img className="artifact-preview-image artifact-preview-image--comparison" src={previewPath("comparativo.svg")} alt="" />,
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
          <p className="section-kicker">O projeto na prática</p>
          <h2 id="artifacts-title">Da digitalização ao EPUB acessível</h2>
          <p>Consulte o fluxo de trabalho, experimente a proposta de interface e compare a página original com a transcrição e o EPUB revisado.</p>
        </div>

        <div className="artifact-grid">
          {artifacts.map((artifact) => (
            <ArtifactCard key={artifact.id} {...artifact} onOpen={() => setSelectedArtifact(artifact.id)} />
          ))}
        </div>
      </section>

      <ProjectSources />

      {selectedArtifact === "flow" && (
        <ArtifactModal eyebrow="01 · Etapas" title="Fluxo do projeto" onClose={closeArtifact}>
          <Suspense fallback={<div className="viewer-status"><span className="viewer-spinner" aria-hidden="true" /><strong>Preparando o visualizador…</strong></div>}>
            <ExcalidrawViewer file="diagrams/fluxo.excalidraw" />
          </Suspense>
        </ArtifactModal>
      )}

      {selectedArtifact === "comparison" && (
        <ArtifactModal eyebrow="03 · Comparação" title="Comparação entre versões" onClose={closeArtifact}>
          <Suspense fallback={<div className="viewer-status"><span className="viewer-spinner" aria-hidden="true" /><strong>Preparando a comparação…</strong></div>}>
            <AccessibilityComparison />
          </Suspense>
        </ArtifactModal>
      )}

      {selectedArtifact === "mockup" && (
        <ArtifactModal eyebrow="02 · Interface" title="Mockup do conversor acessível" onClose={closeArtifact}>
          <ProductInterfaceMockup />
        </ArtifactModal>
      )}

      {selectedArtifact && !["flow", "comparison", "mockup"].includes(selectedArtifact) && (
        <ArtifactModal eyebrow="Conteúdo" title="Visualização em construção" onClose={closeArtifact}>
          <div className="viewer-status"><strong>Esta parte será acrescentada na próxima etapa.</strong></div>
        </ArtifactModal>
      )}
    </main>
  );
}
