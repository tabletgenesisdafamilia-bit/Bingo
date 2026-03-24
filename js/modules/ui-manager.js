/**
 * Manages all UI rendering and interactions
 */
class UIManager {
    constructor(storage, bingoEngine) {
        this.storage = storage;
        this.bingoEngine = bingoEngine;
        this.debounceTimer = null;
    }

    renderPanel() {
        const tbody = document.getElementById('corpo-75');
        if (!tbody) return;

        tbody.innerHTML = '';
        const fragment = document.createDocumentFragment();

        for (let i = 1; i <= 75; i++) {
            const td = document.createElement('td');
            const num = String(i).padStart(2, '0');

            td.textContent = num;
            td.dataset.num = num;
            td.className = 'inexistente';
            td.role = 'button';
            td.tabIndex = 0;

            td.addEventListener('click', () => this.handlePanelClick(num));
            td.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    this.handlePanelClick(num);
                    e.preventDefault();
                }
            });

            if ((i - 1) % 10 === 0) {
                const tr = document.createElement('tr');
                fragment.appendChild(tr);
            }
            fragment.lastElementChild.appendChild(td);
        }

        tbody.appendChild(fragment);
    }

    renderCards() {
        const container = document.getElementById('container-cartelas');
        if (!container) return;

        container.innerHTML = '';
        this.resetPanelStyles();

        const cards = this.storage.getCards();
        const fragment = document.createDocumentFragment();

        cards.forEach((cardNumbers, index) => {
            const cardElement = this.createCardElement(cardNumbers, index);
            fragment.appendChild(cardElement);
        });

        container.appendChild(fragment);
        this.updatePanelStyles();
    }

    createCardElement(cardNumbers, index) {
        const wrapper = document.createElement('div');
        wrapper.className = 'cartela-wrapper';

        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn-remover';
        removeBtn.textContent = 'X';
        removeBtn.title = 'Remove card';
        removeBtn.addEventListener('click', () => this.handleRemoveCard(index));

        const table = document.createElement('table');
        const tbody = document.createElement('tbody');
        
        for (let i = 0; i < 25; i++) {
            if (i % 5 === 0) {
                const tr = document.createElement('tr');
                tbody.appendChild(tr);
            }

            const td = document.createElement('td');
            const num = cardNumbers[i];
            td.textContent = num;
            td.dataset.num = num;
            td.role = 'button';
            td.tabIndex = 0;

            if (this.storage.isMarked(num)) {
                td.classList.add('marcada');
            }

            td.addEventListener('click', () => this.handleCardClick(num));
            td.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    this.handleCardClick(num);
                    e.preventDefault();
                }
            });

            tbody.lastElementChild.appendChild(td);
        }

        table.appendChild(tbody);

        wrapper.appendChild(removeBtn);
        wrapper.appendChild(table);

        // Check for bingo
        if (this.bingoEngine.checkBingo(cardNumbers)) {
            wrapper.classList.add('bingo-winner');
        }

        return wrapper;
    }

    resetPanelStyles() {
        document.querySelectorAll('#tabela-75 td').forEach(td => {
            td.classList.add('inexistente');
            td.classList.remove('marcada', 'sorteado');
        });
    }

    updatePanelStyles() {
        this.storage.getCards().forEach(cardNumbers => {
            cardNumbers.forEach(num => {
                const panelTd = document.querySelector(`#tabela-75 [data-num="${num}"]`);
                if (panelTd) {
                    panelTd.classList.remove('inexistente');
                    if (this.storage.isMarked(num)) {
                        panelTd.classList.add('sorteado');
                    }
                }
            });
        });
    }

    handleCardClick(number) {
        this.storage.toggleMarked(number);
        this.debounceRender();
    }

    handlePanelClick(number) {
        this.storage.toggleMarked(number);
        this.debounceRender();
    }

    handleRemoveCard(index) {
        if (confirm('Excluir cartela?')) {
            this.storage.removeCard(index);
            this.renderCards();
        }
    }

    debounceRender() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this.renderCards(), 100);
    }

    updateStatus(message) {
        const element = document.getElementById('status-tela');
        if (element) element.textContent = message;
    }
}

export default UIManager;
