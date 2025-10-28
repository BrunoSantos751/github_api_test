Buscador de Repositórios Ativos no GitHub

Este é um aplicativo web simples para encontrar repositórios no GitHub que tiveram atividade recente (push nos últimos 7 dias), com base em uma consulta de busca.

O principal objetivo deste projeto é demonstrar o uso de Rotas de API do Next.js para atuar como um "proxy seguro" para uma API externa (a API do GitHub), protegendo chaves de API sensíveis (como o Token de Acesso Pessoal - PAT).

✨ Funcionalidades

    Busca Segura: O frontend (cliente) nunca expõe o token da API do GitHub.

    Filtro de Atividade: Os resultados incluem apenas repositórios que tiveram um push nos últimos 7 dias.

    Ordenação: Os resultados são ordenados pelos mais recentemente atualizados (updated: 'desc').

    Interface Reativa: Construído com React e Tailwind CSS, com estados de "carregando", "erro" e "resultados".

🛠️ Stack Utilizada

    Framework: Next.js (com App Router)

    Linguagem: TypeScript

    Frontend: React (Hooks useState)

    Backend: Next.js API Routes (Serverless Functions)

    Estilização: Tailwind CSS

    API do GitHub: Octokit (@octokit/rest)
