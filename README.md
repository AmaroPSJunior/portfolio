# 👨‍💻 Painel de Homologação, Portfólio & Evolução do Projeto (Next.js 15 & Supabase)

![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue?style=for-the-badge&logo=githubactions)
![Build & Test](https://img.shields.io/badge/Tests-24%20Passed-emerald?style=for-the-badge&logo=vitest)
![Next.js](https://img.shields.io/badge/Framework-Next.js%2015-black?style=for-the-badge&logo=nextdotjs)
![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-emerald?style=for-the-badge&logo=supabase)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Desenvolvedor:** Amaro Pedro da Silva Junior | *Full Stack & DevOps Engineer*  
**Stack Principal:** Java • Spring Boot • Node.js • Next.js 15 • React • TypeScript • PostgreSQL • Supabase • Vitest • CI/CD

---

## 🚀 Sobre o Projeto

Este repositório contém o **Painel de Homologação e Checklist de Evolução do Projeto**, uma aplicação Web reativa desenvolvida com **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS** e **Supabase (PostgreSQL)**, configurada para integração contínua (CI/CD) via GitHub Actions e deploy na Vercel.

### 🌟 Funcionalidades Principais

- **📋 Sincronização em Tempo Real com Supabase**: Persistência bidirecional de Fases (`fases`) e Projetos/Requisitos (`projects`) diretamente em banco PostgreSQL.
- **🏷️ Status com Justificativa**: Fases e projetos usam estados de Pendente, Em andamento, Pausado, Bloqueado, Concluído ou Desativado, sempre com justificativa opcional visível na interface.
- **🛡️ Suíte Completa de QA & Testes de Integração**: 24 testes unitários e de integração cobrindo componentes React, validadores e o fluxo CRUD completo das API Routes do Supabase.
- **⚙️ Automação de CI/CD**: Workflows em `.github/workflows/` para linting (`tsc --noEmit`), execução do Vitest e automação de migrações de banco.
- **💼 Portfólio & Tech Lab (PoCs)**: Projetos e aplicações completas (E-commerce, ERP Industrial, Web3, Pix e WebSockets).
- **🐙 Integração com GitHub**: Consulta dinâmica de status de repositório, commits e pipelines.

---

## 🧪 Suíte de Testes & QA (Vitest)

O projeto possui duas suítes de testes automatizadas no diretório raiz e em `tests/`:

1. **`app.spec.jsx`**: Testes unitários para cálculo de progresso geral, cálculo por fase e comportamentos da UI/Accordions (12 testes).
2. **`tests/crud-supabase.spec.tsx`**: Testes de integração e validação do contrato do banco de dados Supabase/PostgreSQL cobrindo o ciclo de vida CRUD completo (12 testes):
   - **READ (Fetch)**: Formatação das respostas das API Routes de Fases e Projetos.
   - **INSERT (POST)**: Criação de novas fases e projetos com validação de schemas e cálculo de ordenação.
   - **UPDATE (PATCH)**: Atualização reativa de `status`, justificativa, `completed` e metadados.
   - **DELETE**: Exclusão de itens no Supabase (`numeric_id = 4`, fases) e atualização da interface.
   - **Tratamento de Erros**: Resiliência contra queda de conexão ou violações de integridade.

### Executando os Testes Localmente

```bash
# Executar a suíte completa de testes
npm test

# Executar os testes em modo watch (desenvolvimento)
npx vitest
```

---

## 🛠️ Como Executar o Projeto

### 1. Clonar e Instalar Dependências

```bash
git clone https://github.com/AmaroPSJunior/painel-homologacao.git
cd painel-homologacao
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz com suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SUO_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANONIMA
```

### 3. Executar o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000` para visualizar o painel.

---

## 📄 Licença

Desenvolvido por **Amaro Pedro da Silva Junior** — 2026. Licenciado sob a [MIT License](LICENSE).
