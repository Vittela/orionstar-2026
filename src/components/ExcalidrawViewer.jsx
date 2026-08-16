import { useCallback, useEffect, useState } from "react";
import { Maximize } from "lucide-react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

export function ExcalidrawViewer({ file }) {
  const [scene, setScene] = useState(null);
  const [error, setError] = useState("");
  const [api, setApi] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${import.meta.env.BASE_URL}${file}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Não foi possível carregar o diagrama (${response.status}).`);
        return response.json();
      })
      .then(setScene)
      .catch((requestError) => {
        if (requestError.name !== "AbortError") setError(requestError.message);
      });

    return () => controller.abort();
  }, [file]);

  const fitToScreen = useCallback(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    api?.scrollToContent(undefined, { fitToViewport: true, viewportZoomFactor: 0.86, animate: !reduceMotion });
  }, [api]);

  useEffect(() => {
    if (!api || !scene) return undefined;
    const frame = window.requestAnimationFrame(fitToScreen);
    return () => window.cancelAnimationFrame(frame);
  }, [api, fitToScreen, scene]);

  if (error) {
    return <div className="viewer-status viewer-status--error" role="alert"><strong>O diagrama não abriu.</strong><span>{error}</span></div>;
  }

  if (!scene) {
    return <div className="viewer-status" role="status" aria-live="polite"><span className="viewer-spinner" aria-hidden="true" /><strong>Carregando o fluxo…</strong></div>;
  }

  return (
    <div className="excalidraw-viewer" role="region" aria-label="Diagrama do fluxo do projeto">
      <details className="viewer-transcript">
        <summary>Descrição textual do fluxo</summary>
        <ol>
          <li>Entrada de um PDF ou de uma imagem digitalizada.</li>
          <li>Extração de texto por OCR e análise do layout com apoio de IA.</li>
          <li>Definição da ordem de leitura e reconhecimento de tabelas.</li>
          <li>Classificação semântica de capítulos, seções, parágrafos, fórmulas, figuras, tabelas e notas.</li>
          <li>Revisão das relações, do MathML e dos textos alternativos.</li>
          <li>Geração de um EPUB estruturado para validação.</li>
        </ol>
      </details>
      <div className="viewer-helper">Arraste para navegar · Use os controles inferiores, a roda ou a pinça para aplicar zoom</div>
      <button className="viewer-fit-button" type="button" onClick={fitToScreen}>
        <Maximize size={17} aria-hidden="true" />
        Ajustar à tela
      </button>
      <Excalidraw
        initialData={{ ...scene, scrollToContent: true }}
        excalidrawAPI={setApi}
        langCode="pt-BR"
        theme="light"
        viewModeEnabled
        zenModeEnabled={false}
        UIOptions={{
          canvasActions: {
            changeViewBackgroundColor: false,
            clearCanvas: false,
            export: false,
            loadScene: false,
            saveAsImage: false,
            toggleTheme: false,
          },
        }}
      />
    </div>
  );
}
