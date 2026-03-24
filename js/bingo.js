function verificarBingo(cartela) {

    const grid = [];
    for (let i = 0; i < 5; i++) {
        grid.push(cartela.slice(i * 5, i * 5 + 5));
    }

    const check = arr => arr.every(n => n === "XX" || marcados.has(n));

    for (let i = 0; i < 5; i++) if (check(grid[i])) return true;

    for (let i = 0; i < 5; i++) {
        let col = [];
        for (let j = 0; j < 5; j++) col.push(grid[j][i]);
        if (check(col)) return true;
    }

    let d1 = [], d2 = [];

    for (let i = 0; i < 5; i++) {
        d1.push(grid[i][i]);
        d2.push(grid[i][4 - i]);
    }

    return check(d1) || check(d2);
}
