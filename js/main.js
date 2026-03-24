function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function manterTelaAtiva() {

    if (!isMobile()) {
        document.getElementById("status-tela").innerText = "💻 Desktop";
        return;
    }

    async function req() {
        try {
            if ("wakeLock" in navigator) {
                await navigator.wakeLock.request("screen");
                document.getElementById("status-tela").innerText = "📱 Tela ativa";
            }
        } catch {}
    }

    req();

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") req();
    });
}

function resetarMarcacoes() {
    marcados.clear();
    salvar();
    renderizarCartelas();
}

function init() {
    gerarPainel();
    renderizarCartelas();
    manterTelaAtiva();
}

init();
