const colorOptions = document.querySelectorAll(".color-option")
const sizeInput = document.getElementById("size")
const sizeValue = document.getElementById("sizeValue")
const dotToggle = document.getElementById("dotToggle")
const lines = ["top", "bottom", "left", "right"].map((id) => document.getElementById(id))
const dot = document.getElementById("dot")
const valorantCodeInput = document.getElementById("valorantCodeInput")
const output = document.getElementById("output")
const themeToggle = document.getElementById("themeToggle")
const presetsGrid = document.getElementById("presets-grid")
const toast = document.getElementById("toast")

const innerLineThicknessInput = document.getElementById("innerLineThickness")
const innerLineThicknessValue = document.getElementById("innerLineThicknessValue")
const innerLineLengthInput = document.getElementById("innerLineLength")
const innerLineLengthValue = document.getElementById("innerLineLengthValue")
const innerLineOffsetInput = document.getElementById("innerLineOffset")
const innerLineOffsetValue = document.getElementById("innerLineOffsetValue")

const valorantColors = {
  1: "#00ff00", // Verde
  2: "#ffff00", // Amarelo
  3: "#00ffff", // Ciano
  4: "#0000ff", // Azul
  5: "#fc00fc", // Magenta
  6: "#ffffff", // Branco
  7: "#ff0000", // Vermelho
}

let selectedColorId = 1

const presets = [
  {
    name: "TenZ",
    author: "TenZ",
    code: "0;P;c;1;o;1;d;1;z;3;f;0;0t;0;0l;0;0o;0;0a;1;0f;0;1t;0;1l;0;1o;0;1a;0;1m;0;1f;0",
    color: 1,
    dot: true,
    size: 3,
  },
  {
    name: "ScreaM",
    author: "ScreaM",
    code: "0;P;c;5;o;1;d;1;z;1;f;0;0t;0;0l;0;0o;0;0a;1;0f;0;1t;0;1l;0;1o;0;1a;0;1m;0;1f;0",
    color: 5,
    dot: true,
    size: 1,
  },
  {
    name: "Shroud",
    author: "Shroud",
    code: "0;P;c;1;o;1;d;1;z;3;f;0;0t;1;0l;1;0o;1;0a;1;0f;0;1t;3;1l;1;1o;3;1a;1;1m;0;1f;0",
    color: 1,
    dot: true,
    size: 3,
  },
  {
    name: "Dot",
    author: "Classic",
    code: "0;P;c;7;o;1;d;1;z;1;f;0;0t;0;0l;0;0o;0;0a;0;0f;0;1t;0;1l;0;1o;0;1a;0;1m;0;1f;0",
    color: 7,
    dot: true,
    size: 1,
  },
  {
    name: "Plus",
    author: "Classic",
    code: "0;P;c;6;o;1;d;0;z;1;f;0;0t;1;0l;1;0o;1;0a;1;0f;0;1t;1;1l;1;1o;1;1a;1;1m;0;1f;0",
    color: 6,
    dot: false,
    size: 1,
  },
  {
    name: "Cross",
    author: "Classic",
    code: "0;P;c;2;o;1;d;0;z;3;f;0;0t;1;0l;2;0o;2;0a;1;0f;0;1t;1;1l;2;1o;2;1a;1;1m;0;1f;0",
    color: 2,
    dot: false,
    size: 3,
  },
]

function selectColor(colorId) {
  colorOptions.forEach((option) => {
    option.classList.remove("active")
  })

  const selectedOption = document.querySelector(`.color-option[data-color-id="${colorId}"]`)
  if (selectedOption) {
    selectedOption.classList.add("active")
  }

  selectedColorId = colorId

  updateCrosshair()
}

function parseValorantCode(code) {
  try {
    if (!code || !code.includes(";P;")) {
      throw new Error("Código inválido")
    }

    const parts = code.split(";")
    const params = {}

    for (let i = 0; i < parts.length - 1; i++) {
      if (parts[i] === "c" && i + 1 < parts.length) {
        params.colorId = Number.parseInt(parts[i + 1])
      }
      if (parts[i] === "o" && i + 1 < parts.length) {
        params.outline = parts[i + 1] === "1"
      }
      if (parts[i] === "d" && i + 1 < parts.length) {
        params.dot = parts[i + 1] === "1"
      }
      if (parts[i] === "z" && i + 1 < parts.length) {
        params.size = Number.parseInt(parts[i + 1])
      }
      if (parts[i] === "f" && i + 1 < parts.length) {
        params.fadeWithFiring = parts[i + 1] === "1"
      }
    }

    for (let i = 0; i < parts.length - 1; i++) {
      if (parts[i] === "0t" && i + 1 < parts.length) {
        params.innerLineThickness = Number.parseInt(parts[i + 1])
      }
      if (parts[i] === "0l" && i + 1 < parts.length) {
        params.innerLineLength = Number.parseInt(parts[i + 1])
      }
      if (parts[i] === "0o" && i + 1 < parts.length) {
        params.innerLineOffset = Number.parseInt(parts[i + 1])
      }
      if (parts[i] === "0a" && i + 1 < parts.length) {
        params.innerLineOpacity = parts[i + 1] === "1" ? 1 : 0
      }
    }

    for (let i = 0; i < parts.length - 1; i++) {
      if (parts[i] === "1t" && i + 1 < parts.length) {
        params.outerLineThickness = Number.parseInt(parts[i + 1])
      }
      if (parts[i] === "1l" && i + 1 < parts.length) {
        params.outerLineLength = Number.parseInt(parts[i + 1])
      }
      if (parts[i] === "1o" && i + 1 < parts.length) {
        params.outerLineOffset = Number.parseInt(parts[i + 1])
      }
      if (parts[i] === "1a" && i + 1 < parts.length) {
        params.outerLineOpacity = parts[i + 1] === "1" ? 1 : 0
      }
    }

    return params
  } catch (error) {
    console.error("Erro ao analisar código:", error)
    return null
  }
}

