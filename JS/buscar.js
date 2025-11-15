import { buscarPorTitulo, buscarSeriesPorTitulo } from "./api.js";
import { mostrarFilmes, atualizarTitulo } from "./ui.js";
import { mostrarPaginacao } from "./paginacao.js";
import { setModo, setBusca } from "./state.js";

export async function executarBusca(texto, pagina = 1) {
    setModo("busca");
    setBusca(texto);

    atualizarTitulo(`Resultados para "${texto}"`);

    try {
        const [filmes, series] = await Promise.all([
            buscarPorTitulo(texto, pagina),
            buscarSeriesPorTitulo(texto, pagina)
        ]);

        const combinados = [
            ...(filmes.results || []).map(f => ({ ...f, tipo: "movie" })),
            ...(series.results || []).map(s => ({ ...s, tipo: "tv" }))
        ];

        if (combinados.length === 0) {
            document.getElementById("lista-filmes").innerHTML =
                "<p>Nenhum resultado encontrado.</p>";
            mostrarPaginacao(1, 1, () => {});
            return;
        }

        combinados.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

        mostrarFilmes(combinados);

        const totalPaginas = Math.max(
            filmes.total_pages || 1,
            series.total_pages || 1
        );

        mostrarPaginacao(pagina, totalPaginas, (pg) => executarBusca(texto, pg));
    } catch (err) {
        console.error("Erro na busca:", err);
        document.getElementById("lista-filmes").innerHTML =
            "<p>Erro ao buscar. Tente novamente mais tarde.</p>";
    }
}

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
