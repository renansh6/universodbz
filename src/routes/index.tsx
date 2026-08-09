import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import heroAsset from "@/assets/hero-goku.png.asset.json";
import comboAsset from "@/assets/combo-db.jpg.asset.json";
import videoAsset from "@/assets/video-dbz.mp4.asset.json";
import { trackPixel, withUtms, getTrackingContext } from "@/lib/tracking";
import { trackServerEvent } from "@/lib/tracking.functions";

const TITLE = "Dragonverso — O Universo de Dragon Ball em um Só Lugar";
const DESCRIPTION =
  "Tenha acesso a séries, filmes, especiais e mangás de Dragon Ball em um único acervo. Acesso imediato e pagamento único.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://universodbz.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://universodbz.lovable.app/" }],
  }),
  component: Index,
});

const CHECKOUT_COMBO = "https://ggcheckout.app/checkout/v5/kcadVa83rqYfqnRwH5Ve";
const CHECKOUT_BASICO = "https://ggcheckout.app/checkout/v5/eGBQp6pUBIpzkxGl5jJI";

const acervo = [
  { nome: "Dragon Ball", desc: "A jornada clássica desde a infância de Goku." },
  { nome: "Dragon Ball Z", desc: "As batalhas mais icônicas da franquia." },
  { nome: "Dragon Ball GT", desc: "A saga com as Esferas do Dragão Supremas." },
  { nome: "Dragon Ball Kai", desc: "A versão remasterizada e mais dinâmica de Z." },
  { nome: "Dragon Ball Super", desc: "Deuses da destruição e o Torneio do Poder." },
  { nome: "Dragon Ball Daima", desc: "A produção mais recente do universo." },
  { nome: "Dragon Ball Heroes", desc: "Batalhas alternativas e crossovers." },
  { nome: "Dragon Ball Absalon", desc: "Produção alternativa feita por fãs." },
];

const beneficiosGrid = [
  {
    icone: "📺",
    titulo: "Séries",
    desc: "Dragon Ball, Z, GT, Kai, Super, Daima, Heroes e Absalon.",
  },
  { icone: "🎬", titulo: "Filmes e especiais", desc: "+24 filmes e especiais de Dragon Ball." },
  { icone: "📖", titulo: "Mangás", desc: "Coleção com 40 mangás de Dragon Ball." },
  { icone: "🔥", titulo: "Conteúdos especiais", desc: "Extras relacionados ao universo Dragon Ball." },
  { icone: "⚡", titulo: "Acesso imediato", desc: "Liberado após a confirmação do pagamento." },
  { icone: "♾️", titulo: "Acesso vitalício", desc: "Pagamento único, sem mensalidade." },
];

const filmes: { titulo: string; categoria: string }[] = [
  { titulo: "A Lenda de Shenlong", categoria: "Filme clássico" },
  { titulo: "A Bela Adormecida do Castelo Amaldiçoado", categoria: "Filme clássico" },
  { titulo: "A Aventura Mística", categoria: "Filme clássico" },
  { titulo: "Em Busca do Poder", categoria: "Filme clássico" },
  { titulo: "O Legado de um Herói", categoria: "Especial" },
  { titulo: "Devolva-me Gohan", categoria: "Filme Z" },
  { titulo: "O Homem Mais Forte do Mundo", categoria: "Filme Z" },
  { titulo: "A Árvore do Poder", categoria: "Filme Z" },
  { titulo: "Goku, o Super Sayajin", categoria: "Filme Z" },
  { titulo: "Uma Vingança para Freeza", categoria: "Filme Z" },
  { titulo: "O Retorno de Cooler", categoria: "Filme Z" },
  { titulo: "O Retorno dos Andróides", categoria: "Filme Z" },
  { titulo: "O Poder Invencível", categoria: "Filme Z" },
  { titulo: "A Batalha Nos Dois Mundos", categoria: "Filme Z" },
  { titulo: "O Retorno do Guerreiro Lendário", categoria: "Filme Z" },
  { titulo: "O Combate Final: Bio-Broly", categoria: "Filme Z" },
  { titulo: "Uma Nova Fusão! Goku e Vegeta", categoria: "Filme Z" },
  { titulo: "O Ataque do Dragão", categoria: "Filme Z" },
  { titulo: "A Batalha dos Deuses", categoria: "Filme Super" },
  { titulo: "O Renascimento de Freeza", categoria: "Filme Super" },
  { titulo: "Dragon Ball Super: Broly", categoria: "Filme Super" },
  { titulo: "Dragon Ball Super: Super Hero", categoria: "Filme Super" },
  { titulo: "Dragon Ball: O Início da Magia", categoria: "Especial" },
  { titulo: "Dragon Ball Evolution", categoria: "Live action" },
];

