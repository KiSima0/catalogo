import { buscarGeneros } from './api.js';

export const generos = {};

export async function carregarGeneros() {
    const data = await buscarGeneros();
    
    data.genres.forEach(g => {
        generos[g.id] = g.name;
    });

    return data.genres; // para preencher o select
}

export function preencherSelectGeneros(select, lista) {
    select.innerHTML = `<option value="">Todos</option>`; // ← VOLTA AQUI

    lista.forEach(genero => {
        const option = document.createElement("option");
        option.value = genero.id;
        option.textContent = genero.name;
        select.appendChild(option);
    });
}

export function converterGeneros(listaIds) {
    return listaIds.map(id => generos[id] || "Desconhecido").join(", ");
}


