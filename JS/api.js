export const API_KEY = '34f1d562d59ad925f386309a75c63709';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

async function requisicao(url) {
    try {
        const res = await fetch(url);

        // erro HTTP
        if (!res.ok) {
            throw new Error(`Erro HTTP ${res.status}`);
        }

        const json = await res.json();

        // API retornou erro formal do TMDB
        if (json.success === false) {
            throw new Error(json.status_message || "Erro na API");
        }

        return json;

    } catch (erro) {
        console.error("Erro na requisição:", erro);

        // Retorno padronizado para evitar quebra no resto da aplicação
        return {
            results: [],
            genres: [],
            total_pages: 1,
            error: true,
            message: erro.message || "Erro desconhecido"
        };
    }
}

// funcao para buscar os lançamentos recentes
export async function buscarLancamentos(pagina = 1) {
    const url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=pt-BR&page=${pagina}`;
    const res = await fetch(url);
    return await res.json();
}

// 2. Buscar por gênero
export async function buscarPorGenero(idGenero, pagina = 1) {
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${idGenero}&language=pt-BR&page=${pagina}`;
    return await requisicao(url);
}

// 3. Buscar por título
export async function buscarPorTitulo(titulo, pagina = 1) {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(titulo)}&language=pt-BR&page=${pagina}`;
    return await requisicao(url);
}

// 4. Buscar lista de gêneros
export async function buscarGeneros() {
    const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`;
    return await requisicao(url);
}

// Buscar detalhes de um filme
export async function buscarDetalhesFilme(id) {
    const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR`;
    return await requisicao(url);
}

// Buscar detalhes de uma série (inclui temporadas)
export async function buscarDetalhesSerie(id) {
    const url = `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=pt-BR`;
    return await requisicao(url);
}

// Buscar lançamentos de séries
export async function buscarLancamentosSeries(pagina = 1) {
    const url = `${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=pt-BR&page=${pagina}`;
    return await requisicao(url);
}

// Buscar séries pelo título
export async function buscarSeriesPorTitulo(titulo, pagina = 1) {
    const url = `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(titulo)}&language=pt-BR&page=${pagina}`;
    return await requisicao(url);
}

// Buscar gêneros de séries
export async function buscarGenerosSeries() {
    const url = `${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=pt-BR`;
    return await requisicao(url);
}

// Buscar séries por gênero
export async function buscarSeriesPorGenero(idGenero, pagina = 1) {
    const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${idGenero}&language=pt-BR&page=${pagina}`;
    return await requisicao(url);
}