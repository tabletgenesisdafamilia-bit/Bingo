/**
 * Handles OCR processing from files and camera
 */
class OCRProcessor {
    constructor(storage, ui) {
        this.storage = storage;
        this.ui = ui;
        this.currentNumbers = [];
    }

    async processFile(file) {
        try {
            this.ui.updateStatus('📸 Processando...');
            const numbers = await this.extractNumbers(file);
            this.openModal(numbers);
            this.ui.updateStatus('✔ OK');
        } catch (error) {
            console.error('OCR Error:', error);
            this.ui.updateStatus('❌ Erro OCR');
            this.openModal([]);
        }
    }

    async processCanvas(canvas) {
        try {
            this.ui.updateStatus('📸 Processando...');
            const numbers = await this.extractNumbers(canvas);
            this.openModal(numbers);
            this.ui.updateStatus('✔ OK');
        } catch (error) {
            console.error('OCR Error:', error);
            this.ui.updateStatus('❌ Erro OCR');
            this.openModal([]);
        }
    }

    async extractNumbers(source) {
        try {
            const { data: { text } } = await Tesseract.recognize(source, 'eng', {
                tessedit_char_whitelist: '0123456789',
                tessedit_pageseg_mode: 6
            });

            let numbers = (text.match(/\d+/g) || [])
                .map(n => parseInt(n))
                .filter(n => n >= 1 && n <= 75)
                .map(n => String(n).padStart(2, '0'));

            // Remove duplicates
            return [...new Set(numbers)].slice(0, 25);
        } catch (error) {
            throw new Error('Failed to extract numbers from image');
        }
    }

    openModal(numbers) {
        this.currentNumbers = numbers;
        const grid = document.getElementById('grid');
        grid.innerHTML = '';

        const container = document.createElement('div');
        container.className = 'grid-container';

        for (let i = 0; i < 25; i++) {
            const value = numbers[i] || '';
            // Center (XX) is free space
            const finalValue = (i === 12 && !value) ? 'XX' : value;

            const input = document.createElement('input');
            input.type = 'tel';
            input.inputMode = 'numeric';
            input.value = finalValue;
            input.maxLength = 2;
            input.data-index = i;

            input.addEventListener('focus', () => input.select());

            container.appendChild(input);
        }

        grid.appendChild(container);
        this.openModalDialog();
    }

    saveCard() {
        try {
            const inputs = document.querySelectorAll('#grid input');
            const numbers = Array.from(inputs).map(input => 
                input.value.padStart(2, '0')
            );

            if (numbers.length !== 25) {
                throw new Error('Card must have 25 numbers');
            }

            this.storage.addCard(numbers);
            this.ui.renderCards();
            this.closeModal();
            this.ui.updateStatus('✔ Cartela salva');
        } catch (error) {
            console.error('Error saving card:', error);
            this.ui.updateStatus('❌ Erro ao salvar');
        }
    }

    openModalDialog() {
        const modal = document.getElementById('modal-ocr');
        const overlay = document.getElementById('overlay');
        
        if (modal instanceof HTMLDialogElement) {
            modal.showModal();
        } else {
            modal.style.display = 'block';
        }
        overlay.style.display = 'block';
    }

    closeModal() {
        const modal = document.getElementById('modal-ocr');
        const overlay = document.getElementById('overlay');
        
        if (modal instanceof HTMLDialogElement) {
            modal.close();
        } else {
            modal.style.display = 'none';
        }
        overlay.style.display = 'none';
    }
}

export default OCRProcessor;
