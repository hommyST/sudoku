const loadingElement = document.querySelector('.loading')
let completeSudoku = []
let sudoku = []
let count = 0
let attempt = 0
let difficult = 3

console.time('LOAD')

generate()
render()

// [x] Debug
// let completeSudoku = [
//   [8,1,9,2,7,3,6,4,5],
//   [5,4,2,1,9,6,8,7,3],
//   [6,7,3,5,8,4,2,9,1],
//   [7,9,8,6,5,1,3,2,4],
//   [3,2,1,7,4,9,5,6,8],
//   [4,5,6,3,2,8,7,1,9],
//   [1,3,4,8,6,2,9,5,7],
//   [9,6,5,4,3,7,1,8,2],
//   [2,8,7,9,1,5,4,3,6]
// ]
// prepareSudoku(1)
// render()


console.timeEnd('LOAD')


function generate() {
  let i = 0

  while (i < 9) {
    let isOk = false
    let attempt = 0

    while (isOk === false) {
      attempt++

      if (attempt > 10000) {
        completeSudoku.pop()
        i--
        break
      }

      let matrix = create3()
      isOk = check3(matrix, i)

      if (isOk) {
        completeSudoku.push(matrix)
        i++
      }
    }
  }

  completeSudoku = convertSudoku(completeSudoku)

  prepareSudoku(difficult)
}

function create3() {
  let variants = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  let matrix = []

  for (let ri = 0; ri < 3; ri++) {
    let row = []

    for (let ci = 0; ci < 3; ci++) {
      let i = rnd(0, variants.length - 1)
      let num = variants[i]
      variants.splice(i, 1)

      row.push(num)
    }

    matrix.push(row)
  }

  return matrix
}

function check3(matrix, index) {
  if (index === 0) return true
  let isOk = true
  let col = index % 3

  let leftMatrix1 = completeSudoku[index - 1]
  let leftMatrix2 = completeSudoku[index - 2]

  matrix.forEach((row, rowIndex) => {
    if (isOk === false) return

    row.forEach(num => {
      if (
        col > 0 
        && leftMatrix1[rowIndex].includes(num)
      ) isOk = false

      if (
        col === 2 
        && leftMatrix2 && leftMatrix2[rowIndex].includes(num)
      ) isOk = false
    })
  })

  if (index < 3) return isOk

  let upperMatrix1 = completeSudoku[index % 3]
  let upperMatrix2 = completeSudoku[index % 3 + 3]

  // for (let ri = 0; ri < matrix.length; ri++) {
  //   const row = matrix[ri];
  //   if (isOk === false) break
    
  //   for (let ci = 0; ci < row.length; ci++) {
  //     if (isOk === false) break
  //     const num = row[ci];
  //     if (num === upperMatrix1[0][ci]) isOk = false
  //     if (num === upperMatrix1[1][ci]) isOk = false
  //     if (num === upperMatrix1[2][ci]) isOk = false

  //     if (!upperMatrix2) break

  //     if (num === upperMatrix2[0][ci]) isOk = false
  //     if (num === upperMatrix2[1][ci]) isOk = false
  //     if (num === upperMatrix2[2][ci]) isOk = false
  //   }
  // }

  matrix.forEach((row) => {
    if (isOk === false) return

    row.forEach((num, colIndex) => {
      if (isOk === false) return

      if (num === upperMatrix1[0][colIndex]) isOk = false
      if (num === upperMatrix1[1][colIndex]) isOk = false
      if (num === upperMatrix1[2][colIndex]) isOk = false

      if (!upperMatrix2) return

      if (num === upperMatrix2[0][colIndex]) isOk = false
      if (num === upperMatrix2[1][colIndex]) isOk = false
      if (num === upperMatrix2[2][colIndex]) isOk = false
    })
  })

  return isOk
}

function prepareSudoku(difficulty) {
  sudoku = window.structuredClone(completeSudoku)
  for (let i = 0; i < difficulty * 10; i++) {
    let isEmpty = false
    while (isEmpty === false) {
      let ri = rnd(0, 8)
      let ci = rnd(0, 8)

      if (sudoku[ri][ci] != null) isEmpty = true
      sudoku[ri][ci] = null
    }
  }

  sudoku = sudoku.map((row, ri) => {
    let newRow = []
    row.forEach((num, ci) => {
      let cell = {
        isPlayer: num === null,
        value: num,
        row_index: ri,
        col_index: ci,
      }
      newRow.push(cell)
    })
    return newRow
  })
}

function convertSudoku(sudoku) {
  let converted = [
    [...sudoku[0][0], ...sudoku[1][0], ...sudoku[2][0]],
    [...sudoku[0][1], ...sudoku[1][1], ...sudoku[2][1]],
    [...sudoku[0][2], ...sudoku[1][2], ...sudoku[2][2]],

    [...sudoku[3][0], ...sudoku[4][0], ...sudoku[5][0]],
    [...sudoku[3][1], ...sudoku[4][1], ...sudoku[5][1]],
    [...sudoku[3][2], ...sudoku[4][2], ...sudoku[5][2]],

    [...sudoku[6][0], ...sudoku[7][0], ...sudoku[8][0]],
    [...sudoku[6][1], ...sudoku[7][1], ...sudoku[8][1]],
    [...sudoku[6][2], ...sudoku[7][2], ...sudoku[8][2]],
  ]

  return converted
}

function render() {
  sudoku.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      let cellElement = document.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex}"]`)
      cellElement.textContent = cell.value || ''
      if (cell.isPlayer) cellElement.classList.add('player_cell')
    })
  })
  loadingElement.dataset.loading = false
}



// Helpers
function rnd(min, max) {
  let rand = min + Math.random() * (max + 1 - min)
  return Math.floor(rand)
}

function shuffle(array) {
  count++
  let currentIndex = array.length
  let randomIndex = null

  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    let tmp = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = tmp
  }

  return array
}
