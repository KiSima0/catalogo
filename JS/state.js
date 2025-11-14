export let modoAtual = "recentes";
export let ultimaBusca = "";
export let ultimoGeneroSelecionado = 0;

export function setModo(valor) { 
    modoAtual = valor; 
}
export function setBusca(valor) { 
    ultimaBusca = valor; 
}
export function setGenero(valor) {
    ultimoGeneroSelecionado = valor; 
}
