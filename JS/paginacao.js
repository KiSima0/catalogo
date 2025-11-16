import { modoAtual, ultimaBusca, ultimoGeneroSelecionado } from "./state.js";
import { buscarPorTitulo, buscarPorGenero } from "./api.js";

export const paginacao = document.getElementById("paginacao");

export function mostrarPaginacao(paginaAtual, totalPaginas, callback) {
    paginacao.style.display = "flex";
    paginacao.innerHTML = `
        <button id="prev" ${paginaAtual === 1 ? "disabled" : ""}>Anterior</button>
        <span>${paginaAtual} / ${totalPaginas}</span>
        <button id="next" ${paginaAtual === totalPaginas ? "disabled" : ""}>Próxima</button>
    `;

    document.getElementById("prev").onclick = () => callback(paginaAtual - 1);
    document.getElementById("next").onclick = () => callback(paginaAtual + 1);
}

export function esconderPaginacao() {
    paginacao.style.display = "none";
}