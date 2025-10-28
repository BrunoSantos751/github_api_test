// 1. Ainda precisamos disso para interatividade (hooks do React)
"use client";

import { useState } from "react";

// 2. Definimos um tipo para os dados do repositório (bom para TypeScript)
// Isso nos dá autocompletar e segurança de tipos
type Repo = {
  id: number;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
};

export default function Home() {
  const [query, setQuery] = useState("language:python"); // Estado para o input

  // 3. Novos estados para gerenciar os resultados
  const [results, setResults] = useState<Repo[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 4. Atualizamos o handleSubmit para ser assíncrono e chamar nossa API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento da página
    
    // Inicia o "carregando" e limpa estados antigos
    setIsLoading(true);
    setResults(null);
    setError(null);

    try {
      // 5. Chamamos a NOSSA API, não a do GitHub
      // Usamos 'encodeURIComponent' para tratar caracteres especiais (como : e +)
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        // Se a resposta da nossa API não for 'ok', lemos o erro
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao buscar dados.");
      }

      // Se deu tudo certo, guardamos os resultados
      const data = await response.json();
      setResults(data);

    } catch (err: any) {
      // Se o 'fetch' falhar ou nós "jogamos" um erro, guardamos a mensagem
      setError(err.message);
    } finally {
      // Em caso de sucesso ou falha, paramos o "carregando"
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-gray-900 text-white">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Buscador de Repositórios Ativos
        </h1>

        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: language:python topic:machine-learning"
            className="flex-grow p-3 rounded-l-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-r-md disabled:opacity-50"
            disabled={isLoading} // 6. Desabilita o botão enquanto carrega
          >
            {isLoading ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {/* 7. Área de Resultados: renderização condicional */}
        <div className="mt-8 w-full">
          {isLoading && (
            <p className="text-center text-gray-400">Carregando...</p>
          )}

          {error && (
            <p className="text-center text-red-500">
              <strong>Erro:</strong> {error}
            </p>
          )}

          {results && results.length === 0 && (
            <p className="text-center text-gray-400">
              Nenhum repositório encontrado com atividade recente. Tente outra busca.
            </p>
          )}

          {/* 8. A Lista de Resultados */}
          {results && results.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Resultados</h2>
              {results.map((repo) => (
                <div key={repo.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-bold text-blue-400 hover:underline"
                  >
                    {repo.full_name}
                  </a>
                  <p className="text-gray-400 mt-2 text-sm">
                    {repo.description}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-sm text-gray-300">
                    <span>⭐ {repo.stargazers_count} Estrelas</span>
                    <span>🍴 {repo.forks_count} Forks</span>
                    <span>
                      Último push: {new Date(repo.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}