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
        let dados;

        if (tipo === "movie") {
            dados = await buscarDetalhesFilme(id);
        } else {
            dados = await buscarDetalhesSerie(id);
        }

        renderizarDetalhes(dados);

    } catch (erro) {
        container.innerHTML = "<p>Erro ao carregar detalhes.</p>";
        console.error(erro);
    }
}

// Função para renderizar tudo na tela
function renderizarDetalhes(dados) {
    const titulo = dados.title || dados.name;
    const imagem = dados.poster_path
        ? `${IMG_BASE_URL}${dados.poster_path}`
        : "https://placehold.co/400x600/333/fff?text=Sem+Imagem";

    const sinopse = dados.overview || "Sinopse não informada";
    const rating = dados.vote_average ? dados.vote_average.toFixed(1) : "N/A";

    // HTML base
    let html = `
        <h1>${titulo}</h1>

        <img class="poster-detalhe" src="${imagem}" alt="${titulo}">

        <p><strong>Rating:</strong> ${rating}</p>
        
        <h3>Sinopse</h3>
        <p id="sinopse" class="texto-curto">${sinopse}</p>
    `;

    // Se for série → exibir temporadas
    if (dados.seasons) {
        html += `<h3>Temporadas</h3><ul>`;
        dados.seasons.forEach(temp => {
            html += `<li>${temp.name} — ${temp.episode_count} episódios</li>`;
        });
        html += `</ul>`;
    }

    container.innerHTML = html;

    // LOGICA: mostrar mais / menos
    const texto = document.getElementById("sinopse");

    if (sinopse.length > 400) {
        const botao = document.createElement("button");
        botao.id = "btn-mais";
        botao.textContent = "Mostrar mais";
        botao.style.marginTop = "10px";

        let expandido = false;
        botao.onclick = () => {
            expandido = !expandido;
            if (expandido) {
                texto.classList.remove("texto-curto");
                botao.textContent = "Mostrar menos";
            } else {
                texto.classList.add("texto-curto");
                botao.textContent = "Mostrar mais";
            }
        };

        container.appendChild(botao);
    }
}

// Iniciar
carregarDetalhes();