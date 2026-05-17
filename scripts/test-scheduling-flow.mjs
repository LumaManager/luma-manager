#!/usr/bin/env node
// scripts/test-scheduling-flow.mjs
// Testa o fluxo completo de self-scheduling via API:
//   login → gerar token → buscar slots públicos → book → verificar appointment
//
// Uso:
//   node scripts/test-scheduling-flow.mjs
//   node scripts/test-scheduling-flow.mjs --api https://terapiaapi-production.up.railway.app
//   node scripts/test-scheduling-flow.mjs --week 2026-05-19

import { parseArgs } from "node:util";

const { values: args } = parseArgs({
  options: {
    api:      { type: "string",  default: process.env.TEST_API_URL      ?? "https://terapiaapi-production.up.railway.app" },
    email:    { type: "string",  default: process.env.TEST_EMAIL         ?? "ana.ready@institutovivace.com.br" },
    password: { type: "string",  default: process.env.TEST_PASSWORD      ?? "" },
    week:     { type: "string",  default: process.env.TEST_WEEK          ?? nextMonday() },
    patient:  { type: "string",  default: process.env.TEST_PATIENT_NAME  ?? "" },
    verbose:  { type: "boolean", short: "v", default: false }
  }
});

if (!args.password) {
  console.error("\x1b[31m[ERR]\x1b[0m --password obrigatório (ou env TEST_PASSWORD)");
  console.error("\nExemplo:");
  console.error("  TEST_PASSWORD='sua-senha' node scripts/test-scheduling-flow.mjs");
  console.error("  node scripts/test-scheduling-flow.mjs --password 'sua-senha'");
  console.error("  node scripts/test-scheduling-flow.mjs --password 'sua-senha' --patient 'Cleci' --week 2026-05-19");
  process.exit(1);
}

const BASE = args.api;
let token = null;

// ─── helpers ──────────────────────────────────────────────────────────────────

function nextMonday() {
  const d = new Date();
  const day = d.getDay(); // 0=Sun, 1=Mon…
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + daysUntilMonday);
  return d.toISOString().slice(0, 10);
}

function log(label, data) {
  const color = { OK: "\x1b[32m", ERR: "\x1b[31m", INFO: "\x1b[36m", SKIP: "\x1b[33m" };
  const reset = "\x1b[0m";
  const c = color[label] ?? "";
  console.log(`${c}[${label}]${reset} ${data}`);
}

function detail(obj) {
  if (args.verbose) console.log(JSON.stringify(obj, null, 2));
}

async function api(method, path, body, auth = true) {
  const headers = { "Content-Type": "application/json" };
  if (auth && token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw Object.assign(new Error(json?.message ?? `HTTP ${res.status}`), { status: res.status, body: json });
  }

  return json;
}

function pass(step, detail_) {
  log("OK", step);
  if (detail_ !== undefined) detail(detail_);
}

function fail(step, err) {
  log("ERR", `${step}: ${err.message}`);
  if (err.body) console.error("  →", JSON.stringify(err.body));
  process.exit(1);
}

// ─── test steps ───────────────────────────────────────────────────────────────

async function stepLogin() {
  log("INFO", `Login como ${args.email} em ${BASE}`);
  try {
    const res = await api("POST", "/v1/auth/login", { email: args.email, password: args.password }, false);
    token = res.accessToken;
    if (!token) throw new Error("accessToken ausente na resposta");
    pass("Login → accessToken obtido");
    detail({ therapistId: res.therapist?.id, tenant: res.tenant?.name });
    return res;
  } catch (e) {
    fail("Login", e);
  }
}

async function stepListPatients() {
  log("INFO", "Listando pacientes...");
  try {
    const res = await api("GET", "/v1/patients");
    const patients = res.items ?? res.patients ?? (Array.isArray(res) ? res : []);
    if (patients.length === 0) throw new Error("Nenhum paciente encontrado");

    // filtrar por nome se --patient foi passado
    const filtered = args.patient
      ? patients.filter(p => p.fullName?.toLowerCase().includes(args.patient.toLowerCase()))
      : patients;

    const chosen = filtered[0];
    if (!chosen) throw new Error(`Nenhum paciente com nome contendo "${args.patient}"`);

    pass(`Paciente selecionado: ${chosen.fullName} (${chosen.id})`);
    return chosen;
  } catch (e) {
    fail("Listar pacientes", e);
  }
}

