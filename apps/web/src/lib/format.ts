export function formatTimeLabel(isoValue: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(isoValue));
}

export function formatTimeRangeLabel(startIso: string, endIso: string) {
  return `${formatTimeLabel(startIso)} - ${formatTimeLabel(endIso)}`;
}

export function formatAppointmentStatus(status: string) {
  const dictionary: Record<string, string> = {
    confirmed: "Confirmada",
    waiting_room: "Waiting room",
    in_progress: "Em andamento",
    documentation_due: "Documentação pendente",
    cancelled: "Cancelada"
  };

  return dictionary[status] ?? status;
}