const dispositivos = [
  { icone: "📱", nome: "Celular", desc: "Assista em qualquer lugar, direto do navegador." },
  { icone: "💻", nome: "Computador", desc: "Tela grande, ideal para maratonar as sagas." },
  { icone: "📺", nome: "Smart TV", desc: "Acesse pela TV e reviva tudo na sala de casa." },
  { icone: "📲", nome: "Tablet", desc: "Perfeito também para a leitura dos mangás." },
];

const faq = [
  {
    q: "Como recebo meu acesso?",
    a: "Após a confirmação do pagamento, o link de acesso é enviado para o e-mail informado na compra.",
  },
  { q: "O acesso é vitalício?", a: "Sim. Você paga uma vez e continua com acesso ao acervo." },
  { q: "Existe mensalidade?", a: "Não. Não há cobrança recorrente de nenhum tipo." },
  { q: "Posso acessar pelo celular?", a: "Sim. Basta abrir o link no navegador do seu celular." },
  { q: "Funciona na Smart TV?", a: "Sim, em qualquer aparelho com internet e navegador." },
  { q: "Quando recebo o acesso?", a: "Assim que o pagamento é confirmado pelo checkout." },
  {
    q: "Como funciona a garantia?",
    a: "Você tem 7 dias para conhecer o conteúdo e solicitar o reembolso conforme as condições da garantia.",
  },
  { q: "O pagamento é único?", a: "Sim. É um pagamento único, sem renovação automática." },
];

