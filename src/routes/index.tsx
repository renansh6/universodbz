import { createFileRoute } from "@tanstack/react-router";
import heroAsset from "@/assets/hero-goku.png.asset.json";
import comboAsset from "@/assets/combo-db.jpg.asset.json";
import videoAsset from "@/assets/video-dbz.mp4.asset.json";

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

const mangas = [
  "Saga O Casamento de Goku",
  "Saga Piccolo Junior",
  "Saga Piccolo Daimaoh",
  "Saga 22° Torneio de Artes Marciais",
  "Saga Red Ribbon",
  "Saga do 21° Torneio de Artes Marciais",
  "Saga Pilaf",
  "Dragon Ball (Perfect Edition)",
  "Saga Saiyajins",
  "Saga Freeza",
  "Saga Cel",
  "Saga Boo completa",
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
  return (
    <main className="mx-auto w-full max-w-[720px] px-5 pb-20">
      <section className="pt-2 text-center">
        <img
          src={heroAsset.url}
          alt="Guerreiro de kimono laranja sobre faixa vermelha"
          width={943}
          height={1697}
          className="mx-auto h-auto w-full max-w-[190px] sm:max-w-[230px]"
        />

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

        <div className="mt-3 aspect-video w-full overflow-hidden rounded-xl border border-border bg-card">
          <video
            src={videoAsset.url}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-contain"
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
              Todas as animações e filmes em 1080p dublados + entrega no E-mail.
            </p>
            <a
              href="https://ggcheckout.app/checkout/v2/eGBQp6pUBIpzkxGl5jJI"
              className="cta-glow mt-6 flex w-full items-center justify-center rounded-md bg-primary px-4 pt-4 pb-4 text-center text-sm font-extrabold uppercase leading-tight tracking-wide text-primary-foreground underline underline-offset-4 transition-transform hover:scale-[1.02] sm:text-base"
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
              Tudo do plano anterior + Coleção com 40 mangás de Dragon Ball modernas em alta
              qualidade
            </p>
            <ul className="mt-3 space-y-1.5">
              {mangas.map((m) => (
                <li key={m} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-primary">✔</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://ggcheckout.app/checkout/v2/kcadVa83rqYfqnRwH5Ve"
              className="mt-6 flex w-full items-center justify-center rounded-md bg-gold px-4 pt-4 pb-4 text-center text-sm font-extrabold uppercase leading-tight tracking-wide text-background underline underline-offset-4 transition-transform hover:scale-[1.02] sm:text-base"
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
