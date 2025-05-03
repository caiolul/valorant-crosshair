const colorInput = document.getElementById('color');
const sizeInput = document.getElementById('size');
const dotToggle = document.getElementById('dotToggle');
const lines = ['top', 'bottom', 'left', 'right'].map(id => document.getElementById(id));
const dot = document.getElementById('dot');

function updateCrosshair() {
    const color = colorInput.value;
    const size = parseInt(sizeInput.value);

    document.getElementById('top').style.top = `calc(50% - ${size + 2}px)`;
    document.getElementById('bottom').style.top = `calc(50% + 2px)`;
    document.getElementById('top').style.height =
        document.getElementById('bottom').style.height = `${size}px`;

    document.getElementById('left').style.left = `calc(50% - ${size + 2}px)`;
    document.getElementById('right').style.left = `calc(50% + 2px)`;
    document.getElementById('left').style.width =
        document.getElementById('right').style.width = `${size}px`;

    lines.forEach(el => el.style.background = color);
    dot.style.display = dotToggle.checked ? 'block' : 'none';
}

colorInput.addEventListener('input', updateCrosshair);
sizeInput.addEventListener('input', updateCrosshair);
dotToggle.addEventListener('change', updateCrosshair);

updateCrosshair();

function exportConfig() {
    const config = {
        color: colorInput.value,
        size: sizeInput.value,
        showDot: dotToggle.checked
    };
    document.getElementById('output').textContent = JSON.stringify(config, null, 2);
}

function closestValorantColor(hex) {
    const colors = {
        1: '#00ff00', // Verde
        2: '#ffff00', // Amarelo
        3: '#00ffff', // Ciano
        4: '#0000ff', // Azul
        5: '#ff00ff', // Magenta
        6: '#ffffff', // Branco
        7: '#ff0000', // Vermelho
    };

    const hexToRGB = h => {
        let r = parseInt(h.slice(1, 3), 16);
        let g = parseInt(h.slice(3, 5), 16);
        let b = parseInt(h.slice(5, 7), 16);
        return [r, g, b];
    };

    const dist = (c1, c2) =>
        Math.sqrt(c1.reduce((acc, v, i) => acc + (v - c2[i]) ** 2, 0));

    const input = hexToRGB(hex.toLowerCase());
    let closest = 1;
    let minDist = Infinity;

    for (let id in colors) {
        const d = dist(input, hexToRGB(colors[id]));
        if (d < minDist) {
            minDist = d;
            closest = parseInt(id);
        }
    }

    return closest;
}

function exportValorantCrosshair() {
    const color = colorInput.value;
    const dot = dotToggle.checked ? 1 : 0;
    const size = parseInt(sizeInput.value);

    const colorId = closestValorantColor(color);

    const valorantCode = `0;P;c;${colorId};o;1;d;${dot};z;1;a;1;f;0;0t;${size};0l;0;0o;3;0a;1;0f;0;1t;0;1l;0;1o;${size};1a;1;1m;0;1f;0`;

    document.getElementById('output').textContent = valorantCode;
}
