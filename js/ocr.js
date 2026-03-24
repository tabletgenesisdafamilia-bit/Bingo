document.getElementById("input-file").onchange = function(e) {

    const file = e.target.files[0];
    if (!file) return;

    const status = document.getElementById("status-tela");
    status.innerText = "📸 Processando...";

    Tesseract.recognize(file, "eng", {
        tessedit_char_whitelist: "0123456789",
        tessedit_pageseg_mode: 6
    }).then(({ data: { text } }) => {

        let nums = text.match(/\d+/g) || [];

        nums = nums
            .map(n => parseInt(n))
            .filter(n => n >= 1 && n <= 75)
            .map(n => n.toString().padStart(2, "0"));

        nums = [...new Set(nums)];

        abrirModal(nums.slice(0, 25));

        status.innerText = "✔ OK";

    }).catch(() => {
        status.innerText = "❌ Erro OCR";
        abrirModal([]);
    });
};

function abrirModal(nums) {

    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    const container = document.createElement("div");

    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(5, 40px)";
    container.style.gap = "6px";

    for (let i = 0; i < 25; i++) {

        let v = nums[i] || "";
        if (i === 12 && !v) v = "XX";

        const input = document.createElement("input");

        input.type = "tel";
        input.inputMode = "numeric";
        input.pattern = "[0-9]*";

        input.value = v;
        input.maxLength = 2;

        input.onclick = () => input.select();

        input.addEventListener("focus", () => setTimeout(() => input.select(), 0));

        container.appendChild(input);
    }

    grid.appendChild(container);

    document.getElementById("modal-ocr").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function salvarNovaCartela() {

    const inputs = document.querySelectorAll("#grid input");

    const lista = [...inputs].map(i => i.value.padStart(2, "0"));

    cartelas.push(lista);

    salvar();
    renderizarCartelas();

    fecharModal();
}

function fecharModal() {
    document.getElementById("modal-ocr").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}
