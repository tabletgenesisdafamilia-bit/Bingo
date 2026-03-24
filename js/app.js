// Main app entry point - using modules for better organization
import StorageManager from './modules/storage.js';
import BingoEngine from './modules/bingo-engine.js';
import UIManager from './modules/ui-manager.js';
import OCRProcessor from './modules/ocr-processor.js';
import CameraHandler from './modules/camera-handler.js';

class BingoApp {
    constructor() {
        this.storage = new StorageManager();
        this.bingoEngine = new BingoEngine(this.storage);
        this.ui = new UIManager(this.storage, this.bingoEngine);
        this.ocr = new OCRProcessor(this.storage, this.ui);
        this.camera = new CameraHandler(this.ocr);
        
        this.init();
    }

    init() {
        this.ui.renderPanel();
        this.ui.renderCards();
        this.attachEventListeners();
        this.handleMobileFeatures();
    }

    attachEventListeners() {
        // Button handlers with error handling
        document.getElementById('btn-camera').addEventListener('click', 
            () => this.camera.open().catch(this.handleError.bind(this)));
        
        document.getElementById('btn-reset').addEventListener('click', 
            () => this.handleReset());
        
        document.getElementById('input-file').addEventListener('change', 
            (e) => this.handleFileUpload(e));
        
        document.getElementById('btn-save-card').addEventListener('click',
            () => this.ocr.saveCard());
        
        document.getElementById('btn-cancel-card').addEventListener('click',
            () => this.ocr.closeModal());
        
        document.getElementById('btn-capture').addEventListener('click',
            () => this.camera.capture().catch(this.handleError.bind(this)));
        
        document.getElementById('btn-close-camera').addEventListener('click',
            () => this.camera.close());
        
        // Close modal on overlay click
        document.getElementById('overlay').addEventListener('click', 
            () => this.ocr.closeModal());
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        this.ocr.processFile(file);
    }

    handleReset() {
        if (confirm('Deseja limpar todas as marcações?')) {
            this.storage.clearMarked();
            this.ui.renderCards();
        }
    }

    handleMobileFeatures() {
        if (this.isMobile()) {
            this.requestWakeLock();
        } else {
            this.updateStatus('💻 Desktop');
        }
    }

    isMobile() {
        return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    async requestWakeLock() {
        try {
            if ('wakeLock' in navigator) {
                await navigator.wakeLock.request('screen');
                this.updateStatus('📱 Tela ativa');
                
                document.addEventListener('visibilitychange', async () => {
                    if (document.visibilityState === 'visible') {
                        await navigator.wakeLock.request('screen');
                    }
                });
            }
        } catch (err) {
            console.warn('Wake Lock not available:', err);
        }
    }

    updateStatus(message) {
        const element = document.getElementById('status-tela');
        if (element) element.textContent = message;
    }

    handleError(error) {
        console.error('Error:', error);
        this.updateStatus('❌ Erro ao processar');
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BingoApp());
} else {
    new BingoApp();
}
