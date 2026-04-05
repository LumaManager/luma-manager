import type { InternalWaitlistResponse } from "@terapia/contracts";
import { Badge, Card, CardContent, CardHeader } from "@terapia/ui";

export function InternalWaitlistPage({ data }: { data: InternalWaitlistResponse }) {
  const stats = [
    ["Entradas totais", String(data.summary.totalEntries), data.summary.updatedAtLabel],
    ["Contexto enriquecido", String(data.summary.enrichedEntries), "Leads que completaram mais do que e-mail e perfil"],
    ["Com campanha", String(data.summary.campaignEntries), "Entradas com UTM ou origem explícita"],
    ["Direto / orgânico", String(data.summary.directEntries), "Sem UTM ou vindo por fluxo direto"]
  ] as const;

  return (
    <div className="space-y-6 text-white">
      <section className="rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-7">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="warning">Waitlist</Badge>
          <Badge tone="neutral" className="bg-[rgba(255,255,255,0.12)] text-white">
            Intenção de mercado
          </Badge>
        </div>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em]">
          Quem entrou, de onde veio e o que está doendo mais
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[rgba(255,255,255,0.7)]">
          Esta fila ajuda a ler aderência real da landing. O foco aqui é origem, contexto
          opcional e principal gargalo operacional informado por cada lead.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {stats.map(([title, value, description]) => (
          <Card
            key={title}
            className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.05)] text-white shadow-none"
          >
            <CardHeader>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[rgba(255,255,255,0.62)]">
                {title}
              </p>
              <p className="text-3xl font-semibold tracking-[-0.03em]">{value}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-[rgba(255,255,255,0.68)]">{description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <SummaryNote title="Dor dominante agora" description={data.summary.topPainLabel} />
        <SummaryNote title="Origem mais frequente" description={data.summary.topSourceLabel} />
      </section>

      <Card className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-white shadow-none">
        <CardHeader>
          <p className="text-lg font-semibold">Leads mais recentes</p>
          <p className="text-sm text-[rgba(255,255,255,0.62)]">
            Captura mínima, contexto opcional e origem da entrada no mesmo lugar.
          </p>
        </CardHeader>
        <CardContent className="overflow-hidden p-0">
          <div className="grid grid-cols-[1.5fr_1.1fr_1.3fr_1.2fr_1fr] gap-4 border-b border-[rgba(255,255,255,0.08)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[rgba(255,255,255,0.5)]">
            <span>Contato</span>
            <span>Perfil</span>
            <span>Gargalo e volume</span>
            <span>Origem</span>
            <span>Atualização</span>
          </div>
          {data.items.map((item) => (
            <div
              key={`${item.email}-${item.updatedAtLabel}`}
              className="grid grid-cols-[1.5fr_1.1fr_1.3fr_1.2fr_1fr] gap-4 border-b border-[rgba(255,255,255,0.08)] px-6 py-5 text-sm text-[rgba(255,255,255,0.72)]"
            >
              <div>
                <p className="font-semibold text-white">{item.fullName}</p>
                <p className="mt-1">{item.email}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[rgba(255,255,255,0.46)]">
                  {item.contactLabel}
                </p>
              </div>
              <div>
                <p className="font-semibold text-white">{item.roleLabel}</p>
                <p className="mt-1">{item.contextStatusLabel}</p>
              </div>
              <div>
                <p>{item.biggestPainLabel}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[rgba(255,255,255,0.46)]">
                  {item.monthlySessionsLabel}
                </p>
              </div>
              <div>
                <p>{item.sourceLabel}</p>
                <p className="mt-1 text-xs text-[rgba(255,255,255,0.58)]">{item.utmLabel}</p>
                <p className="mt-1 text-xs text-[rgba(255,255,255,0.46)]">
                  {item.referrerLabel} · {item.sourcePath}
                </p>
              </div>
              <div>
                <p>{item.updatedAtLabel}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[rgba(255,255,255,0.46)]">
                  Criado {item.createdAtLabel}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryNote({ title, description }: { title: string; description: string }) {
  return (
    <Card className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.05)] text-white shadow-none">
      <CardHeader>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[rgba(255,255,255,0.62)]">
          {title}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold tracking-[-0.02em] text-white">{description}</p>
      </CardContent>
    </Card>
  );
}
