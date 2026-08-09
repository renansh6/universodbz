import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import heroAsset from "@/assets/hero-goku.png.asset.json";
import comboAsset from "@/assets/combo-db.jpg.asset.json";
import videoAsset from "@/assets/video-dbz.mp4.asset.json";
import { trackPixel, withUtms, getTrackingContext } from "@/lib/tracking";
import { trackServerEvent } from "@/lib/tracking.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dragonverso — Todos os Filmes e Animações de Dragon Ball" },
      {
        name: "description",
        content:
          "Acesso imediato a todas as animações e filmes de Dragon Ball em 1080p dublados, mais 40 mangás. Entrega imediata no e-mail.",
      },
      { property: "og:title", content: "Dragonverso — Animações e Mangás de Dragon Ball" },
      {
        property: "og:description",
        content: "Todos os filmes e animações em 1080p dublados + coleção de mangás. Acesso vitalício.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const beneficios = [
  "Todos filmes de Dragon Ball e especiais reunidos em um só lugar",
  "Todas as animações em 1080p e dubladas em português",
  "Todas as HQ's clássicas e modernas na maior qualidade",
  "Você recebe imediatamente no seu e-mail",
];

const series = [
  "Todas as séries",
  "Especiais",
  "Dragon Ball clássico",
  "Dragon Ball Z",
  "Dragon Ball GT",
  "Dragon Ball Super",
  "Dragon Ball Daima",
  "Dragon Ball Kai",
  "Super Dragon Ball Heroes",
];

const filmes = [
  "Dragon Ball Super: Broly",
  "Dragon Ball Super: Super Hero",
  "A Batalha dos Deuses",
  "O Renascimento de Freeza",
  "O Ataque do Dragão",
  "O Retorno de Cooler",
];

const depoimentos = [
  {
    nome: "Marcos Almeida",
    iniciais: "MA",
    texto:
      "Cara, que nostalgia! Eu assistia Dragon Ball quando era criança e poder rever as sagas e filmes completos foi bom demais. Já estou maratonando tudo! 🔥",
  },
  {
    nome: "Lucas Ferreira",
    iniciais: "LF",
    texto:
      "Eu procurava fazia tempo uma coleção assim. Ter tudo organizado em um só lugar facilitou demais. Já comecei pelo Dragon Ball Z 😂🐉",
  },
  {
    nome: "Rafael Santos",
    iniciais: "RS",
    texto:
      "Minha infância inteira está aqui kkkkk. Comecei assistindo um episódio e quando percebi já estava horas maratonando. Valeu muito a pena! 🔥",
  },
];

const comentarios = [
  {
    user: "joao_ferreira92",
    iniciais: "JF",
    texto: "Mano, isso aqui é nostalgia pura 😂 já comecei a rever Dragon Ball com meu filho!",
    tempo: "2 h",
  },
  {
    user: "carlos_dbz",
    iniciais: "CD",
    texto: "Finalmente encontrei os filmes que eu procurava fazia anos. Muito bom!",
    tempo: "3 h",
  },
  {
    user: "matheus_silva",
    iniciais: "MS",
    texto: "Já assisti Dragon Ball, agora vou começar o Z. Acervo absurdo 🔥🐉",
    tempo: "4 h",
  },
  {
    user: "bruno_oliveira",
    iniciais: "BO",
    texto: "Pra quem cresceu assistindo Dragon Ball, isso aqui é ouro ❤️",
    tempo: "5 h",
  },
];




