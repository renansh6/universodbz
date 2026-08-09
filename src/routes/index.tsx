import { createFileRoute } from "@tanstack/react-router";
import { useEffect, type MouseEvent } from "react";
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
  "Dragon Ball",
  "Dragon Ball Absalon",
  "Dragon Ball Daima",
  "Dragon Ball GT",
  "Dragon Ball Kai",
  "Dragon Ball Super",
  "Dragon Ball Z",
  "Super Dragon Ball Heroes",
];

const filmes = [
  "A Lenda de Shenlong",
  "A Bela Adormecida do Castelo Amaldiçoado",
  "A Aventura Mística",
  "Em Busca do Poder",
  "O Legado de um Herói",
  "Dragon Ball Super: Broly",
  "Dragon Ball Super: Super Hero",
  "Devolva-me Gohan",
  "O Homem Mais Forte do Mundo",
  "A Árvore do Poder",
  "Goku, o Super Sayajin",
  "Uma Vingança para Freeza",
  "O Retorno de Cooler",
  "O Retorno dos Andróides",
  "O Poder Invencível",
  "A Batalha Nos Dois Mundos",
  "O Retorno do Guerreiro Lendário",
  "O Combate Final: Bio-Broly",
  "Uma Nova Fusão! Goku e Vegeta",
  "O Ataque do Dragão",
  "A Batalha dos Deuses",
  "O Renascimento de Freeza",
  "Dragon Ball Evolution",
  "Dragon Ball: O Início da Magia",
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
              <span className="text-primary">✔</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary">
          <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-primary" />9 assistindo
        </span>

        <div className="mt-3 w-full overflow-hidden rounded-xl">
          <video
            src={videoAsset.url}
            controls
            playsInline
            preload="metadata"
            className="block h-auto w-full"
          />
        </div>
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
          <div className="flex h-full flex-col rounded-xl border border-border p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Acesso DRAGONVERSO
            </p>
            <p className="mt-1 text-3xl font-bold">
              R$ 6,90<span className="text-base font-semibold text-muted-foreground"> à vista</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Todas as séries e especiais de Dragon Ball em um só lugar.
            </p>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gold">
              📺 Séries / especiais inclusos:
            </p>
            <ul className="mt-2 space-y-1.5">
              {series.map((s) => (
                <li key={s} className="flex gap-2 text-sm">
                  <span className="text-primary">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://ggcheckout.app/checkout/v2/eGBQp6pUBIpzkxGl5jJI"
              onClick={handleCheckout("Acesso DRAGONVERSO", 6.9)}
              className="cta-glow mt-6 flex w-full items-center justify-center rounded-md bg-success px-4 pt-4 pb-4 text-center text-sm font-extrabold uppercase leading-tight tracking-wide text-success-foreground underline underline-offset-4 transition-transform hover:scale-[1.02] sm:text-base"
            >
              Quero entrar no Dragonverso
            </a>
          </div>

          <div className="flex h-full flex-col rounded-xl border-2 border-primary p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gold">
              Combo KAMEHAMEHA · mais escolhido
            </p>
            <p className="mt-1 text-3xl font-bold">
              R$ 9,90<span className="text-base font-semibold text-muted-foreground"> à vista</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Tudo do plano anterior + coleção completa de filmes de Dragon Ball.
            </p>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gold">
              🎬 24 filmes inclusos:
            </p>
            <ul className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
              {filmes.map((f, i) => (
                <li key={f} className="flex gap-2 text-sm">
                  <span className="text-primary">✓</span>
                  <span>
                    {i + 1}. {f}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gold">
              📖 + 40 mangás inclusos:
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Coleção completa de 40 mangás de Dragon Ball em alta qualidade.
            </p>
            <a
              href="https://ggcheckout.app/checkout/v2/kcadVa83rqYfqnRwH5Ve"
              onClick={handleCheckout("Combo KAMEHAMEHA", 9.9)}
              className="mt-6 flex w-full items-center justify-center rounded-md bg-success px-4 pt-4 pb-4 text-center text-sm font-extrabold uppercase leading-tight tracking-wide text-success-foreground underline underline-offset-4 transition-transform hover:scale-[1.02] sm:text-base"
            >
              Quero o Combo KAMEHAMEHA
            </a>
          </div>

        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          🔒 Compra 100% segura · Garantia incondicional de 7 dias
        </p>
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
