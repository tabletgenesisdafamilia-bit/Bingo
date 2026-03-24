/**
 * Handles camera operations
 */
class CameraHandler {
    constructor(ocrProcessor) {
        this.ocr = ocrProcessor;
        this.stream = null;
    }

    async open() {
        try {
            const constraints = {
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            const video = document.getElementById('video');
            video.srcObject = this.stream;

            const modal = document.getElementById('camera-modal');
            if (modal instanceof HTMLDialogElement) {
                modal.showModal();
            } else {
                modal.style.display = 'block';
            }
        } catch (error) {
            console.error('Camera error:', error);
            throw new Error('Unable to access camera. Please check permissions.');
        }
    }

    close() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        const modal = document.getElementById('camera-modal');
        if (modal instanceof HTMLDialogElement) {
            modal.close();
        } else {
            modal.style.display = 'none';
        }
    }

    async capture() {
        try {
            const video = document.getElementById('video');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            ctx.drawImage(video, 0, 0);

            this.close();

            await this.ocr.processCanvas(canvas);
        } catch (error) {
            console.error('Capture error:', error);
            throw new Error('Failed to capture image');
        }
    }
}

export default CameraHandler;
