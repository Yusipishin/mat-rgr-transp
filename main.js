const table = document.getElementById("table");
let countIsx, countVix, countVars = 0, matrIsx = [], matrMin = [], matrSpros = [], matrObiem = [];
let colList = [], rowList = []

const createTable = () => {
    countIsx = parseInt(document.getElementById("countIsx").value);
    countVix = parseInt(document.getElementById("countVix").value);

    while (table.rows.length > 0) {
        table.deleteRow(0);
    }

    table.RowCount = countIsx + 1;
    table.ColCount = countVix + 1;

    for (let i = 0; i < table.RowCount; i++) {
        let row = table.insertRow();
        for (let j = 0; j < table.ColCount; j++) {
            if (i === table.RowCount - 1 && j === table.ColCount - 1) break
            let cell = row.insertCell();
            cell.insertAdjacentHTML('beforeend', `
                    <input class="table-input" type="text">
                `)
        }
    }
}

const createTableBtn = document.querySelector('#btn-create')
createTableBtn.addEventListener('click', () => createTable())

const checkBalance = () => {
    let sRow = 0, sCol = 0;
    for (let i = 0; i < table.RowCount; i++) {
        for (let j = 0; j < table.ColCount; j++) {
            if (i === table.RowCount - 1 && j !== table.ColCount - 1) {
                sRow += parseInt(table.rows[i].cells[j].querySelector('.table-input').value);
            }
            if (j === table.ColCount - 1 && i !== table.RowCount - 1) {
                sCol += parseInt(table.rows[i].cells[j].querySelector('.table-input').value);
            }
        }
    }

    if (sRow === sCol) {
        alert('Баланс не нарушен')
    }
    else if (sRow < sCol) {
        alert('Баланс нарушен')
        table.ColCount += 1
        for (let i = 0; i < table.RowCount; i++) {
            for (let j = 0; j < table.ColCount; j++) {
                if (j === table.ColCount - 2) {
                    let cell = table.rows[i].insertCell(table.ColCount - 2);
                    cell.innerHTML = `<input class="table-input" type="text">`;
                    if (i !== table.RowCount - 1) {
                        table.rows[i].cells[table.ColCount - 2 ].querySelector('.table-input').value = 0
                    }
                }
            }
        }
        table.rows[table.RowCount - 1].cells[table.ColCount - 2 ].querySelector('.table-input').value = sCol - sRow
        alert('Сбалансируем')
    }
    else if (sRow > sCol) {
        alert('Баланс нарушен')
        table.RowCount += 1
        let row = table.insertRow(table.RowCount - 2);
        for (let j = 0; j < table.ColCount; j++) {
            let cell = row.insertCell();
            cell.insertAdjacentHTML('beforeend', `
                <input class="table-input" type="text">
            `)
            if (j !== table.ColCount - 1) {
                table.rows[table.RowCount - 2].cells[j].querySelector('.table-input').value = 0
            }
        }
        table.rows[table.RowCount - 2].cells[table.ColCount - 1].querySelector('.table-input').value = sRow - sCol
        alert('Сбалансируем')
    }
}

const checkOptimal = () => {
    let UList = [], VList = [], flag = true;

    // Потенциалы поставщиков
    for (let i = 0; i < countIsx; i++) UList.push(null)
    UList[0] = 0;
    // Потенциалы потребителей
    for (let i = 0; i < countVix; i++) VList.push(null)
    while (flag) {
        flag = false;
        for (let i = 0; i < countIsx; i++) {
            for (let j = 0; j < countVix; j++) {
                if (matrMin[i][j] || matrMin[i][j] === 0) {
                    if (UList[i] !== null && VList[j] === null) {
                        VList[j] = matrIsx[i][j] - UList[i];
                    } else if (UList[i] === null && VList[j] !== null) {
                        UList[i] = matrIsx[i][j] - VList[j];
                    } else if (UList[i] === null && VList[j] === null) {
                        flag = true;
                    }
                }
            }
        }
    }

    // Проверка на оптимальность решения
    let isOptimal = true;
    for (let i = 0; i < countIsx; i++) {
        for (let j = 0; j < countVix; j++) {
            if (!matrMin[i][j]) {
                let diff = matrIsx[i][j] - (UList[i] + VList[j]);
                console.log('ISX - (U + V) = ', diff)
                if (diff < 0) {
                    isOptimal = false;
                    break;
                }
            }
        }
        if (!isOptimal) {
            break;
        }
    }

    console.log('Список U: ', UList)
    console.log('Список V: ', VList)

    if (isOptimal) {
        alert('Решение является оптимальным');
    } else {
        alert('Решение не является оптимальным');
    }
}

