# 👨‍💻 Painel de Homologação & Evolução do Projeto

![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue?style=for-the-badge&logo=githubactions)
![Build & Test](https://img.shields.io/badge/Tests-Vitest%20Passed-emerald?style=for-the-badge&logo=vitest)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-cyan?style=for-the-badge&logo=github)
![Vue.js 3](https://img.shields.io/badge/Vue.js-3.x-green?style=for-the-badge&logo=vuedotjs)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Desenvolvedor:** Amaro Pedro da Silva Junior | *Full Stack & DevOps Engineer*  
**Stack Principal:** Java • Spring Boot • Node.js • Vue.js 3 • React • TypeScript • C# .NET • SQL • CI/CD

---

## 🚀 Sobre o Projeto

Este repositório contém o **Painel de Homologação e Checklist de Evolução do Projeto**, uma aplicação SPA reativa moderna desenvolvida em Vue.js 3 e Tailwind CSS, configurada para entrega contínua (CI/CD) via GitHub Actions e hospedagem no GitHub Pages.

### 🌟 Funcionalidades Principais

- **📋 Matriz de Homologação de 4 Fases:** Acompanhamento dinâmico do ciclo de vida do software com salvamento no `localStorage`.
- **⚙️ Automação de CI/CD:** Pipeline em `.github/workflows/ci-cd.yml` para testes unitários com Vitest e publicação no GitHub Pages.
- **💼 Portfólio & Tech Lab (PoCs):** Demonstração de arquiteturas B2B/B2C, ERP Industrial e provas de conceito em Web3/Pix.
- **🎯 Matriz de Habilidades Unitárias:** Mapeamento visual das competências técnicas do desenvolvedor.
- **🐙 Sincronização em Tempo Real com GitHub:** Conexão com a API REST do GitHub para status do repositório, commits e status da pipeline de testes.

---

## 🛠️ Como Sincronizar e Rodar o Repositório

### 1. Clonar e Instalar Dependências

```bash
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
cd SEU-REPOSITORIO
npm install
```

### 2. Executar os Testes Unitários (Vitest)

```bash
npm test
```

### 3. Conectar Remote Git e Enviar para o GitHub

```bash
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git branch -M main
git push -u origin main
```

---

## ⚙️ Pipeline CI/CD (.github/workflows/ci-cd.yml)

O repositório está pré-configurado com uma Action de integração e entrega contínua:

1. **Checkout & Cache:** Clona o repositório e configura o ambiente Node.js 20.
2. **Testes Unitários:** Executa a suíte de testes em `app.spec.js` via Vitest.
3. **Deploy no GitHub Pages:** Publica a aplicação web automaticamente na branch `gh-pages` ou no ambiente do GitHub Pages.

---

## 📄 Licença

Desenvolvido por **Amaro Pedro da Silva Junior** — 2024. Licenciado sob a [MIT License](LICENSE).
