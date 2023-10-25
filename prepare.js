const loadingElement = document.querySelector('.loading')
let completeSudoku = []
let sudoku = []
let count = 0
let attempt = 0
let difficult = 3

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
      let m1 = create3()
      isOk = check3(m1, i)
      if (isOk) {
        completeSudoku.push(m1)
        i++
      }
    }
  }
  let tmp = [
    [...completeSudoku[0][0], ...completeSudoku[1][0], ...completeSudoku[2][0]],
    [...completeSudoku[0][1], ...completeSudoku[1][1], ...completeSudoku[2][1]],
    [...completeSudoku[0][2], ...completeSudoku[1][2], ...completeSudoku[2][2]],

    [...completeSudoku[3][0], ...completeSudoku[4][0], ...completeSudoku[5][0]],
    [...completeSudoku[3][1], ...completeSudoku[4][1], ...completeSudoku[5][1]],
    [...completeSudoku[3][2], ...completeSudoku[4][2], ...completeSudoku[5][2]],

    [...completeSudoku[6][0], ...completeSudoku[7][0], ...completeSudoku[8][0]],
    [...completeSudoku[6][1], ...completeSudoku[7][1], ...completeSudoku[8][1]],
    [...completeSudoku[6][2], ...completeSudoku[7][2], ...completeSudoku[8][2]],
  ]
  completeSudoku = tmp

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
      if (col > 0 && leftMatrix1[rowIndex].includes(num)) isOk = false
      if (col === 2 && leftMatrix2 && leftMatrix2[rowIndex].includes(num)) isOk = false
    })
  })

  if (index < 3) return isOk

  let upperMatrix1 = completeSudoku[index % 3]
  let upperMatrix2 = completeSudoku[index % 3 + 3]

  matrix.forEach((row, rowIndex) => {
    row.forEach((num, colIndex) => {
      if (num === upperMatrix1[0][colIndex]) isOk = false
      if (num === upperMatrix1[1][colIndex]) isOk = false
      if (num === upperMatrix1[2][colIndex]) isOk = false

      if (upperMatrix2) {
        if (num === upperMatrix2[0][colIndex]) isOk = false
        if (num === upperMatrix2[1][colIndex]) isOk = false
        if (num === upperMatrix2[2][colIndex]) isOk = false
      }
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
