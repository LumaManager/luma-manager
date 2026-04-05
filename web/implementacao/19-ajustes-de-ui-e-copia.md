# Ajustes de UI e Cópia

## Objetivo

Registrar decisões de refinamento visual e textual que passaram a ser regra de produto, não apenas correção local.

## Decisões atuais

### 1. Cópia visível em português deve usar acentuação correta

- textos de navegação, CTAs, estados, descrições e headers devem ser escritos em português com acentuação correta
- a preferência por ASCII continua válida para nomes técnicos internos, ids, código e estruturas de arquivo
- a camada de interface não deve sacrificar legibilidade por conveniência de implementação

### 2. Sidebar do terapeuta deve caber em notebook comum sem depender de scroll imediato

- o shell deve priorizar densidade suficiente para exibir card superior, navegação principal e card resumido de perfil em viewport comum de notebook
- scroll interno continua permitido como fallback, mas não deve ser o comportamento dominante no primeiro contato
- para atingir isso, reduzir padding, resumir microcópia e evitar pills redundantes no topo

### 3. Agenda deve priorizar legibilidade operacional sobre “canvas amplo”

- a grade semanal não pode depender de uma largura mínima agressiva quando existe rail lateral ativa
- em larguras típicas de notebook, a rail lateral deve perder prioridade antes da grade principal
- a percepção principal da agenda deve ser `escaneável`, não “vazia” ou “espalhada”
- blocos de sessão devem ser mais compactos e a malha temporal deve reduzir o excesso de espaço morto

## Direção prática

- continuar refinando primeiro as superfícies mais frequentes: shell, dashboard, pacientes, agenda e login
- tratar contraste, acentuação, alinhamento e densidade como parte do core web, não acabamento tardio
