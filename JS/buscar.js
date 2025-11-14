// buscar.js
import { buscarPorTitulo } from "./api.js";
import { mostrarFilmes, atualizarTitulo } from "./ui.js";
import { mostrarPaginacao } from "./paginacao.js";
import { setModo, setBusca } from "./state.js";

// Função reutilizável: executa a busca (fetch + render + paginação)
export async function executarBusca(texto, pagina = 1) {
    setModo("busca");
    setBusca(texto);

    atualizarTitulo(`Resultados para "${texto}"`);

    try {
        const data = await buscarPorTitulo(texto, pagina);

        if (!data || !data.results || data.results.length === 0) {
            document.getElementById("lista-filmes").innerHTML =
                "<p>Nenhum resultado encontrado.</p>";
            // Esconder paginação se não houver resultados
            mostrarPaginacao(1, 1, () => {}); // opcional: poderia esconder
            return;
        }

        // Renderiza e delega à paginação o callback correto
        mostrarFilmes(data.results);
        mostrarPaginacao(data.page, data.total_pages, (pg) => executarBusca(texto, pg));
    } catch (err) {
        console.error("Erro na busca:", err);
        document.getElementById("lista-filmes").innerHTML =
            "<p>Erro ao buscar. Tente novamente mais tarde.</p>";
    }
}

// Função que configura o formulário para usar executarBusca
export function configurarBusca() {
    const formBusca = document.getElementById("form-busca");
    const inputBusca = document.getElementById("busca-titulo");

    formBusca.addEventListener("submit", async (e) => {
        e.preventDefault();

        const texto = inputBusca.value.trim();
        if (texto === "") return;

        executarBusca(texto, 1);
    });
}