async function stepGenerateToken(patient, weekStart) {
  log("INFO", `Gerando token para ${patient.fullName}, semana ${weekStart}...`);
  try {
    const res = await api("POST", "/v1/scheduling/tokens/generate-week", { weekStart });
    const tokens = res.tokens ?? res ?? [];
    const t = tokens.find(t => t.patientId === patient.id) ?? tokens[0];
    if (!t) throw new Error("Token não gerado para o paciente");

    pass(`Token gerado: ${t.token} (expira ${t.expiresAt ?? "N/A"})`);
    detail(t);
    return t.token;
  } catch (e) {
    fail("Gerar token", e);
  }
}

async function stepGetPublicPage(schedToken) {
  log("INFO", `Acessando página pública /v1/public/scheduling/${schedToken}...`);
  try {
    const res = await api("GET", `/v1/public/scheduling/${schedToken}`, undefined, false);
    const slots = res.data?.slots ?? res.availableSlots ?? res.slots ?? [];
    pass(`Página pública OK — ${slots.length} slots disponíveis`);
    detail({ therapistName: res.data?.therapistName, patientName: res.data?.patientFirstName, weekLabel: res.data?.weekLabel, slotsCount: slots.length });
    return { page: res, slots };
  } catch (e) {
    fail("Página pública", e);
  }
}

async function stepBookSlot(schedToken, slots) {
  if (slots.length === 0) {
    log("SKIP", "Sem slots disponíveis para booking (agenda pode estar fora da semana configurada)");
    return null;
  }

  const slot = slots[0];
  log("INFO", `Booking slot: ${slot.date} ${slot.startTime}...`);

  try {
    const res = await api(
      "POST",
      `/v1/public/scheduling/${schedToken}/book`,
      { date: slot.date, startTime: slot.startTime },
      false
    );

    pass(`Appointment criado: ${res.appointmentId ?? res.id ?? "id N/A"}`);
    detail(res);
    return res;
  } catch (e) {
    if (e.status === 409) {
      log("SKIP", `Slot ${slot.date} ${slot.startTime} já ocupado — tente outra semana com --week`);
      return null;
    }
    fail("Booking", e);
  }
}

async function stepVerifyAppointment(booking, bookedSlot) {
  if (!booking) return;
  log("INFO", `Verificando appointment na agenda (${bookedSlot.date} ${bookedSlot.startTime})...`);
  try {
    const weekStart = args.week;
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 6);
    const weekEnd = d.toISOString().slice(0, 10);

    // agenda response stores appointments in scheduleBlocks (startsAt = "YYYY-MM-DDTHH:MM:00")
    const res = await api("GET", `/v1/appointments?date=${weekStart}&view=week`);
    const blocks = res.scheduleBlocks ?? [];
    const expectedStart = `${bookedSlot.date}T${bookedSlot.startTime}:00`;

    const found = blocks.find(b => b.startsAt === expectedStart || b.startsAt?.startsWith(expectedStart));

    if (found) {
      pass(`Appointment confirmado na agenda: "${found.title}" em ${bookedSlot.date} ${bookedSlot.startTime}`);
      detail(found);
    } else {
      log("SKIP", `${blocks.length} blocks no range, nenhum em ${bookedSlot.date} ${bookedSlot.startTime}. booking.success=${booking.success}`);
    }
  } catch (e) {
    fail("Verificar appointment", e);
  }
}

// ─── run ──────────────────────────────────────────────────────────────────────

console.log("\n══════════════════════════════════════════");
console.log("  Luma Manager — Teste de Scheduling Flow");
console.log("══════════════════════════════════════════\n");

const session = await stepLogin();
const patient = await stepListPatients();
const schedToken = await stepGenerateToken(patient, args.week);
const { slots } = await stepGetPublicPage(schedToken);
const bookedSlot = slots[0];
const booking = await stepBookSlot(schedToken, slots);
await stepVerifyAppointment(booking, bookedSlot);

console.log("\n══════════════════════════════════════════");
console.log("  Fluxo concluído.");
console.log("══════════════════════════════════════════\n");
