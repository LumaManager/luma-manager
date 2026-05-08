import type { InternalEbookLeadsResponse } from "@terapia/contracts";
import { Badge, Card, CardContent, CardHeader } from "@terapia/ui";

export function InternalEbookLeadsPage({ data }: { data: InternalEbookLeadsResponse }) {
  return (
    <div className="space-y-6 text-white">
      <section className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5 sm:rounded-[32px] sm:p-7">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="info">Ebook · CFP 09/2024</Badge>
          <Badge tone="neutral" className="bg-[rgba(255,255,255,0.12)] text-white">
            Captura de leads
          </Badge>
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
          Quem baixou o guia gratuito
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[rgba(255,255,255,0.7)]">
          Leads captados pela landing page do guia sobre a Resolução CFP 09/2024. Contém nome,
          e-mail, WhatsApp e perfil do profissional.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.05)] text-white shadow-none">
          <CardHeader>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[rgba(255,255,255,0.62)]">
              Total de leads
            </p>
            <p className="text-3xl font-semibold tracking-[-0.03em]">{data.totalEntries}</p>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-[rgba(255,255,255,0.68)]">
              Entradas únicas desde o lançamento
            </p>
          </CardContent>
        </Card>
      </section>

      <Card className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-white shadow-none">
        <CardHeader>
          <p className="text-lg font-semibold">Leads captados</p>
          <p className="text-sm text-[rgba(255,255,255,0.62)]">
            Mais recentes primeiro. Nome, contato e perfil informado no formulário.
          </p>
        </CardHeader>
        <CardContent>
          {data.items.length === 0 ? (
            <p className="py-8 text-center text-sm text-[rgba(255,255,255,0.5)]">
              Nenhum lead captado ainda.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.08)] text-left">
                    {["Nome", "E-mail", "WhatsApp", "Perfil", "Origem", "UTM", "Data"].map(
                      (col) => (
                        <th
                          key={col}
                          className="pb-3 pr-6 text-xs font-semibold uppercase tracking-[0.1em] text-[rgba(255,255,255,0.5)]"
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.06)]">
                  {data.items.map((item) => (
                    <tr key={item.id} className="hover:bg-[rgba(255,255,255,0.03)]">
                      <td className="py-3 pr-6 font-medium">{item.fullName}</td>
                      <td className="py-3 pr-6 text-[rgba(255,255,255,0.82)]">{item.email}</td>
                      <td className="py-3 pr-6 text-[rgba(255,255,255,0.82)]">{item.whatsapp}</td>
                      <td className="py-3 pr-6">
                        <Badge tone="neutral" className="bg-[rgba(255,255,255,0.1)] text-white">
                          {item.perfilLabel}
                        </Badge>
                      </td>
                      <td className="py-3 pr-6 text-xs text-[rgba(255,255,255,0.6)]">
                        {item.referrerLabel}
                        {item.sourcePath !== "/" && (
                          <span className="ml-1 text-[rgba(255,255,255,0.38)]">
                            {item.sourcePath}
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-6 text-xs text-[rgba(255,255,255,0.5)]">
                        {item.utmLabel}
                      </td>
                      <td className="py-3 text-xs text-[rgba(255,255,255,0.5)]">
                        {item.createdAtLabel}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
