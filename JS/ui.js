import { IMG_BASE_URL } from './api.js';
import { converterGeneros } from './genero.js';

export const listaFilmes = document.getElementById("lista-filmes");
export const tituloSecao = document.querySelector("#catalogo h2");

// Criar card de filme
export function mostrarFilmes(filmes, destino = listaFilmes) {
    listaFilmes.innerHTML = "";

    filmes.forEach(item => {
        const imagem = item.poster_path
            ? `${IMG_BASE_URL}${item.poster_path}`
            : "https://placehold.co/300x450/333/fff?text=Sem+Imagem";

        // Título correto (filme ou série)
        const titulo = item.title || item.name || "Título indisponível";

        // Data correta (filme ou série)
        const data = item.release_date || item.first_air_date || "Não informado";

        const tipoTexto = item.tipo === "tv" ? "📺 Série" : "🎬 Filme";

        const card = document.createElement("article");
        card.classList.add("card-filme");

        card.innerHTML = `
            <img src="${imagem}" alt="${titulo}">
            <h3>${titulo}</h3>
            <p><strong>Tipo:</strong> ${tipoTexto}</p>
            <p><strong>Data:</strong> ${data}</p>
            <p><strong>Gêneros:</strong> ${converterGeneros(item.genre_ids || [])}</p>
        `;

        const link = document.createElement("a");
        link.href = `detalhes.html?id=${item.id}&tipo=${item.tipo || "movie"}`;
        link.style.textDecoration = "none";
        link.style.color = "inherit";

        link.appendChild(card);
        listaFilmes.appendChild(link);
    });
}

// Atualiza o título da seção
export function atualizarTitulo(texto) {
    tituloSecao.textContent = texto;
}
