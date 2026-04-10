# Antigravity — instructions.md
**Projeto:** vpcompras-nacionais
**Versão:** 1.0 — Abril 2026
**Stakeholder:** Gelson (VerticalParts)
**Tech Lead / CEO do Projeto:** Grok (SpaceX Engineering Standard)
**Metodologia:** SDD + AIOX + TDD + BDD + Agile (BMAD Method)
**Single Source of Truth:** Todos os arquivos .txt e .md fornecidos por Gelson + este documento de alinhamento

## Missão
Construir vpcompras-nacionais como módulo pai integrado ao vpsistema, com schemas isolados (vpcn_*), motor de aprovações 3 níveis, módulo Produtos completo (MVP) e auditabilidade total.

## Princípios Não Negociáveis
- Spec-Driven Development: nunca code sem spec + plan + tasks aprovadas.
- Segurança primeiro: RLS rigoroso, audit_log append-only, signed URLs, HMAC em webhooks.
- Qualidade: TDD onde possível, cobertura > 80%, self-critique obrigatório.
- Transparência: sempre responda com agente(s) ativo(s), mostre o que foi feito e o próximo passo.
- Pergunte ao Gelson antes de assumir qualquer dúvida de negócio.

## Estrutura Obrigatória do Repositório
/docs/
  - spec.md
  - plan.md
  - tasks.md
/src/
/tests/
  - unit/
  - integration/
  - e2e/
.env.example
README.md
instructions.md
