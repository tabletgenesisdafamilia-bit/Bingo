let stream = null;

async function abrirCamera() {

    try {

        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        document.getElementById("video").srcObject = stream;
        document.getElementById("camera-modal").style.display = "block";

    } catch {
        alert("Erro na câmera");
    }
}

function fecharCamera() {
    if (stream) stream.getTracks().forEach(t => t.stop());
    document.getElementById("camera-modal").style.display = "none";
}

async function capturar() {

    const video = document.getElementById("video");

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    fecharCamera();

    const { data: { text } } = await Tesseract.recognize(canvas, "eng", {
        tessedit_char_whitelist: "0123456789",
        tessedit_pageseg_mode: 6
    });

    let nums = text.match(/\d+/g) || [];

    nums = nums
        .map(n => parseInt(n))
        .filter(n => n >= 1 && n <= 75)
        .map(n => n.toString().padStart(2, "0"));

    nums = [...new Set(nums)];

    abrirModal(nums.slice(0, 25));
}
