/**
 * Core bingo logic for checking winning conditions
 */
class BingoEngine {
    constructor(storage) {
        this.storage = storage;
    }

    checkBingo(cardNumbers) {
        if (!Array.isArray(cardNumbers) || cardNumbers.length !== 25) {
            return false;
        }

        const grid = this.createGrid(cardNumbers);
        const marked = this.storage.getMarked();
        const markedSet = new Set(marked);

        return (
            this.checkRows(grid, markedSet) ||
            this.checkColumns(grid, markedSet) ||
            this.checkDiagonals(grid, markedSet)
        );
    }

    createGrid(numbers) {
        const grid = [];
        for (let i = 0; i < 5; i++) {
            grid.push(numbers.slice(i * 5, (i + 1) * 5));
        }
        return grid;
    }

    checkRows(grid, markedSet) {
        return grid.some(row => row.every(num => num === 'XX' || markedSet.has(num)));
    }

    checkColumns(grid, markedSet) {
        for (let col = 0; col < 5; col++) {
            const column = grid.map(row => row[col]);
            if (column.every(num => num === 'XX' || markedSet.has(num))) {
                return true;
            }
        }
        return false;
    }

    checkDiagonals(grid, markedSet) {
        const diagonal1 = Array.from({length: 5}, (_, i) => grid[i][i]);
        const diagonal2 = Array.from({length: 5}, (_, i) => grid[i][4 - i]);

        return (
            diagonal1.every(num => num === 'XX' || markedSet.has(num)) ||
            diagonal2.every(num => num === 'XX' || markedSet.has(num))
        );
    }
}

export default BingoEngine;
