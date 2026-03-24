let cartelas = JSON.parse(localStorage.getItem("cartelas")) || [];
let marcados = new Set(JSON.parse(localStorage.getItem("marcados")) || []);

function salvar() {
    localStorage.setItem("cartelas", JSON.stringify(cartelas));
    localStorage.setItem("marcados", JSON.stringify([...marcados]));
}
