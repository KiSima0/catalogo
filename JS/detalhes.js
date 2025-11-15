import { buscarDetalhesFilme, buscarDetalhesSerie, IMG_BASE_URL } from "./api.js";

// Capturar id e tipo da URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const tipo = params.get("tipo"); // "movie" ou "tv"

const container = document.getElementById("detalhes-container");

// Função principal
async function carregarDetalhes() {
    container.innerHTML = "<p>Carregando detalhes...</p>";

    try {
        let dados =
            tipo === "movie"
                ? await buscarDetalhesFilme(id)
                : await buscarDetalhesSerie(id);

        renderizarDetalhes(dados);

    } catch (erro) {
        container.innerHTML = "<p>Erro ao carregar detalhes.</p>";
        console.error(erro);
    }
}

// Função para renderizar tudo na tela
function renderizarDetalhes(dados) {
    const titulo = dados.title || dados.name || "Título indisponível";
    const imagem = dados.poster_path
        ? `${IMG_BASE_URL}${dados.poster_path}`
        : "https://placehold.co/400x600/333/fff?text=Sem+Imagem";

    const sinopse = dados.overview || "Sinopse não informada";
    const data = dados.release_date || dados.first_air_date || "Data não informada";
    const rating = dados.vote_average ? dados.vote_average.toFixed(1) : "N/A";

    const generos = dados.genres?.length ? dados.genres.map(g => g.name).join(", ") : "Não informado";

    // HTML base
    let html = `
        <button id="btn-voltar" class="btn-voltar">← Voltar</button>

        <h1>${titulo}</h1>

        <img class="poster-detalhe" src="${imagem}" alt="${titulo}">

        <p><strong>Tipo:</strong> ${tipo === "movie" ? "Filme 🎬" : "Série 📺"}</p>

        <p><strong>Lançamento:</strong> ${data}</p>
        <p><strong>Rating:</strong> ${rating}</p>
        <p><strong>Gêneros:</strong> ${generos}</p>
        
        <h3>Sinopse</h3>
        <p id="sinopse" class="texto-curto">${sinopse}</p>
    `;

    // Se for série → exibir temporadas
    if (dados.seasons) {
        html += `<h3>Temporadas</h3><ul>`;
        dados.seasons.forEach(temp => {
            html += `<li><strong>${temp.name}</strong> — ${temp.episode_count} episódios</li>`;
        });
        html += `</ul>`;
    }

    container.innerHTML = html;

    // Mostrar mais / menos
    const texto = document.getElementById("sinopse");

    if (sinopse.length > 400) {
        const botao = document.createElement("button");
        botao.id = "btn-mais";
        botao.textContent = "Mostrar mais";
        botao.style.marginTop = "10px";

        let expandido = false;
        botao.onclick = () => {
            expandido = !expandido;
            texto.classList.toggle("texto-curto", !expandido);
            botao.textContent = expandido ? "Mostrar menos" : "Mostrar mais";
        };

        container.appendChild(botao);
    }

        document.getElementById("btn-voltar").onclick = () => {
        window.history.back();
    };
}

// Iniciar
carregarDetalhes();