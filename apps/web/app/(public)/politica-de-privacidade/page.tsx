import type { Metadata } from "next";

import { PublicPageShell } from "@/components/marketing/public-page-shell";

export const metadata: Metadata = {
  title: "Política de Privacidade | Luma Manager",
  description:
    "Como a Luma Manager trata dados pessoais de terapeutas, pacientes e visitantes, em conformidade com a LGPD.",
  alternates: {
    canonical: "/politica-de-privacidade"
  },
  robots: { index: true, follow: true }
};

export default function PoliticaDePrivacidadePage() {
  return (
    <PublicPageShell primaryHref="/cadastro" secondaryHref="/seguranca-e-privacidade">
      <div className="mx-auto max-w-3xl px-6 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-10 border-b border-[var(--color-border)] pb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
            Luma Manager
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-text)] lg:text-5xl">
            Política de Privacidade
          </h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--color-text-muted)]">
            <span>Versão 1.0</span>
            <span>·</span>
            <span>Vigente desde 17 de maio de 2026</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none text-[var(--color-text)] [&_a]:text-[var(--color-primary)] [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[var(--color-text)] [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_li]:mb-1 [&_p]:mb-4 [&_p]:leading-7 [&_p]:text-[var(--color-text-secondary)] [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_td]:border [&_td]:border-[var(--color-border)] [&_td]:px-3 [&_td]:py-2 [&_td]:align-top [&_td]:text-[var(--color-text-secondary)] [&_th]:border [&_th]:border-[var(--color-border)] [&_th]:bg-[var(--color-surface)] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-medium [&_th]:text-[var(--color-text)] [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5">

          <h2>1. Quem somos</h2>
          <p>
            <strong>GABRIEL DE OLIVEIRA FROZI - ME</strong>, CNPJ{" "}
            <strong>[inserir CNPJ]</strong>, com sede em Mogi das Cruzes/SP, atuando
            comercialmente sob o nome fantasia <strong>Luma Manager</strong> ("Luma", "nós"), é a
            mantenedora da plataforma Luma — um software de gestão de prática clínica para
            psicólogos autônomos.
          </p>
          <p>
            A Luma opera como <strong>agente de tratamento de pequeno porte</strong> nos termos da
            Resolução CD/ANPD nº 2/2022, o que não afasta as obrigações aplicáveis a dados
            pessoais sensíveis de saúde.
          </p>
          <p>
            Esta Política de Privacidade explica como tratamos dados pessoais no contexto da
            plataforma e está alinhada à <strong>Lei Geral de Proteção de Dados — Lei nº 13.709/2018
            (LGPD)</strong>, ao <strong>Código de Ética do Psicólogo (Resolução CFP nº 10/2005)</strong>,
            à <strong>Resolução CFP nº 9/2024</strong> (telepsicologia) e às regulamentações da{" "}
            <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong>.
          </p>

          <h2>2. A quem esta política se aplica</h2>
          <p>Esta política se aplica a três grupos de titulares:</p>
          <ul>
            <li>
              <strong>Terapeutas</strong> — profissionais de psicologia que contratam a Luma para
              gerir sua prática clínica.
            </li>
            <li>
              <strong>Pacientes</strong> — pessoas atendidas por esses terapeutas e cujos dados
              circulam pela plataforma em razão do atendimento.
            </li>
            <li>
              <strong>Visitantes</strong> do site e demais interessados.
            </li>
          </ul>

          <h2>3. Papéis LGPD — controlador e operador</h2>
          <p>A cadeia de tratamento de dados varia conforme o fluxo. Em linhas gerais:</p>
          <ul>
            <li>
              Para <strong>dados clínicos do paciente</strong> (prontuário, anotações, áudio,
              transcrição, rascunho de IA): o <strong>psicólogo é o controlador</strong> (decide
              finalidade e meio, responsável pelo sigilo profissional) e a{" "}
              <strong>Luma é operadora</strong> (trata os dados em nome do psicólogo, seguindo suas
              instruções).
            </li>
            <li>
              Para <strong>dados operacionais da plataforma</strong> (cadastro do terapeuta, login,
              cobrança da assinatura, analytics, segurança): a{" "}
              <strong>Luma é controladora independente</strong>.
            </li>
            <li>
              Para <strong>dados de cadastro inicial do paciente</strong> (nome, email, telefone
              antes do aceite): controladoria compartilhada até o paciente aceitar o convite,
              passando então ao psicólogo.
            </li>
          </ul>
          <p>
            Essa separação protege o sigilo profissional do psicólogo (art. 9º do Código de Ética)
            e mantém a responsabilidade clínica onde deve estar.
          </p>

          <h2>4. Que dados tratamos, para quê e com qual base legal</h2>

          <h3>4.1 Dados do terapeuta</h3>
          <table>
            <thead>
              <tr>
                <th>Dado</th>
                <th>Finalidade</th>
                <th>Base legal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Nome, CPF, CRP, email, telefone</td>
                <td>Cadastro, identificação, comunicação contratual</td>
                <td>Art. 7º, V LGPD (execução de contrato)</td>
              </tr>
              <tr>
                <td>Credenciais, MFA, IP, user agent</td>
                <td>Autenticação e segurança da conta</td>
                <td>Art. 7º, V + art. 11, II, g LGPD</td>
              </tr>
              <tr>
                <td>Dados financeiros, valor, método</td>
                <td>Cobrança da assinatura da plataforma</td>
                <td>Art. 7º, V + art. 7º, II (obrigação fiscal)</td>
              </tr>
              <tr>
                <td>Interações com suporte</td>
                <td>Atendimento ao cliente</td>
                <td>Art. 7º, V LGPD</td>
              </tr>
              <tr>
                <td>Uso do produto (eventos, telas)</td>
                <td>Melhoria do produto</td>
                <td>Art. 7º, IX LGPD (legítimo interesse)</td>
              </tr>
            </tbody>
          </table>

          <h3>4.2 Dados do paciente</h3>
          <table>
            <thead>
              <tr>
                <th>Dado</th>
                <th>Finalidade</th>
                <th>Base legal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Nome, email, telefone</td>
                <td>Contato para agendamento</td>
                <td>Art. 7º, V LGPD (execução de contrato com o psicólogo)</td>
              </tr>
              <tr>
                <td>Prontuário, anotação clínica</td>
                <td>Documentação do atendimento psicológico</td>
                <td>Art. 11, II, a LGPD (tutela da saúde por profissional de saúde)</td>
              </tr>
              <tr>
                <td>Áudio da sessão (quando ativado)</td>
                <td>Geração de transcrição descartável para rascunho de prontuário</td>
                <td>Art. 11, I LGPD (consentimento destacado) + art. 11, II, a</td>
              </tr>
              <tr>
                <td>Transcrição temporária</td>
                <td>Base para rascunho de prontuário — descartada após geração</td>
                <td>Art. 11, I + art. 11, II, a LGPD</td>
              </tr>
              <tr>
                <td>Rascunho gerado por IA</td>
                <td>Apoio à escrita do prontuário, com revisão humana obrigatória</td>
                <td>Art. 11, II, a LGPD + consentimento específico para IA</td>
              </tr>
              <tr>
                <td>Dados de pagamento (portal do paciente)</td>
                <td>Cobrança da sessão</td>
                <td>Art. 7º, V + art. 7º, II LGPD</td>
              </tr>
              <tr>
                <td>Logs de acesso</td>
                <td>Segurança e obrigação legal</td>
                <td>Art. 7º, II LGPD (Marco Civil, art. 15) + art. 11, II, g</td>
              </tr>
            </tbody>
          </table>

          <h3>4.3 Dados do visitante do site</h3>
          <table>
            <thead>
              <tr>
                <th>Dado</th>
                <th>Finalidade</th>
                <th>Base legal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cookies essenciais</td>
                <td>Funcionamento do site</td>
                <td>Art. 7º, V LGPD</td>
              </tr>
              <tr>
                <td>Cookies analíticos</td>
                <td>Melhorar o site</td>
                <td>Art. 7º, IX LGPD, com opt-in no banner</td>
              </tr>
              <tr>
                <td>Dados de formulário de contato</td>
                <td>Responder contato</td>
                <td>Art. 7º, V LGPD</td>
              </tr>
            </tbody>
          </table>

          <h2>5. Consentimento específico para dado sensível</h2>
          <p>
            Para gravação de áudio, transcrição e uso de IA, obtemos{" "}
            <strong>consentimento destacado e específico</strong> (art. 11, I LGPD), separado do
            aceite geral dos termos. O consentimento pode ser revogado a qualquer tempo (art. 8º,
            §5º LGPD) com efeitos imediatos.
          </p>

          <h2>6. Tempo de guarda</h2>
          <table>
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Prazo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Prontuário clínico</td>
                <td>5 anos após a última sessão (Resolução CFP nº 6/2019)</td>
              </tr>
              <tr>
                <td>Áudio bruto da sessão</td>
                <td>Descartado após geração da transcrição (horas)</td>
              </tr>
              <tr>
                <td>Transcrição temporária</td>
                <td>Descartada após geração do rascunho pela IA (horas)</td>
              </tr>
              <tr>
                <td>Rascunho de IA não aprovado</td>
                <td>30 dias ou até decisão do terapeuta, o que ocorrer primeiro</td>
              </tr>
              <tr>
                <td>Dados de cobrança</td>
                <td>5 anos após o fato gerador (prescrição fiscal e civil)</td>
              </tr>
              <tr>
                <td>Logs de conexão</td>
                <td>6 meses (Marco Civil da Internet, art. 13)</td>
              </tr>
              <tr>
                <td>Logs de acesso à aplicação</td>
                <td>6 meses (Marco Civil, art. 15)</td>
              </tr>
              <tr>
                <td>Dados de conta encerrada</td>
                <td>Excluídos em até 30 dias, ressalvada obrigação legal</td>
              </tr>
            </tbody>
          </table>

          <h2>7. Com quem compartilhamos dados</h2>
          <p>
            Compartilhamos dados apenas com sub-operadores necessários à operação do serviço, sob
            contrato com cláusulas de confidencialidade, segurança, proibição de uso para treino
            próprio e notificação de incidentes.
          </p>

          <h3>Sub-operadores atuais</h3>
          <table>
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Fornecedor</th>
                <th>País</th>
                <th>Finalidade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hospedagem da aplicação</td>
                <td>Railway</td>
                <td>EUA</td>
                <td>Infraestrutura de aplicação</td>
              </tr>
              <tr>
                <td>Banco de dados</td>
                <td>PostgreSQL (Railway)</td>
                <td>EUA</td>
                <td>Persistência dos dados com criptografia em repouso</td>
              </tr>
              <tr>
                <td>Email transacional</td>
                <td>Resend</td>
                <td>EUA</td>
                <td>Notificações e confirmações (sem conteúdo clínico)</td>
              </tr>
              <tr>
                <td>Analytics</td>
                <td>Google Analytics 4</td>
                <td>EUA</td>
                <td>Métricas agregadas de uso (sem conteúdo clínico)</td>
              </tr>
              <tr>
                <td>Monitoramento de erro</td>
                <td>Sentry</td>
                <td>EUA</td>
                <td>Diagnóstico de bugs, com filtro de PII habilitado</td>
              </tr>
              <tr>
                <td>Videoconferência</td>
                <td>Daily.co</td>
                <td>EUA</td>
                <td>Sessão de teleatendimento; áudio descartado após transcrição</td>
              </tr>
              <tr>
                <td>Transcrição (quando ativado)</td>
                <td>AssemblyAI</td>
                <td>EUA</td>
                <td>Transcrição temporária com diarização — zero retention contratual</td>
              </tr>
              <tr>
                <td>IA generativa (quando ativado)</td>
                <td>Anthropic (Claude)</td>
                <td>EUA</td>
                <td>Rascunho de prontuário — zero retention + opt-out de treino contratual</td>
              </tr>
            </tbody>
          </table>

          <p>
            Todos os sub-operadores fora do Brasil operam sob{" "}
            <strong>Cláusulas Padrão Contratuais (SCC)</strong> conforme Resolução CD/ANPD nº
            19/2024.
          </p>

          <h3>Autoridades e terceiros</h3>
          <p>
            Poderemos compartilhar dados com autoridades mediante ordem judicial, requisição
            legítima de autoridade competente, ou em defesa de direitos da plataforma, sempre no
            estrito limite da solicitação (art. 7º, VI e art. 11, II, e LGPD).
          </p>

          <h2>8. Transferência internacional</h2>
          <p>
            Alguns sub-operadores (transcrição, LLM, email) estão fora do Brasil. Adotamos as{" "}
            <strong>Cláusulas Padrão Contratuais da ANPD</strong> (Resolução CD/ANPD nº 19/2024) e
            selecionamos fornecedores que oferecem opt-out de treino de modelo e não-retenção do
            conteúdo clínico além do estritamente necessário.
          </p>

          <h2>9. Segurança da informação</h2>
          <p>Aplicamos medidas técnicas e organizacionais proporcionais ao risco:</p>
          <ul>
            <li>Criptografia em trânsito (TLS) e em repouso</li>
            <li>Segregação de ambientes (produção, homologação, desenvolvimento)</li>
            <li>Controle de acesso por função (princípio do menor privilégio)</li>
            <li>MFA obrigatório para acesso administrativo e recomendado para terapeutas</li>
            <li>Trilha auditável de acesso a conteúdo clínico</li>
            <li>Testes de vulnerabilidade periódicos</li>
            <li>Plano de resposta a incidentes com prazo de comunicação à ANPD e ao titular</li>
          </ul>

          <h2>10. Direitos do titular (art. 18 LGPD)</h2>
          <p>Você pode a qualquer tempo solicitar:</p>
          <ul>
            <li>confirmação da existência de tratamento</li>
            <li>acesso aos dados</li>
            <li>correção de dados incompletos, inexatos ou desatualizados</li>
            <li>anonimização, bloqueio ou eliminação de dados excessivos</li>
            <li>portabilidade para outro fornecedor</li>
            <li>eliminação dos dados tratados com consentimento</li>
            <li>informação sobre entidades com que compartilhamos dados</li>
            <li>informação sobre a possibilidade de não consentir</li>
            <li>revogação do consentimento</li>
            <li>revisão humana de decisões automatizadas (art. 20 LGPD)</li>
          </ul>
          <p>
            Dirigir solicitações a{" "}
            <a href="mailto:dpo@lumamanager.com.br">dpo@lumamanager.com.br</a>. Respondemos em até{" "}
            <strong>15 dias</strong>, prazo prorrogável uma vez por igual período mediante
            justificativa.
          </p>
          <p>
            <strong>Observação sobre dados clínicos:</strong> para acessar ou eliminar dados que
            compõem o prontuário, a solicitação deve ser dirigida ao psicólogo controlador, pois o
            sigilo profissional pertence à relação clínica. A Luma apoia operacionalmente esse
            atendimento, mas não decide sozinha sobre prontuário alheio.
          </p>

          <h2>11. Menores de idade</h2>
          <p>
            A Luma <strong>não está habilitada para atendimento a menores de 18 anos no momento</strong>.
            Terapeutas que atendem crianças e adolescentes não devem cadastrar esses pacientes na
            plataforma até que uma versão específica seja lançada, com fluxo dedicado ao
            consentimento do responsável legal nos termos do art. 14 LGPD e do ECA.
          </p>

          <h2>12. Inteligência artificial</h2>
          <p>
            Quando o recurso de rascunho automatizado estiver ativado, um modelo de IA processa
            uma transcrição da sessão para sugerir tópicos e organização do texto. Neste caso:
          </p>
          <ul>
            <li>o paciente precisa ter consentido especificamente para este uso</li>
            <li>o áudio e a transcrição são descartados após a geração do rascunho</li>
            <li>
              o rascunho nunca vira prontuário sem <strong>revisão e aprovação humana</strong> do
              psicólogo
            </li>
            <li>
              o conteúdo clínico <strong>não é usado</strong> para treinar modelos da Luma ou do
              fornecedor de IA (cláusula contratual de não-treino)
            </li>
            <li>
              a IA <strong>não emite diagnóstico</strong> nem sugere CID — vedado pelo Código de
              Ética e pela Resolução CFP nº 9/2024
            </li>
          </ul>

          <h2>13. Encarregado (DPO)</h2>
          <p>
            <strong>Nome:</strong> Gabriel de Oliveira Frozi
            <br />
            <strong>Email:</strong>{" "}
            <a href="mailto:dpo@lumamanager.com.br">dpo@lumamanager.com.br</a>
          </p>
          <p>
            O Encarregado é o próprio sócio da Luma, nos termos do art. 2º, §4º da Resolução
            CD/ANPD nº 18/2024, que permite essa acumulação em agentes de pequeno porte.
          </p>

          <h2>14. Alterações desta política</h2>
          <p>
            Podemos atualizar esta política para refletir mudanças legais, regulatórias ou
            operacionais. Sempre que houver alteração material, avisaremos com 30 dias de
            antecedência por email e destacaremos a mudança no site.
          </p>

          <h2>15. Foro</h2>
          <p>
            Esta política é regida pela lei brasileira, com foro na comarca de Mogi das Cruzes/SP,
            ressalvada a escolha de foro do domicílio do titular consumidor quando aplicável.
          </p>

          <h2>Histórico de versões</h2>
          <table>
            <thead>
              <tr>
                <th>Versão</th>
                <th>Data</th>
                <th>Alteração</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1.0</td>
                <td>17 de maio de 2026</td>
                <td>Versão inicial</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer note */}
        <div className="mt-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-5 text-sm text-[var(--color-text-muted)]">
          <p>
            Dúvidas sobre esta política? Entre em contato com nosso Encarregado de Dados em{" "}
            <a
              href="mailto:dpo@lumamanager.com.br"
              className="font-medium text-[var(--color-primary)]"
            >
              dpo@lumamanager.com.br
            </a>
            .
          </p>
        </div>
      </div>
    </PublicPageShell>
  );
}
