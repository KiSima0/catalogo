// main.js
import { buscarLancamentos, buscarPorGenero } from './api.js';
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
        const data = await buscarLancamentos(1);
        const filtrados = (data.results || []).filter(f => f.release_date && f.release_date >= "2024-01-01");
        mostrarFilmes(filtrados);
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
        const data = await buscarPorGenero(idGenero, pagina);

        // formatar os gêneros em cada filme para o UI usar (opcional)
        (data.results || []).forEach(f => {
            f.generosFormatados = converterGeneros(f.genre_ids || []);
        });

        const nomeGenero = filtroGenero.options[filtroGenero.selectedIndex]?.text || "Gênero";
        atualizarTitulo(`Gênero: ${nomeGenero}`);

        mostrarFilmes(data.results || []);
        mostrarPaginacao(data.page, data.total_pages, (pg) => aplicarFiltroGenero(idGenero, pg));
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

