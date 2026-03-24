function gerarPainel() {
    const corpo = document.getElementById("corpo-75");
    corpo.innerHTML = "";

    let tr = document.createElement("tr");

    for (let i = 1; i <= 75; i++) {
        const td = document.createElement("td");
        const num = i.toString().padStart(2, "0");

        td.textContent = num;
        td.dataset.num = num;
        td.className = "inexistente";

        tr.appendChild(td);

        if (i % 10 === 0) {
            corpo.appendChild(tr);
            tr = document.createElement("tr");
        }
    }

    corpo.appendChild(tr);
}

function renderizarCartelas() {

    const container = document.getElementById("container-cartelas");
    container.innerHTML = "";

    document.querySelectorAll("#tabela-75 td").forEach(td => {
    td.classList.add("inexistente");
    td.classList.remove("marcada");
    td.classList.remove("sorteado"); // 👈 novo
});

    cartelas.forEach((nums, index) => {

        const wrapper = document.createElement("div");
        wrapper.className = "cartela-wrapper";

        const btn = document.createElement("button");
        btn.innerText = "X";
        btn.className = "btn-remover";

        btn.onclick = () => {
            if (confirm("Excluir?")) {
                cartelas.splice(index, 1);
                salvar();
                renderizarCartelas();
            }
        };

        const table = document.createElement("table");
        let html = "";

        nums.forEach((n, i) => {

            if (i % 5 === 0) html += "<tr>";

            const css = marcados.has(n) ? "marcada" : "";

            html += `<td data-num="${n}" class="${css}">${n}</td>`;

            if (i % 5 === 4) html += "</tr>";

        });

        table.innerHTML = html;

        wrapper.appendChild(btn);
        wrapper.appendChild(table);
        container.appendChild(wrapper);

        if (verificarBingo(nums)) {
            wrapper.style.border = "3px solid gold";
        }
    });

    vincular();
}

function vincular() {

    // 🎯 Clique nas CARTELAS (verde)
    document.querySelectorAll(".container-cartelas td[data-num]").forEach(td => {
        td.onclick = () => {
            const n = td.dataset.num;

            if (marcados.has(n)) marcados.delete(n);
            else marcados.add(n);

            salvar();
            renderizarCartelas();
        };
    });

    // 🎯 Clique no TABULEIRO 1–75 (amarelo)
    document.querySelectorAll("#tabela-75 td").forEach(td => {
        td.onclick = () => {
            const n = td.dataset.num;

            if (marcados.has(n)) {
                marcados.delete(n);
            } else {
                marcados.add(n);
            }

            salvar();
            renderizarCartelas();
        };
    });
}
