"use client";

import { useState } from "react";
import type { EbookLeadRequest, EbookLeadResponse } from "@terapia/contracts";

export function EbookLandingPage() {
  const [state, setState] = useState<"form" | "success">("form");
  const [submitting, setSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [downloadToken, setDownloadToken] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload: EbookLeadRequest = {
      fullName: data.get("fullName") as string,
      email: data.get("email") as string,
      whatsapp: data.get("whatsapp") as string,
      perfil: (data.get("perfil") as EbookLeadRequest["perfil"]) ?? undefined,
      sourcePath: typeof window !== "undefined" ? window.location.pathname : "/guia-cfp-ia",
      referrerHost:
        typeof document !== "undefined" && document.referrer
          ? new URL(document.referrer).hostname
          : ""
    };

    try {
      const res = await fetch("/api/ebook-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const body = (await res.json().catch(() => null)) as EbookLeadResponse | null;
      setRegisteredEmail(payload.email);
      setDownloadToken(body?.downloadToken ?? "cfp-ia-2024");
      setState("success");
    } catch {
      // Still show success to not frustrate the user
      setRegisteredEmail(payload.email);
      setDownloadToken("cfp-ia-2024");
      setState("success");
    } finally {
      setSubmitting(false);
    }
  }

  function handleWhatsAppInput(e: React.ChangeEvent<HTMLInputElement>) {
    let v = e.target.value.replace(/\D/g, "").substring(0, 11);
    if (v.length >= 7) {
      v = `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7)}`;
    } else if (v.length >= 3) {
      v = `(${v.substring(0, 2)}) ${v.substring(2)}`;
    } else if (v.length >= 1) {
      v = `(${v}`;
    }
    e.target.value = v;
  }

  return (
    <>
      <style>{styles}</style>
      <div className="bg-glow" />
      <div className="ebook-page">
        {/* NAV */}
        <nav className="ebook-nav">
          <a href="https://lumamanager.com.br" className="nav-logo">
            LUMA
          </a>
          <span className="nav-sep">·</span>
          <div className="pill">
            <span className="pill-dot" />
            Guia gratuito
          </div>
        </nav>

        {/* MAIN */}
        <main className="ebook-main">
          <div className="hero">
            {/* LEFT */}
            <div className="left">
              <div className="left-badges">
                <div className="badge-free">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z"
                      fill="currentColor"
                    />
                  </svg>
                  100% gratuito
                </div>
                <div className="pill">Resolução CFP 09/2024</div>
              </div>

              <h1>
                A Resolução do CFP que
                <br />
                <em>Todo Psicólogo Ignora</em>
              </h1>

              <p className="subtitle">
                Desde agosto de 2024, o CFP regulamentou o uso de IA na prática psicológica. A
                maioria dos profissionais ainda não sabe — e está cometendo infrações éticas sem
                perceber.
              </p>

              <ul className="items">
                {[
                  "O que a Resolução CFP 09/2024 exige do psicólogo que usa IA",
                  "Os 3 erros que colocam seu registro em risco agora mesmo",
                  "Como seu próprio paciente pode abrir um processo contra você — gratuitamente",
                  "Penalidades reais: da multa à cassação do registro",
                  "Como usar IA com segurança e conformidade no consultório"
                ].map((text) => (
                  <li key={text}>
                    <span className="icon">
                      <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="#4CE0A4"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="2,6 5,9 10,3" />
                      </svg>
                    </span>
                    {text}
                  </li>
                ))}
              </ul>

              {/* EBOOK MOCKUP */}
              <div className="ebook-mockup">
                <div className="ebook-cover">
                  <div className="ebook-cover-dot" />
                  <div className="ebook-cover-lines">
                    <div className="ebook-cover-line long" />
                    <div className="ebook-cover-line medium" />
                    <div className="ebook-cover-line short" />
                  </div>
                </div>
                <div className="ebook-meta">
                  <div className="ebook-meta-label">Guia incluído</div>
                  <div className="ebook-meta-title">
                    A Resolução do CFP que Todo Psicólogo Ignora
                  </div>
                  <div className="ebook-stats">
                    {[
                      { n: "9", l: "páginas" },
                      { n: "7", l: "capítulos" },
                      { n: "~8min", l: "de leitura" }
                    ].map(({ n, l }) => (
                      <div key={l} className="ebook-stat">
                        <span className="ebook-stat-n">{n}</span>
                        <span className="ebook-stat-l">{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: CARD */}
            <div className="card">
              <div className="card-inner">
                {state === "form" ? (
                  <div>
                    <div className="card-badge">
                      <span>📩</span> Receba agora
                    </div>
                    <h2>Baixar o guia gratuito</h2>
                    <p className="card-desc">
                      Informe seus dados para ter acesso imediato ao guia em PDF.
                    </p>
                    <div className="step-label">Seus dados</div>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label htmlFor="fullName">Nome completo</label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          placeholder="Seu nome"
                          required
                          autoComplete="name"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="seu@email.com"
                          required
                          autoComplete="email"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="whatsapp">WhatsApp</label>
                        <input
                          type="tel"
                          id="whatsapp"
                          name="whatsapp"
                          placeholder="(11) 99999-9999"
                          required
                          autoComplete="tel"
                          onChange={handleWhatsAppInput}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="perfil">Seu perfil</label>
                        <div className="select-wrap">
                          <select id="perfil" name="perfil">
                            <option value="clinico">Psicólogo(a) clínico(a)</option>
                            <option value="organizacional">Psicólogo(a) organizacional</option>
                            <option value="escolar">Psicólogo(a) escolar</option>
                            <option value="outro">Outro</option>
                          </select>
                        </div>
                      </div>
                      <button type="submit" className="btn" disabled={submitting}>
                        {submitting ? (
                          "Enviando..."
                        ) : (
                          <>
                            Baixar guia grátis
                            <svg
                              viewBox="0 0 16 16"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M8 3v8M4 7l4 4 4-4" />
                            </svg>
                          </>
                        )}
                      </button>
                    </form>
                    <p className="card-note">Sem spam. Você pode cancelar quando quiser.</p>
                  </div>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ marginBottom: "4px" }}>
                      <div className="success-badge">
                        <svg
                          width="9"
                          height="9"
                          viewBox="0 0 10 10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="2,5 4.5,7.5 8.5,2.5" />
                        </svg>
                        Pronto!
                      </div>
                    </div>
                    <div className="success-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div className="success-title">Acesso liberado!</div>
                    <p className="success-desc">
                      Clique no botão abaixo para baixar o guia em PDF.
                    </p>
                    <div className="registered-email">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <circle cx="10" cy="10" r="8.5" />
                        <polyline
                          points="5,9 9,13 15,7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div>
                        <div className="registered-email-text">{registeredEmail}</div>
                        <div className="registered-email-sub">Cadastro confirmado</div>
                      </div>
                    </div>
                    <a
                      href={`/guia-cfp-ia.pdf?token=${downloadToken}`}
                      download="guia-resolucao-cfp-09-2024.pdf"
                      className="btn"
                      style={{ display: "inline-flex", textDecoration: "none" }}
                    >
                      Baixar o guia em PDF
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M8 3v8M4 7l4 4 4-4" />
                      </svg>
                    </a>
                    <p className="card-note" style={{ marginTop: "12px" }}>
                      O Luma Manager foi construído para cumprir cada ponto da Resolução 09/2024.
                    </p>
                    <a
                      href="https://lumamanager.com.br"
                      className="card-note"
                      style={{ display: "block", marginTop: "8px", color: "var(--check)", textDecoration: "none" }}
                    >
                      Conhecer o Luma Manager →
                    </a>
                  </div>
                )}
              </div>
              <div className="card-divider" />
              <div className="card-footer">
                <div className="card-footer-text">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="7" width="10" height="7" rx="1.5" />
                    <path d="M5.5 7V5.5a2.5 2.5 0 015 0V7" />
                  </svg>
                  Seus dados não serão compartilhados com terceiros
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="ebook-footer">
          <div className="footer-left">© 2025 Luma Manager</div>
          <div className="footer-links">
            <a href="https://lumamanager.com.br">Voltar ao site</a>
            <a href="/seguranca-e-privacidade">Política de privacidade</a>
          </div>
        </footer>
      </div>
    </>
  );
}

const styles = `
  .ebook-page *,
  .ebook-page *::before,
  .ebook-page *::after { box-sizing: border-box; }

  :root {
    --ebook-bg: #0C3737;
    --ebook-bg-deep: #082828;
    --ebook-orange: #D96933;
    --ebook-orange-hover: #C45B28;
    --ebook-orange-soft: rgba(217,105,51,0.15);
    --ebook-card-bg: #FFFFFF;
    --ebook-card-alt: #F5F3EF;
    --ebook-card-border: #E8E3DB;
    --ebook-text-on-dark: #FFFFFF;
    --ebook-text-dim: rgba(255,255,255,0.65);
    --ebook-text-dim2: rgba(255,255,255,0.38);
    --ebook-text-dark: #0C1414;
    --ebook-text-mid: #3D4A4A;
    --ebook-text-soft: #7A8A8A;
    --ebook-check: #2A8A78;
    --ebook-font: 'Plus Jakarta Sans', system-ui, sans-serif;
  }

  .bg-glow {
    position: fixed;
    top: -160px; left: 50%;
    transform: translateX(-50%);
    width: 900px; height: 500px;
    background: radial-gradient(ellipse at center, rgba(20,100,88,0.35) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  .ebook-page {
    position: relative; z-index: 1;
    min-height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr auto;
    background: linear-gradient(160deg, var(--ebook-bg) 0%, var(--ebook-bg-deep) 100%);
    font-family: var(--ebook-font);
    color: var(--ebook-text-on-dark);
    -webkit-font-smoothing: antialiased;
  }

  .ebook-nav {
    padding: 20px 40px;
    display: flex; align-items: center; gap: 10px;
    animation: ebookFadeUp 0.4s ease both;
  }

  .nav-logo {
    font-size: 13px; font-weight: 700; letter-spacing: 0.08em;
    color: var(--ebook-text-on-dark); text-decoration: none;
  }

  .nav-sep { color: var(--ebook-text-dim2); font-size: 13px; }

  .pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 12px; border-radius: 999px;
    font-size: 11.5px; font-weight: 600; letter-spacing: 0.04em;
    border: 1.5px solid rgba(255,255,255,0.18);
    color: var(--ebook-text-on-dark);
  }

  .pill-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #4CE0A4; box-shadow: 0 0 6px #4CE0A4;
    flex-shrink: 0;
  }

  .ebook-main {
    display: flex; align-items: center; justify-content: center;
    padding: 24px 40px 48px;
  }

  .hero {
    width: 100%; max-width: 1120px;
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 56px;
    align-items: start;
  }

  .left {
    padding-top: 8px;
    animation: ebookFadeUp 0.5s ease both;
  }

  .left-badges {
    display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px;
  }

  .badge-free {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 12px; border-radius: 999px;
    font-size: 11.5px; font-weight: 700; letter-spacing: 0.05em;
    background: var(--ebook-orange-soft);
    color: #F5A06A;
    border: 1.5px solid rgba(217,105,51,0.3);
  }

  .ebook-page h1 {
    font-size: clamp(32px, 4.5vw, 52px);
    font-weight: 800; line-height: 1.1; letter-spacing: -0.025em;
    color: var(--ebook-text-on-dark);
    margin-bottom: 18px; margin-top: 0;
  }

  .ebook-page h1 em {
    font-style: normal;
    color: #7DD4C0;
  }

  .subtitle {
    font-size: 16px; line-height: 1.6;
    color: var(--ebook-text-dim); max-width: 500px;
    margin-bottom: 32px;
  }

  .items { list-style: none; display: flex; flex-direction: column; gap: 14px; margin-bottom: 36px; padding: 0; }

  .items li {
    display: flex; align-items: flex-start; gap: 12px;
    font-size: 14.5px; line-height: 1.5; color: rgba(255,255,255,0.82);
  }

  .items li .icon {
    flex-shrink: 0; margin-top: 2px;
    width: 20px; height: 20px; border-radius: 50%;
    background: rgba(44,138,120,0.25);
    border: 1.5px solid rgba(44,138,120,0.5);
    display: flex; align-items: center; justify-content: center;
  }

  .items li .icon svg { width: 10px; height: 10px; }

  .ebook-mockup {
    display: flex; align-items: flex-end; gap: 16px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 14px;
    padding: 20px 24px;
    max-width: 460px;
  }

  .ebook-cover {
    width: 72px; flex-shrink: 0;
    border-radius: 6px;
    background: linear-gradient(145deg, #2F4A3F 0%, #1a3530 100%);
    border: 1px solid rgba(255,255,255,0.12);
    aspect-ratio: 3/4;
    display: flex; flex-direction: column;
    align-items: flex-start; justify-content: flex-end;
    padding: 8px;
    box-shadow: 6px 6px 20px rgba(0,0,0,0.4);
    position: relative; overflow: hidden;
  }

  .ebook-cover::before {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 40%; height: 35%;
    background: #557566;
    border-radius: 0 0 0 50%;
  }

  .ebook-cover-dot {
    position: absolute; top: 12px; right: 14px;
    width: 5px; height: 5px; border-radius: 50%;
    background: #C8634D;
  }

  .ebook-cover-lines {
    display: flex; flex-direction: column; gap: 5px; width: 100%;
  }

  .ebook-cover-line {
    height: 3px; border-radius: 2px; background: rgba(250,246,238,0.35);
  }

  .ebook-cover-line.long   { width: 90%; }
  .ebook-cover-line.medium { width: 65%; }
  .ebook-cover-line.short  { width: 42%; background: rgba(184,153,104,0.6); }

  .ebook-meta { flex: 1; }

  .ebook-meta-label {
    font-size: 11px; font-weight: 600; letter-spacing: 0.07em;
    color: var(--ebook-text-dim2); text-transform: uppercase; margin-bottom: 5px;
  }

  .ebook-meta-title {
    font-size: 13.5px; font-weight: 700; line-height: 1.4;
    color: var(--ebook-text-on-dark); margin-bottom: 10px;
  }

  .ebook-stats { display: flex; gap: 16px; }

  .ebook-stat { display: flex; flex-direction: column; gap: 1px; }

  .ebook-stat-n { font-size: 16px; font-weight: 800; color: var(--ebook-text-on-dark); }
  .ebook-stat-l { font-size: 10.5px; color: var(--ebook-text-dim2); font-weight: 500; }

  .card {
    background: var(--ebook-card-bg);
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.09), 0 24px 48px rgba(0,0,0,0.06);
    overflow: hidden;
    animation: ebookFadeUp 0.5s 0.1s ease both;
  }

  .card-inner { padding: 32px 32px 28px; }

  .card-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 999px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.05em;
    background: rgba(217,105,51,0.12);
    color: var(--ebook-orange);
    border: 1.5px solid rgba(217,105,51,0.22);
    margin-bottom: 16px;
  }

  .card h2 {
    font-size: 22px; font-weight: 800; letter-spacing: -0.02em;
    color: var(--ebook-text-dark); line-height: 1.25; margin-bottom: 8px; margin-top: 0;
  }

  .card-desc {
    font-size: 13.5px; line-height: 1.55; color: var(--ebook-text-soft);
    margin-bottom: 22px;
  }

  .step-label {
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.07em;
    color: var(--ebook-orange); text-transform: uppercase; margin-bottom: 16px;
  }

  .form-group { margin-bottom: 14px; }

  .form-group label {
    display: block; font-size: 12.5px; font-weight: 600;
    color: var(--ebook-text-mid); margin-bottom: 6px;
  }

  .form-group input,
  .form-group select {
    width: 100%; padding: 11px 14px;
    border: 1.5px solid var(--ebook-card-border);
    border-radius: 8px;
    font-family: var(--ebook-font); font-size: 14px;
    color: var(--ebook-text-dark); background: white;
    outline: none; transition: border-color 0.15s, box-shadow 0.15s;
    appearance: none; -webkit-appearance: none;
  }

  .form-group input::placeholder { color: #B0BEBE; }

  .form-group input:focus,
  .form-group select:focus {
    border-color: var(--ebook-check);
    box-shadow: 0 0 0 3px rgba(44,138,120,0.1);
  }

  .select-wrap { position: relative; }
  .select-wrap::after {
    content: '';
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    width: 0; height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid var(--ebook-text-soft);
    pointer-events: none;
  }

  .btn {
    width: 100%; padding: 14px 20px;
    background: var(--ebook-orange); color: white;
    border: none; border-radius: 8px;
    font-family: var(--ebook-font); font-size: 14.5px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center;
    justify-content: center; gap: 8px;
    transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
    letter-spacing: 0.01em;
    box-shadow: 0 2px 8px rgba(217,105,51,0.28);
  }

  .btn:hover { background: var(--ebook-orange-hover); box-shadow: 0 4px 14px rgba(217,105,51,0.38); }
  .btn:active { transform: scale(0.985); }
  .btn:disabled { opacity: 0.7; cursor: not-allowed; }
  .btn svg { width: 16px; height: 16px; flex-shrink: 0; }

  .card-note {
    font-size: 11.5px; color: var(--ebook-text-soft);
    line-height: 1.5; margin-top: 12px; text-align: center;
  }

  .card-divider { height: 1px; background: var(--ebook-card-border); }

  .card-footer {
    padding: 14px 32px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    background: var(--ebook-card-alt);
  }

  .card-footer-text {
    font-size: 11px; color: var(--ebook-text-soft);
    display: flex; align-items: center; gap: 5px;
  }

  .success-icon {
    width: 48px; height: 48px; border-radius: 50%;
    background: rgba(44,138,120,0.12);
    border: 2px solid rgba(44,138,120,0.3);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
  }

  .success-icon svg { width: 22px; height: 22px; color: var(--ebook-check); }

  .success-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 999px;
    font-size: 11px; font-weight: 700;
    background: rgba(44,138,120,0.1);
    color: var(--ebook-check);
    border: 1.5px solid rgba(44,138,120,0.25);
    margin-bottom: 14px;
  }

  .success-title {
    font-size: 20px; font-weight: 800; letter-spacing: -0.02em;
    color: var(--ebook-text-dark); line-height: 1.25; margin-bottom: 8px;
  }

  .success-desc {
    font-size: 13.5px; line-height: 1.55; color: var(--ebook-text-soft);
    margin-bottom: 20px;
  }

  .registered-email {
    background: var(--ebook-card-alt); border: 1px solid var(--ebook-card-border);
    border-radius: 8px;
    padding: 10px 14px; margin-bottom: 20px;
    display: flex; align-items: center; gap: 10px; text-align: left;
  }

  .registered-email svg { flex-shrink: 0; color: var(--ebook-check); }

  .registered-email-text { font-size: 13px; font-weight: 600; color: var(--ebook-text-dark); }
  .registered-email-sub { font-size: 11.5px; color: var(--ebook-text-soft); }

  .ebook-footer {
    padding: 20px 40px;
    display: flex; align-items: center; justify-content: space-between;
    border-top: 1px solid rgba(255,255,255,0.07);
  }

  .footer-left { font-size: 12px; color: var(--ebook-text-dim2); }
  .footer-links { display: flex; gap: 20px; }
  .footer-links a {
    font-size: 12px; color: var(--ebook-text-dim2);
    text-decoration: none; transition: color 0.15s;
  }
  .footer-links a:hover { color: var(--ebook-text-dim); }

  @keyframes ebookFadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 860px) {
    .hero { grid-template-columns: 1fr; gap: 32px; }
    .ebook-main { padding: 20px 20px 40px; }
    .ebook-nav { padding: 16px 20px; }
    .ebook-footer { padding: 16px 20px; flex-direction: column; gap: 10px; align-items: flex-start; }
    .ebook-page h1 { font-size: 34px; }
    .ebook-mockup { max-width: 100%; }
  }
`;
