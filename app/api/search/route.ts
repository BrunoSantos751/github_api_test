import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Rota GET para buscar repositórios com base na query ( q ) do usuário
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userQuery = searchParams.get('q'); // Pega ?q=... da URL

  // 1. Validação: Se não houver query, retorne um erro.
  if (!userQuery) {
    return NextResponse.json(
      { error: 'Parâmetro "q" de busca é obrigatório' },
      { status: 400 } 
    );
  }

  try {
    // 2. Calcular a data (ex: 7 dias atrás) para o filtro de "atividade"
    const date = new Date();
    date.setDate(date.getDate() - 7);
    const aWeekAgo = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    // 3. Montar a query final: a busca do usuário + nosso filtro de atividade
    const combinedQuery = `${userQuery} pushed:>${aWeekAgo}`;

    // 4. Chamar a API do GitHub
    // rota utilizada pelo octokit: https://api.github.com/search/repositories?q=${encodeURIComponent(combinedQuery)}&sort=updated&order=desc
    const response = await octokit.search.repos({
      q: combinedQuery,
      sort: 'updated', // Ordenar pelos mais atualizados
      order: 'desc',     // Ordem descendente (mais novo primeiro)
      per_page: 20,      // Trazer 20 resultados
    });

    // 5. Retornar apenas os itens (repositórios) para o frontend
    return NextResponse.json(response.data.items);
    
  } catch (error) {
    // 6. Tratamento de erro
    console.error('Erro ao chamar a API do GitHub:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar dados no GitHub' },
      { status: 500 } // 500 = Internal Server Error
    );
  }
}