function minValue(matr) {
    let minimum = 10e5;
    let row, col;
    for (let i = 0; i < countIsx; i++) {
        for (let j = 0; j < countVix; j++) {
            if (matr[i][j] < minimum && !rowList.includes(i) && !colList.includes(j)) {
                minimum = parseInt(matr[i][j]);
                row = i;
                col = j;
            } else if (matr[i][j] < minimum && rowList.includes(i) && colList.includes(j)) {

            }
        }
    }
    return { row: row, col: col };
}

const solveTask = () => {
    checkBalance()

    countIsx = table.RowCount - 1;
    countVix = table.ColCount - 1;

    matrIsx = new Array(countIsx).fill(null).map(() => new Array(countVix).fill(null));
    matrMin = new Array(countIsx).fill(null).map(() => new Array(countVix).fill(null));

    for (let i = 0; i <= countIsx; i++) {
        for (let j = 0; j <= countVix; j++) {
            if ((i !== countIsx) && (j !== countVix)) {
                const val = parseInt(table.rows[i].cells[j].querySelector('.table-input').value)
                matrIsx[i][j] = val;
            } else if (i === countIsx && j !== countVix) {
                const val = parseInt(table.rows[i].cells[j].querySelector('.table-input').value)
                matrObiem.push(val)
            } else if (j === countVix && i !== countIsx) {
                const val = parseInt(table.rows[i].cells[j].querySelector('.table-input').value)
                matrSpros.push(val)
            }
        }
    }

    let minVal,  totalSum = 0;
    while (countVars !== countIsx + countVix - 1) {
        minVal = minValue(matrIsx);
        const col = minVal.col
        const row = minVal.row

        console.log('Матрица спроса: ',matrSpros)
        console.log('Матрица объёма: ', matrObiem)
        console.log('Расположение min элем: ',minVal)

        const value = Math.min(matrSpros[row], matrObiem[col])
        console.log('Берём стоимость:  ', value)
        matrSpros[row] = matrSpros[row] - value;
        matrObiem[col] = matrObiem[col] - value;

        if (matrSpros[row] > matrObiem[col]) {
            colList.push(col);
        } else if (matrSpros[row] <= matrObiem[col]) {
            rowList.push(row);
        }

        matrMin[row][col] = value;
        console.log('Матрица стоимостей: ',matrMin);
        countVars += 1;
    }

    for (let i = 0; i < table.RowCount; i++) {
        for (let j = 0; j < table.ColCount; j++) {
            if ((i !== countIsx) && (j !== countVix)) {
                if (matrMin[i][j] || matrMin[i][j] === 0) {
                    table.rows[i].cells[j].querySelector('.table-input').value = matrIsx[i][j] + '[' + matrMin[i][j] + ']'
                }
                totalSum += matrMin[i][j] * matrIsx[i][j]
            } else if (i === countIsx && j !== countVix) {
                table.rows[i].cells[j].querySelector('.table-input').value = matrObiem[j];
            } else if (j === countVix && i !== countIsx) {
                table.rows[i].cells[j].querySelector('.table-input').value = matrSpros[i];
            }
        }
    }

    document.querySelector('#countCost').value = totalSum;

    checkOptimal();
}

const solveBtn = document.querySelector('#btn-solve')
solveBtn.addEventListener('click', () => solveTask())
