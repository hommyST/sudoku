const themes = {
  default: {
    'main-clr': '#4caf50',
    'main-bg-color': '#212121',
    'cell-text': '#888',
    'highlight-bg': '#004d40',
    'highlight-text': '#8bc34a',
    'player-text': '#03a9f4',
    'incorrect-text': '#f44336',
    'btn-text': '#eee',
    'btn-bg': '#1b5e20',
    'btn-current': '#03a9f4',
  },
  purple: {
    'main-clr': '#9c27b0',
    'main-bg-color': '#212121',
    'cell-text': '#757575',
    'highlight-bg': '#4527a0',
    'highlight-text': '#e040fb',
    'player-text': '#03a9f4',
    'incorrect-text': '#f44336',
    'btn-text': '#fafafa',
    'btn-bg': '#4a148c',
    'btn-current': '#03a9f4',
  },
  orange: {
    'main-clr': '#ff9800',
    'main-bg-color': '#212121',
    'cell-text': '#757575',
    'highlight-bg': '#bf360c',
    'highlight-text': '#fafafa',
    'player-text': '#03a9f4',
    'incorrect-text': '#f44336',
    'btn-text': '#fafafa',
    'btn-bg': '#bf360c',
    'btn-current': '#03a9f4',
  },
}

const select = document.querySelector('#color-scheme')

let savedTheme = localStorage.getItem('theme')
if (savedTheme) {
  select.value = savedTheme
  applyColors(themes[savedTheme])
}
else applyColors(themes.default)


select.addEventListener('input', () => {
  applyColors(themes[select.value])
  localStorage.setItem('theme', select.value)
})


function applyColors(scheme) {
  let game = document.querySelector('.game')
  for (key in scheme) {
    game.style.setProperty(`--${key}`, scheme[key])
  }
}