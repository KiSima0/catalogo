import { IMG_BASE_URL } from './api.js';
import { converterGeneros } from './genero.js';

export const listaFilmes = document.getElementById("lista-filmes");
export const tituloSecao = document.querySelector("#catalogo h2");

// Criar card de filme
export function mostrarFilmes(filmes) {
    listaFilmes.innerHTML = "";

    filmes.forEach(movie => {
        const imagem = movie.poster_path
            ? `${IMG_BASE_URL}${movie.poster_path}`
            : "https://placehold.co/300x450/333/fff?text=Sem+Imagem";

        const card = document.createElement("article");
        card.classList.add("card-filme");

        card.innerHTML = `
            <img src="${imagem}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p><strong>Data:</strong> ${movie.release_date || "Não informado"}</p>
            <p><strong>Gêneros:</strong> ${converterGeneros(movie.genre_ids)}</p>
        `;

        listaFilmes.appendChild(card);
    });
}

// Atualiza o título da seção
export function atualizarTitulo(texto) {
    tituloSecao.textContent = texto;
}
