import { lazy, Suspense, useCallback, useState } from "react";
import { ArtifactCard } from "./components/ArtifactCard";
import { ArtifactModal } from "./components/ArtifactModal";
import { ComparisonPreview } from "./components/ComparisonPreview";
import { FlowPreview } from "./components/FlowPreview";
import { Header } from "./components/Header";
import { ProductInterfaceMockup } from "./components/ProductInterfaceMockup";
import { ProductInterfacePreview } from "./components/ProductInterfacePreview";
import { ProjectSources } from "./components/ProjectSources";

const ExcalidrawViewer = lazy(() =>
  import("./components/ExcalidrawViewer").then((module) => ({ default: module.ExcalidrawViewer })),
);

const AccessibilityComparison = lazy(() =>
  import("./components/AccessibilityComparison").then((module) => ({ default: module.AccessibilityComparison })),
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
    eyebrow: "02 · Interface",
    title: "Conversor acessível",
    description: "Mockup navegável do fluxo de importação, revisão e conformidade.",
    accent: "#e07a5f",
    preview: <ProductInterfacePreview />,
  },
  {
    id: "comparison",
    eyebrow: "03 · Evidências",
    title: "Comparativo de formatos",
    description: "Imagem, Markdown do OCR e EPUB reconstruído sob análise.",
    accent: "#3a8d73",
    preview: <ComparisonPreview />,
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
          <p className="section-kicker">Artefatos do projeto</p>
          <h2 id="artifacts-title">Três partes de um mesmo processo</h2>
          <p>Abra cada artefato para consultar o fluxo, testar o mockup da interface e comparar os arquivos produzidos.</p>
        </div>

        <div className="artifact-grid">
          {artifacts.map((artifact) => (
            <ArtifactCard key={artifact.id} {...artifact} onOpen={() => setSelectedArtifact(artifact.id)} />
          ))}
        </div>
      </section>

      <ProjectSources />

      {selectedArtifact === "flow" && (
        <ArtifactModal eyebrow="01 · Processo" title="Fluxo do sistema" onClose={closeArtifact}>
          <Suspense fallback={<div className="viewer-status"><span className="viewer-spinner" aria-hidden="true" /><strong>Preparando o visualizador…</strong></div>}>
            <ExcalidrawViewer file="diagrams/fluxo.excalidraw" />
          </Suspense>
        </ArtifactModal>
      )}

      {selectedArtifact === "comparison" && (
        <ArtifactModal eyebrow="03 · Evidências" title="Comparativo de formatos" onClose={closeArtifact}>
          <Suspense fallback={<div className="viewer-status"><span className="viewer-spinner" aria-hidden="true" /><strong>Preparando o comparativo…</strong></div>}>
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
        <ArtifactModal eyebrow="Artefato" title="Visualização em construção" onClose={closeArtifact}>
          <div className="viewer-status"><strong>Este artefato será integrado na próxima etapa.</strong></div>
        </ArtifactModal>
      )}
    </main>
  );
}
