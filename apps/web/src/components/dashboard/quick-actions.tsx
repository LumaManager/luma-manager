import { ArrowRight, Calendar, CalendarPlus2, ClipboardList, UserPlus2, Wallet } from "lucide-react";
import type { TherapistDashboard } from "@terapia/contracts";

import { Card, CardContent, CardHeader, cn } from "@terapia/ui";

const iconMap = {
  calendar: Calendar,
  "calendar-plus": CalendarPlus2,
  "clipboard-list": ClipboardList,
  "user-plus": UserPlus2,
  wallet: Wallet
} as const;

type QuickActionsProps = {
  actions: TherapistDashboard["quickActions"];
};

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Ações rápidas</h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Um clique para as rotas mais importantes desta etapa do produto.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        {actions.map((action) => {
          const Icon = iconMap[action.icon];
          const isPrimary = action.emphasis === "primary";

          return (
            <a href={action.href} key={action.id}>
              <Card
                className={cn(
                  "h-full transition hover:-translate-y-0.5",
                  isPrimary
                    ? "border-transparent bg-[linear-gradient(135deg,rgba(15,76,92,0.96),rgba(9,53,65,0.96))] text-white"
                    : "bg-white"
                )}
              >
                <CardHeader className="pb-3">
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-2xl",
                      isPrimary ? "bg-white/12 text-white" : "bg-[rgba(15,76,92,0.10)] text-[var(--color-primary)]"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-base font-semibold">{action.label}</p>
                    <p
                      className={cn(
                        "mt-2 text-sm leading-6",
                        isPrimary ? "text-white/78" : "text-[var(--color-text-muted)]"
                      )}
                    >
                      {action.description}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 text-sm font-semibold",
                      isPrimary ? "text-white" : "text-[var(--color-primary)]"
                    )}
                  >
                    Abrir fluxo
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>
    </section>
  );
}
