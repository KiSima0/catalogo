export const API_KEY = '34f1d562d59ad925f386309a75c63709';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// funcao para buscar os lançamentos recentes
export async function buscarLancamentos(pagina = 1) {
    const url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=pt-BR&page=${pagina}`;
    const res = await fetch(url);
    return await res.json();
}

// 2. Buscar por gênero
export async function buscarPorGenero(idGenero, pagina = 1) {
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${idGenero}&language=pt-BR&page=${pagina}`;
    const res = await fetch(url);
    return await res.json();
}

// 3. Buscar por título
export async function buscarPorTitulo(titulo, pagina = 1) {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(titulo)}&language=pt-BR&page=${pagina}`;
    const res = await fetch(url);
    return await res.json();
}

// 4. Buscar lista de gêneros
export async function buscarGeneros() {
    const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`;
    const res = await fetch(url);
    return await res.json();
}

// Buscar detalhes de um filme
export async function buscarDetalhesFilme(id) {
    const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR`;
    const res = await fetch(url);
    return await res.json();
}

// Buscar detalhes de uma série (inclui temporadas)
export async function buscarDetalhesSerie(id) {
    const url = `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=pt-BR`;
    const res = await fetch(url);
    return await res.json();
}