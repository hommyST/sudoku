const table = document.querySelector('.game__table')
const cells = document.querySelectorAll('.game__cell')
const numButtons = document.querySelector('.num_buttons')

let currentNum = null

disableBtns()

// todo счётчик ошибок
// todo экран победы
// todo перезагрузка судоку

document.addEventListener('win', ev => {
  console.log('WIN event', ev);
})

table.addEventListener('click', ev => {
  let target = ev.target
  if (!target.matches('.player_cell')) return
  if (!currentNum) return

  setNumInTable(target)
  let isNumTurnOff = disableBtns()
  if (isNumTurnOff) {
    let currentBtn = document.querySelector(`button[data-num="${currentNum}"]`)
    currentBtn.classList.remove('current')
    currentNum = null
  }
})

table.addEventListener('contextmenu', ev => {
  ev.preventDefault()
  let target = ev.target
  if (!target.matches('.player_cell')) return

  let cell = sudoku[target.dataset.row][target.dataset.col]
  if (cell.isPlayer) {
    cell.value = null
    target.classList.remove('num_highlight')
  }
  disableBtns()
  render()
})

cells.forEach(cellElement => {
  cellElement.addEventListener('mouseenter', ev => {
    let target = ev.target
    let currNum = target.textContent
    
    cells.forEach(cellElement => {
      let checkNum = cellElement.textContent
      if (cellElement.dataset.row === target.dataset.row) cellElement.classList.add('highlight')
      if (cellElement.dataset.col === target.dataset.col) cellElement.classList.add('highlight')
      // if (checkNum !== '' && currNum === checkNum) cellElement.classList.add('num_highlight')
    })
  })

  cellElement.addEventListener('mouseleave', ev => {
    cells.forEach(cellElement => {
      cellElement.classList.remove('highlight')
    })
  })
})



numButtons.addEventListener('click', ev => {
  let target = ev.target
  if (!target.dataset.num) return

  currentNum = Number(target.dataset.num)
  changeCurrentBtn(target)

  cells.forEach(cellElement => {
    cellElement.classList.remove('num_highlight')

    if (cellElement.textContent == currentNum) cellElement.classList.add('num_highlight')
  })
})


function changeCurrentBtn(target) {
  Array.from(numButtons.children).forEach(btn => {
    btn.classList.remove('current')
  })
  
  target.classList.add('current')
}

function setNumInTable(cellElement) {
  let cell = sudoku[cellElement.dataset.row][cellElement.dataset.col]

  if (cell.isPlayer === false) return
  let rightNum = completeSudoku[cell.row_index][cell.col_index]
  
  cell.value = currentNum
  if (currentNum !== rightNum) cellElement.classList.add('incorrect_num')
  else cellElement.classList.remove('incorrect_num')

  cellElement.classList.add('num_highlight')
  render()
  let isWin = winCheck()

  console.log(`WINSTATE: %c${isWin}`, 'color: red');
  if (isWin) {
    let winEvent = new Event('win')
    document.dispatchEvent(winEvent)
  }
}

function disableBtns() {
  let isNumTurnOff = false

  Array.from(numButtons.children).forEach(btn => {
    let btnNum = Number(btn.dataset.num)
    let isLeft = false

    sudoku.forEach(row => {
      let cell = row.find(cell => cell.value === btnNum)
      if (!cell) isLeft = true
    })

    if (
        isNumTurnOff !== true
        && btn.disabled === false
        && isLeft === false
        && currentNum === btnNum
    )  isNumTurnOff = true

    btn.disabled = !isLeft
  })

  return isNumTurnOff
}

function winCheck() {
  let isWin = true
  
  sudoku.forEach(row => {
    row.forEach(cell => {
      if (isWin === false) return
      if (cell.isPlayer === false) return

      let rigthNum = completeSudoku[cell.row_index][cell.col_index]
      if (rigthNum !== cell.value) isWin = false
    })
  })

  return isWin
}