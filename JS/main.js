// main.js
import { buscarLancamentos, buscarPorGenero, buscarSeriesPorGenero, buscarLancamentosSeries } from './api.js';
import { carregarGeneros, preencherSelectGeneros } from './genero.js';
import { mostrarFilmes, atualizarTitulo, tituloSecao } from './ui.js';
import { mostrarPaginacao, esconderPaginacao } from './paginacao.js';
import { configurarBusca, executarBusca } from './buscar.js';
import { setModo, setGenero } from './state.js';
import { converterGeneros } from './genero.js';

const filtroGenero = document.getElementById("genero");
const formBusca = document.getElementById("form-busca");
const inputBusca = document.getElementById("busca-titulo");

// Carrega lançamentos iniciais (sem paginação)
async function carregarLancamentosIniciais() {
    setModo("recentes");
    atualizarTitulo("Lançamentos recentes");

    try {
        const [filmes, series] = await Promise.all([
            buscarLancamentos(1),
            buscarLancamentosSeries(1)
        ]);

        const combinados = [
            ...(filmes.results || []).map(f => ({ ...f, tipo: "movie" })),
            ...(series.results || []).map(s => ({ ...s, tipo: "tv" }))
        ];

        // ordenar por popularidade
        combinados.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

        mostrarFilmes(combinados);
        esconderPaginacao();
    } catch (err) {
        console.error("Erro ao carregar lançamentos:", err);
        document.getElementById("lista-filmes").innerHTML = "<p>Erro ao carregar lançamentos.</p>";
    }
}

// Função que aplica o filtro por gênero e suporta paginação
export async function aplicarFiltroGenero(idGenero, pagina = 1) {
    // Se selecionar "Todos"
    if (!idGenero) {
        await carregarLancamentosIniciais();
        return;
    }

    setModo("genero");
    setGenero(idGenero);

    try {
        const [filmes, series] = await Promise.all([
            buscarPorGenero(idGenero, pagina),
            buscarSeriesPorGenero(idGenero, pagina)
        ]);

        const combinados = [
            ...(filmes.results || []).map(f => ({ ...f, tipo: "movie" })),
            ...(series.results || []).map(s => ({ ...s, tipo: "tv" }))
        ];

        combinados.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

        const nomeGenero = filtroGenero.options[filtroGenero.selectedIndex]?.text || "Gênero";
        atualizarTitulo(`Gênero: ${nomeGenero}`);

        mostrarFilmes(combinados);

        const totalPaginas = Math.max(
            filmes.total_pages || 1,
            series.total_pages || 1
        );

        mostrarPaginacao(pagina, totalPaginas, (pg) => aplicarFiltroGenero(idGenero, pg));
    } catch (err) {
        console.error("Erro ao filtrar por gênero:", err);
        document.getElementById("lista-filmes").innerHTML = "<p>Erro ao filtrar por gênero.</p>";
    }
}

// Inicialização
async function start() {
    // 1) carregar generos e preencher select
    const lista = await carregarGeneros();
    preencherSelectGeneros(filtroGenero, lista);

    // preencherSelectGeneros já foi executado dentro de carregarGeneros (se sua função faz isso);
    // se não, chame uma função que preenche; mas no seu caso, carregarGeneros retorna lista.
    // Aqui garantimos que exista a opção "Todos" (se sua função não colocou, adicione)
    if (!document.getElementById("genero").querySelector('option[value=""]')) {
        // cria opção "Todos" se não existir
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "Todos";
        filtroGenero.insertBefore(opt, filtroGenero.firstChild);
    }

    // 2) evento do filtro: usa aplicarFiltroGenero
    filtroGenero.addEventListener("change", () => {
        const id = filtroGenero.value;
        aplicarFiltroGenero(id, 1);
    });

    // 3) iniciar busca (configura o formulário)
    configurarBusca();

    // 4) carregar lançamentos iniciais
    await carregarLancamentosIniciais();
}

start();

