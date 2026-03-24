/**
 * Manages local storage for bingo cards and marked numbers
 */
class StorageManager {
    constructor() {
        this.CARTELAS_KEY = 'bingo_cartelas';
        this.MARCADOS_KEY = 'bingo_marcados';
        this.loadData();
    }

    loadData() {
        try {
            const cartelasData = localStorage.getItem(this.CARTELAS_KEY);
            const marcadosData = localStorage.getItem(this.MARCADOS_KEY);
            
            this.cartelas = cartelasData ? JSON.parse(cartelasData) : [];
            this.marcados = new Set(marcadosData ? JSON.parse(marcadosData) : []);
        } catch (error) {
            console.error('Error loading storage:', error);
            this.cartelas = [];
            this.marcados = new Set();
        }
    }

    save() {
        try {
            localStorage.setItem(this.CARTELAS_KEY, JSON.stringify(this.cartelas));
            localStorage.setItem(this.MARCADOS_KEY, JSON.stringify([...this.marcados]));
        } catch (error) {
            console.error('Error saving to storage:', error);
            throw new Error('Failed to save data');
        }
    }

    addCard(numbers) {
        if (!Array.isArray(numbers) || numbers.length !== 25) {
            throw new Error('Invalid card format');
        }
        this.cartelas.push(numbers);
        this.save();
    }

    removeCard(index) {
        if (index >= 0 && index < this.cartelas.length) {
            this.cartelas.splice(index, 1);
            this.save();
        }
    }

    toggleMarked(number) {
        if (this.marcados.has(number)) {
            this.marcados.delete(number);
        } else {
            this.marcados.add(number);
        }
        this.save();
    }

    clearMarked() {
        this.marcados.clear();
        this.save();
    }

    isMarked(number) {
        return this.marcados.has(number);
    }

    getCards() {
        return this.cartelas;
    }

    getMarked() {
        return Array.from(this.marcados);
    }
}

export default StorageManager;
