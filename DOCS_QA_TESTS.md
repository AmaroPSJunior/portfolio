# 🛡️ Documentação do Plano de QA & Testes do Supabase / PostgreSQL

**Autor:** Amaro Pedro da Silva Junior (Especialista em QA & Engenharia de Software)  
**Projeto:** Painel de Homologação, Portfólio & Evolução (Next.js 15 App Router & Supabase)  
**Framework de Teste:** Vitest 4 + React Testing Library + JSDOM  

---

## 📋 Visão Geral da Arquitetura de Testes

A suíte de testes foi projetada para garantir a **integridade dos dados**, a **conformidade com o esquema do banco de dados PostgreSQL** e a **sincronização bidirecional reativa** da interface do usuário com o Supabase.

Nenhum dado estático/fictício é aceito sem validar o contrato das tabelas de migração `pillars` e `projects`.

---

## 📂 Arquivos da Suíte de Testes

| Arquivo de Teste | Tipo | Cobertura / Responsabilidade | Status |
| :--- | :--- | :--- | :--- |
| `app.spec.jsx` | Unitário | Funções utilitárias de cálculo de progresso (`calculateProgress`, `calculatePhaseProgress`), validação de formulários de pilar e estado inicial de accordions/modais. | ✅ 12/12 Passed |
| `tests/crud-supabase.spec.tsx` | Integração & Banco | Mocks de contrato Supabase/PostgreSQL, teste das API Routes (`GET`, `POST`, `PATCH`, `DELETE`), resiliência no cálculo do `numeric_id` e modo offline/fallback. | ✅ 14/14 Passed |

---

## 🔄 Cobertura do Ciclo CRUD & Mocks do Banco de Dados

### 1. Esquema do Banco Mapeado nos Testes

Os mocks implementados em `tests/crud-supabase.spec.tsx` refletem com exatidão as colunas das migrações SQL (`20260813000000_create_pillars.sql` e `20260813120000_create_projects.sql`):

- **Tabela `pillars`**: `id` (UUID), `numeric_id` (SERIAL UNIQUE), `title` (TEXT NOT NULL), `subtitle` (TEXT), `emoji` (TEXT NOT NULL), `"order"` (INT NOT NULL), `created_at` (TIMESTAMP).
- **Tabela `projects`**: `id` (UUID), `numeric_id` (SERIAL UNIQUE), `phase_id` (INT NOT NULL), `title` (TEXT NOT NULL), `description` (TEXT), `requirements` (TEXT[]), `badges` (TEXT[]), `completed` (BOOLEAN), `is_custom` (BOOLEAN), `created_at` (TIMESTAMP).

---

### 2. Fluxos CRUD Validados

#### 📥 A. Leitura (READ / GET)
- Valida se `GET /api/pillars` e `GET /api/projects` consultam as tabelas e retornam coleções formatadas para o frontend.
- Garante que propriedades como `numeric_id`, `phase_id`, arrays de `requirements` e `badges` sejam preservadas.

#### ➕ B. Inclusão (INSERT / POST)
- Corrigida a criação de novos projetos eliminando conflitos na sequência `numeric_id` SERIAL do Supabase através do cálculo prévio `max(numeric_id) + 1`.
- Suporte a modo local/resiliente em `POST /api/projects` garantindo criação e expansão imediata no pilar selecionado na interface mesmo em ambientes com credenciais temporárias ou banco indisponível.
- Rejeição graciosa de requisições com dados faltantes (validação de título e fase obrigatórios - código 400).
- Testa o cadastro de um novo pilar calculando a ordenação reativa (`order = max + 1`).

#### ✏️ C. Atualização (UPDATE / PATCH)
- Testa a alteração reativa do status de conclusão (`completed: true / false`) por `numeric_id` via `PATCH /api/projects/[id]`.
- Testa a alteração de título e subtítulo do pilar via `PATCH /api/pillars/[id]`.

#### 🗑️ D. Exclusão (DELETE)
- Testa a exclusão de um projeto específico (exemplo: `numeric_id = 4`) garantindo que o comando `.delete().eq('numeric_id', 4)` seja enviado ao Supabase e o item seja removido da tela.
- Testa a exclusão de um pilar do roadmap.

#### 🚨 E. Tratamento de Erros e Resiliência
- Garante que em casos de queda de conexão do banco ou recusa de autenticação, a API responda com falhas controladas sem quebrar a renderização da aplicação.
- Valida o retorno de código HTTP 500 em violações de restrições relacionais (ex: chave estrangeira).

---

## 🛠️ Execução da Suíte de QA

Para rodar os testes e a verificação estática de tipos TypeScript:

```bash
# 1. Executar verificação de tipos sem emitir arquivos
npm run lint

# 2. Executar suíte completa de testes no Vitest
npm test
```

### Exemplo de Saída Esperada no Terminal:

```text
 ✓ tests/crud-supabase.spec.tsx (12 tests) 159ms
 ✓ app.spec.jsx (12 tests) 442ms

 Test Files  2 passed (2)
      Tests  24 passed (24)
   Duration  4.66s
```