function updateCrosshairFromCode(code) {
  try {
    const params = parseValorantCode(code)

    if (!params) {
      throw new Error("Não foi possível analisar o código")
    }

    if (params.colorId && params.colorId >= 1 && params.colorId <= 7) {
      selectColor(params.colorId)
    } else {
      selectColor(1)
    }

    sizeInput.value = params.size || 1
    sizeValue.textContent = params.size || 1
    dotToggle.checked = params.dot || false

    innerLineThicknessInput.value = params.innerLineThickness || 1
    innerLineThicknessValue.textContent = params.innerLineThickness || 1

    innerLineLengthInput.value = params.innerLineLength || 6
    innerLineLengthValue.textContent = params.innerLineLength || 6

    innerLineOffsetInput.value = params.innerLineOffset || 0
    innerLineOffsetValue.textContent = params.innerLineOffset || 0

    updateCrosshair()

    showToast("Código importado com sucesso!")
  } catch (error) {
    console.error("Erro ao importar código:", error)
    showToast("Erro ao importar código. Verifique se o formato está correto.")
  }
}

function updateCrosshair() {
  const color = valorantColors[selectedColorId]
  const size = Number.parseInt(sizeInput.value)
  const innerThickness = Number.parseInt(innerLineThicknessInput.value)
  const innerLength = Number.parseInt(innerLineLengthInput.value)
  const innerOffset = Number.parseInt(innerLineOffsetInput.value)

  sizeValue.textContent = size

  lines.forEach((el) => {
    if (el.id === "top" || el.id === "bottom") {
      el.style.width = `${innerThickness}px`
    } else {
      el.style.height = `${innerThickness}px`
    }
  })

  document.getElementById("top").style.height = `${innerLength}px`
  document.getElementById("bottom").style.height = `${innerLength}px`
  document.getElementById("left").style.width = `${innerLength}px`
  document.getElementById("right").style.width = `${innerLength}px`

  document.getElementById("top").style.top = `calc(50% - ${innerLength + innerOffset}px)`
  document.getElementById("bottom").style.top = `calc(50% + ${innerOffset}px)`
  document.getElementById("left").style.left = `calc(50% - ${innerLength + innerOffset}px)`
  document.getElementById("right").style.left = `calc(50% + ${innerOffset}px)`

  lines.forEach((el) => (el.style.background = color))
  dot.style.background = color
  dot.style.display = dotToggle.checked ? "block" : "none"
}

function exportValorantCrosshair() {
  const hasDot = dotToggle.checked ? 1 : 0
  const size = Number.parseInt(sizeInput.value)
  const innerThickness = Number.parseInt(innerLineThicknessInput.value)
  const innerLength = Number.parseInt(innerLineLengthInput.value)
  const innerOffset = Number.parseInt(innerLineOffsetInput.value)

  let valorantCode = `0;P;c;${selectedColorId};o;1;d;${hasDot};z;${size};f;0;`

  valorantCode += `0t;${innerThickness};0l;${innerLength};0o;${innerOffset};0a;1;`

  valorantCode += `1t;1;1l;0;1o;0;1a;0;1m;0;1f;0`

  output.textContent = valorantCode
  showToast("Código gerado com sucesso!")
}

function copyToClipboard() {
  const text = output.textContent
  if (!text) {
    showToast("Nenhum código para copiar")
    return
  }

  navigator.clipboard
    .writeText(text)
    .then(() => {
      showToast("Código copiado para a área de transferência!")
    })
    .catch((err) => {
      console.error("Erro ao copiar: ", err)
      showToast("Erro ao copiar o código")
    })
}

function showToast(message) {
  toast.textContent = message
  toast.classList.add("show")
  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)
}

