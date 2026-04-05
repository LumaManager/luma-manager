import { ArrowRight } from "lucide-react";

import { Badge, Card, CardContent, CardHeader } from "@terapia/ui";

type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PlaceholderPage({ description, eyebrow, title }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <Badge tone="info">{eyebrow}</Badge>
        <h1 className="mt-4 text-3xl font-semibold">{title}</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-muted)]">
          {description}
        </p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <p className="text-lg font-semibold">Estrutura pronta para a próxima fatia</p>
          <p className="text-sm leading-6 text-[var(--color-text-muted)]">
            O shell, os contratos e as rotas já estão no lugar para receber dados reais sem
            refazer a fundação.
          </p>
        </CardHeader>
        <CardContent>
          <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.04)] px-4 py-3 text-sm font-medium text-[var(--color-primary)]">
            A tela atual é propositalmente enxuta nesta sessão
            <ArrowRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
