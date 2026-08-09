import { useEffect, useState } from "react";

const compradores = [
  { nome: "Camila S.", cidade: "Natal - RN" },
  { nome: "Lucas M.", cidade: "São Paulo - SP" },
  { nome: "Rafael A.", cidade: "Curitiba - PR" },
  { nome: "Juliana P.", cidade: "Belo Horizonte - MG" },
  { nome: "Pedro H.", cidade: "Recife - PE" },
  { nome: "Bruna L.", cidade: "Porto Alegre - RS" },
  { nome: "Thiago R.", cidade: "Goiânia - GO" },
  { nome: "Marcos V.", cidade: "Salvador - BA" },
];

/** Prova social discreta no canto inferior esquerdo. */
export function SocialProofPopup() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;
    const showTimer = setTimeout(function loop() {
      setVisible(true);
      hideTimer = setTimeout(() => {
        setVisible(false);
        setIndex((i) => (i + 1) % compradores.length);
      }, 5000);
    }, 4000);

    const interval = setInterval(() => {
      setVisible(true);
      hideTimer = setTimeout(() => {
        setVisible(false);
        setIndex((i) => (i + 1) % compradores.length);
      }, 5000);
    }, 12000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearInterval(interval);
    };
  }, []);

  const atual = compradores[index]!;

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed bottom-4 left-4 z-50 max-w-[290px] transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card/95 px-3 py-2.5 shadow-lg backdrop-blur">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {atual.nome.charAt(0)}
        </span>
        <div className="min-w-0 text-[11px] leading-snug">
          <p className="font-bold">
            <span className="text-primary">{atual.nome}</span>{" "}
            <span className="text-foreground">acabou de garantir o acervo 🐉</span>
          </p>
          <p className="mt-0.5 text-muted-foreground">
            📍 {atual.cidade} · há 1 min ·{" "}
            <span className="font-bold text-gold">✓ compra verificada</span>
          </p>
        </div>
      </div>
    </div>
  );
}