const faq = [
  {
    q: "Como eu recebo o acesso?",
    a: "Logo após a confirmação do pagamento você recebe o link de acesso no e-mail cadastrado na compra.",
  },
  {
    q: "O acesso é vitalício?",
    a: "Sim. Você paga uma única vez e continua com acesso a todo o acervo, incluindo as atualizações futuras.",
  },
  {
    q: "Funciona na TV e no celular?",
    a: "Funciona em qualquer aparelho com internet: celular, tablet, computador ou Smart TV.",
  },
  {
    q: "E se eu não gostar?",
    a: "Você tem 7 dias de garantia incondicional. Basta pedir o reembolso e devolvemos 100% do valor.",
  },
];

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

  return (
    <main className="mx-auto w-full max-w-[720px] px-5 pb-20">
      <section className="pt-2 text-center">
        <div className="mx-auto w-full overflow-hidden">
          <img
            src={heroAsset.url}
            alt="Guerreiro de kimono laranja sobre faixa vermelha"
            width={943}
            height={1697}
            className="mx-auto h-[240px] w-full object-cover object-top sm:h-[380px]"
          />
        </div>


        <h1 className="mt-2 text-balance text-2xl leading-[1.05] sm:text-4xl">
          <span className="mb-3 inline-block bg-primary px-3 py-1 text-sm font-bold sm:text-lg">
            Tenha acesso a todas as animações
          </span>
          <br />
          DE DRAGON BALL
        </h1>

        <p className="mx-auto mt-4 max-w-[34ch] text-sm font-semibold text-muted-foreground sm:text-base">
          Agora você pode assistir a todas as animações e filmes de DRAGON BALL em alta qualidade e
          sem nenhum anúncio aparecendo na tela!
        </p>

        <p className="mt-7 text-base font-bold text-gold sm:text-lg">
          🐉 Você recebe imediatamente tudo isso:
        </p>

      </section>

      <section className="mt-5 text-left">
        <p className="text-sm text-muted-foreground">Você receberá imediatamente no seu e-mail:</p>
        <ul className="mt-3 space-y-2">
          {beneficios.map((b) => (
            <li key={b} className="flex gap-2 text-sm font-semibold sm:text-base">
              <span className="text-success">✔</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary">
          <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-primary" />9 assistindo
        </span>

        <div className="relative mt-3 w-full overflow-hidden rounded-xl">
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
            className="absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition hover:bg-black/90"
          >
            {muted ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4.03v8.06A4.5 4.5 0 0016.5 12z" />
                <path d="M19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.96 8.96 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71z" />
                <path stroke="currentColor" strokeWidth="2" d="M3 3l18 18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4.03v8.06A4.5 4.5 0 0016.5 12z" />
                <path d="M19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.96 8.96 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71z" />
              </svg>
            )}
          </button>
        </div>
      </section>

      <section className="mt-8 text-center">
        <p className="text-xl font-extrabold leading-tight sm:text-2xl">
          Sabemos como é chato ficar horas procurando suas animações favoritas na internet e se
          deparar com sites estranhos, cheios de anúncios ou abas estranhas...
        </p>
        <p className="mt-4 text-sm font-bold sm:text-base">
          Por esse motivo nós criamos o nosso Universo Dragon Ball !
        </p>
        <p className="mt-1 text-sm font-semibold text-muted-foreground">
          Onde reunimos todas os filmes e series na melhor qualidade para você assistir sempre que
          quiser! E o melhor de tudo é que você não precisa se preocupar com anúncios!
        </p>
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-card p-5 text-center">
        <img
          src={comboAsset.url}
          alt="Acervo de animações e mangás de Dragon Ball em celular, tablet e notebook"
          width={1024}
          height={768}
          loading="lazy"
          className="mx-auto w-full rounded-xl"
        />

        <h2 className="mt-6 text-2xl sm:text-3xl">Escolha o seu acesso</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Pagamento único. Sem mensalidade, sem anúncio, sem enrolação.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 text-left">
          <div className="flex h-full flex-col rounded-xl border-2 border-primary p-4">
            <p className="text-center text-lg font-bold uppercase tracking-widest text-muted-foreground sm:text-xl">
              🐉 DRAGONVERSO
            </p>
            <p className="mt-1 text-center text-3xl font-bold">R$ 6,90</p>

            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gold">
              Você recebe:
            </p>
            <ul className="mt-2 space-y-1.5">
              {series.map((s) => (
                <li key={s} className="flex gap-2 text-sm">
                  <span className="text-success">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://ggcheckout.app/checkout/v5/eGBQp6pUBIpzkxGl5jJI"
              onClick={handleCheckout("Acesso DRAGONVERSO", 6.9)}
              className="cta-glow mt-6 flex w-full items-center justify-center rounded-md bg-success px-4 pt-4 pb-4 text-center text-sm font-extrabold uppercase leading-tight tracking-wide text-success-foreground underline underline-offset-4 transition-transform hover:scale-[1.02] sm:text-base"
            >
              Quero o Dragonverso
            </a>
          </div>

          <div className="flex h-full flex-col rounded-xl border-2 border-success p-4">
            <p className="text-center text-lg font-bold uppercase tracking-widest text-gold sm:text-xl">
              🔥 Combo Kamehameha
            </p>
            <p className="mt-1 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
              O mais escolhido
            </p>
            <p className="mt-1 text-center text-3xl font-bold">R$ 9,90</p>

            <p className="mt-3 text-center text-sm font-bold">
              Você recebe TUDO DO DRAGONVERSO +
            </p>

            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gold">
              🎬 24 filmes
            </p>
            <ul className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
              {filmes.map((f) => (
                <li key={f} className="flex gap-2 text-sm">
                  <span className="text-success">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">
              +19 filmes no acervo
            </p>

            <p className="mt-4 flex gap-2 text-sm font-bold">
              <span className="text-success">✓</span>
              <span>📖 40 mangás</span>
            </p>
            <p className="mt-1.5 flex gap-2 text-sm font-bold">
              <span className="text-success">✓</span>
              <span>🎥 Conteúdos extras</span>
            </p>

            <div className="mt-5 text-center">
              <p className="text-sm font-bold text-gold">
                → De: <span className="line-through">R$ 49,90</span>
              </p>
              <p className="mt-1 text-sm font-bold text-muted-foreground">Por apenas</p>
              <p className="leading-none">
                <span className="text-2xl font-extrabold text-primary align-top">R$</span>
                <span className="text-5xl font-extrabold text-primary sm:text-6xl">9,90</span>
              </p>
            </div>

            <a
              href="https://ggcheckout.app/checkout/v5/kcadVa83rqYfqnRwH5Ve"
              onClick={handleCheckout("Combo KAMEHAMEHA", 9.9)}
              className="mt-6 flex w-full items-center justify-center rounded-md bg-success px-4 pt-4 pb-4 text-center text-sm font-extrabold uppercase leading-tight tracking-wide text-success-foreground underline underline-offset-4 transition-transform hover:scale-[1.02] sm:text-base"
            >
              Quero o Combo Completo
            </a>
          </div>

        </div>


        <p className="mt-5 text-xs text-muted-foreground">
          🔒 Compra 100% segura · Garantia incondicional de 7 dias
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-center text-xl sm:text-2xl">
          💬 Acompanhe o feedback de quem já garantiu
        </h2>
        <p className="mx-auto mt-2 max-w-[42ch] text-center text-sm text-muted-foreground">
          Acompanhe o depoimento de alguns dos milhares de fãs que já garantiram seu acesso ao nosso
          acervo 🐉
        </p>

        <div className="mt-5 space-y-3">
          {depoimentos.map((d) => (
            <div key={d.nome} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {d.iniciais}
                </span>
                <div>
                  <p className="text-sm font-bold">{d.nome}</p>
                  <p className="text-xs text-muted-foreground">· Via Instagram</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-gold">★★★★★</p>
              <p className="mt-2 text-sm text-muted-foreground">“{d.texto}”</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm font-bold">Comentários</p>
        <div className="mt-3 space-y-4">
          {comentarios.map((c) => (
            <div key={c.user} className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                {c.iniciais}
              </span>
              <div>
                <p className="text-sm">
                  <span className="font-bold">{c.user}</span>{" "}
                  <span className="text-muted-foreground">comentou: “{c.texto}”</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  <span className="text-primary">♡</span> Responder · {c.tempo}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-border bg-card p-6 text-center">
        <h2 className="text-xl sm:text-2xl">
          🐉 Pronto para entrar no universo Dragon Ball?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Escolha seu acesso e comece a explorar seu acervo.
        </p>

        <p className="mt-5 text-base font-bold">DRAGONVERSO — R$ 6,90</p>
        <p className="mt-1 text-sm text-muted-foreground">ou</p>
        <p className="mt-1 text-base font-bold text-gold">🔥 COMBO KAMEHAMEHA — R$ 9,90</p>
        <p className="mt-2 text-xs font-bold uppercase tracking-widest text-gold">
          ⭐ Recomendado
        </p>

        <a
          href="https://ggcheckout.app/checkout/v5/kcadVa83rqYfqnRwH5Ve"
          onClick={handleCheckout("CTA Final Combo KAMEHAMEHA", 9.9)}
          className="cta-glow mt-5 flex w-full items-center justify-center rounded-md bg-success px-4 pt-4 pb-4 text-center text-sm font-extrabold uppercase leading-tight tracking-wide text-success-foreground underline underline-offset-4 transition-transform hover:scale-[1.02] sm:text-base"
        >
          🔥 Quero o Combo Kamehameha
        </a>
      </section>


      <section className="mt-10">
        <h2 className="text-center text-2xl">Perguntas frequentes</h2>
        <div className="mt-4 space-y-3">
          {faq.map((item) => (
            <details key={item.q} className="rounded-xl border border-border bg-card p-4">
              <summary className="cursor-pointer text-sm font-bold">{item.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        <p>Dragonverso © {new Date().getFullYear()} — Todos os direitos reservados.</p>
        <p className="mt-2">
          Este site não é afiliado a nenhuma editora ou estúdio. Conteúdo de acervo pessoal.
        </p>
      </footer>
    </main>
  );
}