function toggleTheme() {
  const html = document.documentElement
  const currentTheme = html.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  html.classList.add("theme-transition")

  html.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)

  themeToggle.checked = newTheme === "light"

  setTimeout(() => {
    html.classList.remove("theme-transition")
  }, 500)
}

function createPresets() {
  presetsGrid.innerHTML = ""

  presets.forEach((preset) => {
    const presetCard = document.createElement("div")
    presetCard.className = "preset-card"
    presetCard.setAttribute("data-code", preset.code)

    const presetPreview = document.createElement("div")
    presetPreview.className = "preset-preview"

    const miniCrosshair = document.createElement("div")
    miniCrosshair.style.position = "relative"
    miniCrosshair.style.width = "50px"
    miniCrosshair.style.height = "50px"

    const topLine = document.createElement("div")
    topLine.style.position = "absolute"
    topLine.style.width = "2px"
    topLine.style.height = `${preset.size * 2}px`
    topLine.style.backgroundColor = valorantColors[preset.color]
    topLine.style.left = "50%"
    topLine.style.top = `calc(50% - ${preset.size * 2 + 2}px)`
    topLine.style.transform = "translateX(-50%)"

    const bottomLine = document.createElement("div")
    bottomLine.style.position = "absolute"
    bottomLine.style.width = "2px"
    bottomLine.style.height = `${preset.size * 2}px`
    bottomLine.style.backgroundColor = valorantColors[preset.color]
    bottomLine.style.left = "50%"
    bottomLine.style.top = "calc(50% + 2px)"
    bottomLine.style.transform = "translateX(-50%)"

    const leftLine = document.createElement("div")
    leftLine.style.position = "absolute"
    leftLine.style.height = "2px"
    leftLine.style.width = `${preset.size * 2}px`
    leftLine.style.backgroundColor = valorantColors[preset.color]
    leftLine.style.top = "50%"
    leftLine.style.left = `calc(50% - ${preset.size * 2 + 2}px)`
    leftLine.style.transform = "translateY(-50%)"

    const rightLine = document.createElement("div")
    rightLine.style.position = "absolute"
    rightLine.style.height = "2px"
    rightLine.style.width = `${preset.size * 2}px`
    rightLine.style.backgroundColor = valorantColors[preset.color]
    rightLine.style.top = "50%"
    rightLine.style.left = "calc(50% + 2px)"
    rightLine.style.transform = "translateY(-50%)"

    if (preset.dot) {
      const centerDot = document.createElement("div")
      centerDot.style.position = "absolute"
      centerDot.style.width = "4px"
      centerDot.style.height = "4px"
      centerDot.style.backgroundColor = valorantColors[preset.color]
      centerDot.style.borderRadius = "50%"
      centerDot.style.top = "50%"
      centerDot.style.left = "50%"
      centerDot.style.transform = "translate(-50%, -50%)"
      miniCrosshair.appendChild(centerDot)
    }

    miniCrosshair.appendChild(topLine)
    miniCrosshair.appendChild(bottomLine)
    miniCrosshair.appendChild(leftLine)
    miniCrosshair.appendChild(rightLine)

    presetPreview.appendChild(miniCrosshair)

    const presetName = document.createElement("div")
    presetName.className = "preset-name"
    presetName.textContent = preset.name

    const presetAuthor = document.createElement("div")
    presetAuthor.className = "preset-author"
    presetAuthor.textContent = preset.author

    presetCard.appendChild(presetPreview)
    presetCard.appendChild(presetName)
    presetCard.appendChild(presetAuthor)

    presetCard.addEventListener("click", () => {
      valorantCodeInput.value = preset.code
      updateCrosshairFromCode(preset.code)
    })

    presetsGrid.appendChild(presetCard)
  })
}

colorOptions.forEach((option) => {
  option.addEventListener("click", function () {
    const colorId = Number.parseInt(this.getAttribute("data-color-id"))
    selectColor(colorId)
  })
})

valorantCodeInput.addEventListener("input", () => {
  const code = valorantCodeInput.value
  if (code) {
    updateCrosshairFromCode(code)
  }
})

sizeInput.addEventListener("input", updateCrosshair)
dotToggle.addEventListener("change", updateCrosshair)
themeToggle.addEventListener("change", toggleTheme)

innerLineThicknessInput.addEventListener("input", function () {
  innerLineThicknessValue.textContent = this.value
  updateCrosshair()
})

innerLineLengthInput.addEventListener("input", function () {
  innerLineLengthValue.textContent = this.value
  updateCrosshair()
})

innerLineOffsetInput.addEventListener("input", function () {
  innerLineOffsetValue.textContent = this.value
  updateCrosshair()
})

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "dark"
  document.documentElement.setAttribute("data-theme", savedTheme)

  themeToggle.checked = savedTheme === "light"

  selectColor(1)

  createPresets()

  updateCrosshair()
})

