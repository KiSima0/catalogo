import { buscarGeneros, buscarGenerosSeries } from './api.js';

export const generos = {};

export async function carregarGeneros() {
    const [gFilmes, gSeries] = await Promise.all([
        buscarGeneros(),
        buscarGenerosSeries()
    ]);

    const juntos = [
        ...(gFilmes.genres || []).map(g => ({ ...g, tipo: "movie" })),
        ...(gSeries.genres || []).map(g => ({ ...g, tipo: "tv" }))
    ];

    // registrar no mapa
    juntos.forEach(g => {
        generos[g.id] = g.name;
    });

    return juntos;
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