function Selos({ className = "" }: { className?: string }) {
  return (
    <ul
      className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-semibold text-muted-foreground sm:text-xs ${className}`}
    >
      <li>🔒 Pagamento seguro</li>
      <li>⚡ Acesso imediato</li>
      <li>♾️ Pagamento único</li>
    </ul>
  );
}

function Index() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const eventId = trackPixel(
      "ViewContent",
      { content_name: "Landing Dragonverso", currency: "BRL" },
      { once: true },
    );
    if (eventId) {
      void trackServerEvent({
        data: {
          eventName: "ViewContent",
          eventId,
          contentName: "Landing Dragonverso",
          currency: "BRL",
          ...getTrackingContext(),
        },
      }).catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => {
      v.play().catch(() => {
        v.muted = true;
        setMuted(true);
        v.play().catch(() => undefined);
      });
    };
    tryPlay();
    v.addEventListener("loadedmetadata", tryPlay);
    return () => v.removeEventListener("loadedmetadata", tryPlay);
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => undefined);
  };

  const handleCheckout =
    (contentName: string, value: number) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      const href = event.currentTarget.getAttribute("href") ?? "";
      const eventId = trackPixel("InitiateCheckout", {
        content_name: contentName,
        value,
        currency: "BRL",
      });
      if (eventId) {
        void trackServerEvent({
          data: {
            eventName: "InitiateCheckout",
            eventId,
            contentName,
            value,
            currency: "BRL",
            ...getTrackingContext(),
          },
        }).catch(() => undefined);
      }
      window.location.href = withUtms(href);
    };

  const ctaCombo = handleCheckout("Combo KAMEHAMEHA", 9.9);
  const ctaBasico = handleCheckout("Acesso DRAGONVERSO", 6.9);

  return (
    <main className="overflow-x-hidden pb-28 md:pb-0">
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-border">
        <div className="glow-orb" aria-hidden="true" />
        <div className="mx-auto w-full max-w-[1100px] px-5 pt-6 md:grid md:grid-cols-2 md:items-center md:gap-10 md:pt-14">
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-gold">
              🔥 Oferta especial
            </span>

            <h1 className="mt-4 text-balance text-[26px] leading-[1.08] sm:text-4xl md:text-[42px]">
              🐉 O universo de Dragon Ball agora em um só lugar
            </h1>

            <p className="mx-auto mt-4 max-w-[46ch] text-sm font-semibold text-muted-foreground sm:text-base md:mx-0">
              Filmes, séries, especiais e mangás reunidos em um único acervo para você reviver seus
              melhores momentos de Dragon Ball.
            </p>

            <ul className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
              {["⚡ Acesso imediato", "🔒 Compra segura", "♾️ Acesso vitalício"].map((i) => (
                <li
                  key={i}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold"
                >
                  {i}
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl border border-border bg-card/80 p-5 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Acesso completo por apenas
              </p>
              <p className="mt-1 text-5xl font-bold text-gold">R$ 9,90</p>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                Pagamento único · sem mensalidade
              </p>

              <a
                href={CHECKOUT_COMBO}
                onClick={ctaCombo}
                className="cta-glow mt-5 flex w-full items-center justify-center rounded-xl bg-success px-4 py-4 text-center text-sm font-extrabold uppercase leading-tight tracking-wide text-success-foreground transition-transform hover:scale-[1.02] sm:text-base"
              >
                🐉 Quero acessar o Dragonverso
              </a>

              <ul className="mt-3 space-y-0.5 text-center text-[11px] font-semibold text-muted-foreground sm:text-xs">
                <li>🔒 Pagamento seguro</li>
                <li>⚡ Liberação após confirmação</li>
                <li>♾️ Pagamento único</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 md:mt-0">
            <img
              src={heroAsset.url}
              alt="Guerreiro de Dragon Ball em kimono laranja"
              width={943}
              height={1697}
              fetchPriority="high"
              className="mx-auto h-[260px] w-full rounded-2xl object-cover object-top sm:h-[380px] md:h-[460px]"
            />
          </div>
        </div>
      </section>

      {/* O QUE VOCÊ RECEBE */}
      <section className="mx-auto w-full max-w-[1100px] px-5 py-14">
        <h2 className="text-center text-2xl sm:text-3xl">🐉 Tudo isso em um único acesso</h2>
        <p className="mx-auto mt-3 max-w-[52ch] text-center text-sm text-muted-foreground">
          Uma coleção criada para quem quer ter o universo de Dragon Ball reunido em um só lugar.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {beneficiosGrid.map((b) => (
            <div
              key={b.titulo}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-gold/50"
            >
              <span className="text-2xl">{b.icone}</span>
              <h3 className="mt-3 text-base uppercase tracking-wide">{b.titulo}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ACERVO DE SÉRIES */}
      <section className="border-y border-border bg-card/30 py-14">
        <div className="mx-auto w-full max-w-[1100px] px-5">
          <h2 className="text-center text-2xl sm:text-3xl">
            🔥 Um acervo feito para quem é fã de verdade
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {acervo.map((s) => (
              <article
                key={s.nome}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-gold/60"
              >
                <div className="ki-tile grid h-24 place-items-center text-3xl">🐉</div>
                <div className="p-4">
                  <h3 className="text-sm uppercase tracking-wide">{s.nome}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FILMES */}
      <section className="mx-auto w-full max-w-[1100px] px-5 py-14">
        <h2 className="text-center text-2xl sm:text-3xl">🎬 Combo Kamehameha</h2>
        <p className="mx-auto mt-3 max-w-[52ch] text-center text-sm text-muted-foreground">
          Todos os seus filmes e especiais favoritos reunidos em um único lugar.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filmes.map((f) => (
            <article
              key={f.titulo}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-gold/50"
            >
              <div className="ki-tile grid h-16 place-items-center text-xl">🎬</div>
              <div className="flex flex-1 flex-col p-3">
                <p className="text-xs font-bold leading-snug">{f.titulo}</p>
                <p className="mt-auto pt-2 text-[10px] uppercase tracking-widest text-gold">
                  {f.categoria}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* MANGÁS */}
      <section className="border-y border-border bg-card/30 py-14">
        <div className="mx-auto w-full max-w-[1100px] px-5">
          <h2 className="text-center text-2xl sm:text-3xl">📖 Para quem também ama os mangás</h2>
          <p className="mx-auto mt-3 max-w-[52ch] text-center text-sm text-muted-foreground">
            Além das séries e filmes, você também recebe acesso à coleção com 40 mangás de Dragon
            Ball.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["Edição clássica", "Perfect Edition", "Sagas completas", "Alta qualidade"].map((m) => (
              <div
                key={m}
                className="rounded-xl border border-border bg-card p-4 text-center transition-colors hover:border-gold/50"
              >
                <span className="text-2xl">📖</span>
                <p className="mt-2 text-xs font-bold">{m}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOR */}
      <section className="mx-auto w-full max-w-[760px] px-5 py-14 text-center">
        <h2 className="text-2xl sm:text-3xl">🐉 Cansado de procurar Dragon Ball pela internet?</h2>
        <div className="mt-6 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
          {[
            "Você procura um episódio e entra em um site qualquer.",
            "Aparecem vários anúncios e abas estranhas.",
            "O vídeo trava, não carrega ou some.",
            "Você perde tempo procurando tudo de novo.",
          ].map((t) => (
            <p
              key={t}
              className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground"
            >
              ❌ {t}
            </p>
          ))}
        </div>
        <p className="mt-6 text-base font-bold sm:text-lg">
          Foi justamente para acabar com essa dor que criamos o Dragonverso.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Agora você encontra seus conteúdos favoritos organizados em um único lugar.
        </p>
      </section>

      {/* SOLUÇÃO */}
      <section className="border-y border-border bg-card/30 py-14">
        <div className="mx-auto w-full max-w-[900px] px-5 text-center">
          <h2 className="text-2xl sm:text-3xl">⚡ Conheça o Dragonverso</h2>
          <p className="mx-auto mt-3 max-w-[58ch] text-sm text-muted-foreground">
            Um acervo criado para reunir diferentes conteúdos de Dragon Ball em um único acesso,
            organizado para você encontrar rapidamente o que quer assistir.
          </p>

          <div className="relative mt-7 overflow-hidden rounded-2xl border border-border">
            <video
              ref={videoRef}
              src={videoAsset.url}
              controls
              autoPlay
              muted
              playsInline
              preload="metadata"
              className="block h-auto w-full"
            />
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Ativar som" : "Silenciar"}
              className="absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm transition hover:bg-background"
            >
              {muted ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4.03v8.06A4.5 4.5 0 0016.5 12z" />
                  <path stroke="currentColor" strokeWidth="2" d="M3 3l18 18" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4.03v8.06A4.5 4.5 0 0016.5 12z" />
                  <path d="M19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.96 8.96 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71z" />
                </svg>
              )}
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["📺 Séries", "🎬 Filmes", "🔥 Especiais", "📖 Mangás"].map((i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-3 text-xs font-bold">
                {i}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROVA SOCIAL */}
      <section className="mx-auto w-full max-w-[1100px] px-5 py-14">
        <p className="text-center text-lg tracking-widest text-gold">⭐⭐⭐⭐⭐</p>
        <h2 className="mt-2 text-center text-2xl sm:text-3xl">
          Quem já entrou no Dragonverso está falando...
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="grid min-h-[190px] place-items-center rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Insira aqui um print real de cliente
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Espaço reservado para prints e feedbacks reais de compradores.
        </p>
      </section>

      {/* ASSISTA ONDE QUISER */}
      <section className="border-y border-border bg-card/30 py-14">
        <div className="mx-auto w-full max-w-[1100px] px-5">
          <h2 className="text-center text-2xl sm:text-3xl">📱 Assista onde quiser</h2>
          <p className="mt-3 text-center text-sm text-muted-foreground">Seu acesso acompanha você.</p>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {dispositivos.map((d) => (
              <div key={d.nome} className="rounded-2xl border border-border bg-card p-5 text-center">
                <span className="text-2xl">{d.icone}</span>
                <h3 className="mt-2 text-sm uppercase tracking-wide">{d.nome}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFERTA PRINCIPAL */}
      <section id="oferta" className="mx-auto w-full max-w-[720px] scroll-mt-4 px-5 py-14">
        <div className="cta-glow rounded-3xl border-2 border-success bg-card p-6 text-center">
          <span className="inline-flex rounded-full bg-gold px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-background">
            Mais escolhido
          </span>
          <h2 className="mt-4 text-2xl sm:text-3xl">🐉 Combo Kamehameha</h2>
          <p className="mx-auto mt-2 max-w-[46ch] text-sm text-muted-foreground">
            A coleção completa para quem quer aproveitar o máximo do universo Dragon Ball.
          </p>

          <ul className="mx-auto mt-6 grid max-w-[420px] grid-cols-1 gap-2 text-left sm:grid-cols-2">
            {[
              "Séries",
              "Filmes",
              "Especiais",
              "40 mangás",
              "Conteúdos extras",
              "Acesso imediato",
              "Acesso vitalício",
              "Pagamento único",
            ].map((i) => (
              <li key={i} className="flex gap-2 text-sm font-semibold">
                <span className="text-success">✅</span>
                {i}
              </li>
            ))}
          </ul>

          <p className="mt-7 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Por apenas
          </p>
          <p className="text-5xl font-bold text-gold">R$ 9,90</p>

          <a
            href={CHECKOUT_COMBO}
            onClick={ctaCombo}
            className="mt-5 flex w-full items-center justify-center rounded-xl bg-success px-4 py-4 text-center text-sm font-extrabold uppercase tracking-wide text-success-foreground transition-transform hover:scale-[1.02] sm:text-base"
          >
            🔥 Quero o Combo Kamehameha
          </a>
          <Selos className="mt-3" />
        </div>

        {/* SEGUNDA OPÇÃO */}
        <div className="mt-8 rounded-2xl border border-border bg-card/60 p-5 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            💥 Quer uma opção mais simples?
          </p>
          <h3 className="mt-2 text-lg uppercase">🐉 Acesso Dragonverso</h3>
          <ul className="mx-auto mt-4 grid max-w-[360px] grid-cols-1 gap-1.5 text-left sm:grid-cols-2">
            {["Séries de Dragon Ball", "Acesso imediato", "Acesso vitalício", "Pagamento único"].map(
              (i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-success">✅</span>
                  {i}
                </li>
              ),
            )}
          </ul>
          <p className="mt-4 text-2xl font-bold">R$ 6,90</p>
          <a
            href={CHECKOUT_BASICO}
            onClick={ctaBasico}
            className="mt-4 flex w-full items-center justify-center rounded-xl border-2 border-success px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wide text-success transition-colors hover:bg-success/10"
          >
            🐉 Quero o Acesso Dragonverso
          </a>
        </div>

        <img
          src={comboAsset.url}
          alt="Acervo de animações e mangás de Dragon Ball em celular, tablet e notebook"
          width={1024}
          height={768}
          loading="lazy"
          className="mx-auto mt-8 w-full rounded-2xl"
        />
      </section>

      {/* GARANTIA */}
      <section className="border-y border-border bg-card/30 py-14">
        <div className="mx-auto w-full max-w-[640px] px-5 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border-2 border-gold text-3xl">
            🛡️
          </div>
          <h2 className="mt-5 text-2xl sm:text-3xl">🔒 Compre sem risco</h2>
          <p className="mt-2 text-sm font-bold text-gold">Você tem 7 dias de garantia.</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Faça seu acesso, conheça o conteúdo e veja se o Dragonverso é para você. Se dentro do
            prazo da garantia você decidir que não é o que esperava, poderá solicitar o reembolso
            conforme as condições da garantia.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-[760px] px-5 py-14">
        <h2 className="text-center text-2xl sm:text-3xl">Perguntas frequentes</h2>
        <div className="mt-6 space-y-3">
          {faq.map((item) => (
            <details key={item.q} className="rounded-xl border border-border bg-card p-4">
              <summary className="cursor-pointer text-sm font-bold">{item.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="border-t border-border py-14">
        <div className="mx-auto w-full max-w-[640px] px-5 text-center">
          <h2 className="text-2xl sm:text-3xl">🐉 Seu acesso ao Dragonverso está esperando</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Reviva Dragon Ball, encontre seus conteúdos favoritos e tenha tudo reunido em um só
            lugar.
          </p>
          <p className="mt-6 text-5xl font-bold text-gold">R$ 9,90</p>
          <a
            href={CHECKOUT_COMBO}
            onClick={ctaCombo}
            className="cta-glow mt-5 flex w-full items-center justify-center rounded-xl bg-success px-4 py-4 text-center text-sm font-extrabold uppercase tracking-wide text-success-foreground transition-transform hover:scale-[1.02] sm:text-base"
          >
            🔥 Garantir meu acesso agora
          </a>
          <Selos className="mt-3" />
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8 text-center text-xs text-muted-foreground">
        <p>Dragonverso © {new Date().getFullYear()} — Todos os direitos reservados.</p>
        <p className="mt-2">
          Este site não é afiliado a nenhuma editora ou estúdio. Conteúdo de acervo pessoal.
        </p>
      </footer>

      {/* CTA FIXO MOBILE */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
        <a
          href={CHECKOUT_COMBO}
          onClick={ctaCombo}
          className="flex w-full items-center justify-center rounded-xl bg-success px-4 py-3 text-sm font-extrabold uppercase tracking-wide text-success-foreground"
        >
          🐉 Acessar agora — R$ 9,90
        </a>
      </div>
    </main>
  );
}
