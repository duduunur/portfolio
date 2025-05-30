// ---------------------------------------------------- Globale Variablen und Objekte ----------------------------------------------------

let bitLength = 16; // Standartwert 16
let dimension = 2;  // Standartwert 2
let layout = "xyz"; // Standartwert xyz

let maxCoordinateValue = 0n;

const pointA = {
    id: 'a',
    x: null,
    y: null,
    z: null, 
    mortonCode: null
};

const pointB = {
    id: 'b',
    x: null,
    y: null,
    z: null, 
    mortonCode: null
};

// ------------------------------------- Einstellungen verwalten und Benutzeroberflaeche aktualisieren ------------------------------------

function displayMaxCoord() {
    maxCoordContainer = document.getElementById("maxCoord");

    // berechne maxCoord
    maxCoordinateValue = (1n << (BigInt(bitLength) / BigInt(dimension))) - 1n;

    // maxCoord anzeigen
    maxCoordContainer.innerText = `Maximum Coordinate Value: ${maxCoordinateValue.toString()}`;
}

// Eingabefelder leeren
function clearCoordinateInputs(point) {
    document.getElementById(`${point.id}-x`).value = "";
    document.getElementById(`${point.id}-y`).value = "";
    const zInput = document.getElementById(`${point.id}-z`);
    if (zInput) {
        zInput.value = "";
    }
}

// Stencil Zeichenflaeche und Morton-Code Liste leeren
function clearStencil(point) {
    document.getElementById(`stencilContainer-${point.id}`).classList.remove('expanded');

    const canvas = document.getElementById(`canvasStencil-${point.id}`);
    const resultDiv = document.getElementById(`stencilResult-${point.id}`);
    
    // Canvas leeren
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // Inhalt des Ergebnisfelds (Morton-Codes der benachbarten Punkte) leeren
    if (resultDiv) {
        resultDiv.innerHTML = '';
        resultDiv.style.removeProperty('height');
        resultDiv.style.resize = 'none';
    }
}

function clearContainers() {
    // Eingabefelder, Ergebnisfelder, Errorfelder, Stencilfelder leeren
    clearCoordinateInputs(pointA);
    clearCoordinateInputs(pointB);

    // Errorfelder leeren und roten Rand entfernen
    document.getElementById(`a-xError`).innerHTML = '';
    document.getElementById(`a-x`).classList.remove('input-error');
    document.getElementById(`a-yError`).innerHTML = '';
    document.getElementById(`a-y`).classList.remove('input-error');
    document.getElementById(`a-zError`).innerHTML = '';
    document.getElementById(`a-z`).classList.remove('input-error');

    document.getElementById(`b-xError`).innerHTML = '';
    document.getElementById(`b-x`).classList.remove('input-error');
    document.getElementById(`b-yError`).innerHTML = '';
    document.getElementById(`b-y`).classList.remove('input-error');
    document.getElementById(`b-zError`).innerHTML = '';
    document.getElementById(`b-z`).classList.remove('input-error');

    // Ergebnisfelder leeren
    document.getElementById(`a-resultForLoop`).innerHTML = '';
    document.getElementById(`a-resultMagicBits`).innerHTML = '';
    document.getElementById(`b-resultForLoop`).innerHTML = '';
    document.getElementById(`b-resultMagicBits`).innerHTML = '';

    document.getElementById(`resultAddition`).innerHTML = '';
    document.getElementById(`resultSubtraction`).innerHTML = '';
    document.getElementById(`additionError`).innerHTML = '';
    document.getElementById(`subtractionError`).innerHTML = '';

    // Addition und Subtraktion Container Höhe zurücksetzen und nicht mehr größenveränderbar machen
    document.getElementById(`resultAddition`).style.removeProperty('height');
    document.getElementById(`resultSubtraction`).style.removeProperty('height');
    document.getElementById(`resultAddition`).style.resize = 'none';
    document.getElementById(`resultSubtraction`).style.resize = 'none';

    // Point Container höhe zurücksetzen und nicht mehr größenveränderbar machen
    document.getElementById(`point-a`).style.removeProperty('height');
    document.getElementById(`point-b`).style.removeProperty('height');
    document.getElementById(`point-a`).style.resize = 'none';
    document.getElementById(`point-b`).style.resize = 'none';

    // Stencil Container leeren
    clearStencil(pointA);
    clearStencil(pointB);

    // Werte in den Objekten zurücksetzen
    pointA.x = null;
    pointA.y = null;
    pointA.z = null;
    pointA.mortonCode = null;
    
    pointB.x = null;
    pointB.y = null;
    pointB.z = null;
    pointB.mortonCode = null;
}


// Prüfen, ob die eingegebenen Koordinaten gültig sind
function checkCoordinateLimits(point) {
    const xInput = document.getElementById(`${point.id}-x`);
    const yInput = document.getElementById(`${point.id}-y`);
    const zInput = document.getElementById(`${point.id}-z`);
    const zInputContainer = document.getElementById(`${point.id}-zInput`);

    const xError = document.getElementById(`${point.id}-xError`);
    const yError = document.getElementById(`${point.id}-yError`);
    const zError = document.getElementById(`${point.id}-zError`);

    const x = xInput && xInput.value.trim() ? xInput.value.trim() : null;
    const y = yInput && yInput.value.trim() ? yInput.value.trim() : null;
    const z = zInput && zInput.value.trim() ? zInput.value.trim() : null;

    let hasError = false;

    // Hilfsfunktion zur Prüfung der Eingabe (keine zahl, input mit komma, negative zahl)
    function isInvalidCoordinate(value) {
        return isNaN(value) || value.includes(".") || value < 0;
    }

    // Prüfe x
    if (x == null || isInvalidCoordinate(x) || BigInt(x) > maxCoordinateValue) {
        xInput.classList.add('input-error');
        xError.textContent = "Enter an integer between 0 and "+ maxCoordinateValue;
        xError.style.display = "block";
        hasError = true;
    } else {
        xInput.classList.remove('input-error');
        xError.textContent = "";
        xError.style.display = "none";
    }

    // Prüfe y
    if (y == null || isInvalidCoordinate(y) || BigInt(y) > maxCoordinateValue) {
        yInput.classList.add('input-error');
        yError.textContent = "Enter an integer between 0 and "+ maxCoordinateValue;
        yError.style.display = "block";
        hasError = true;
    } else {
        yInput.classList.remove('input-error');
        yError.textContent = "";
        yError.style.display = "none";
    }

    // Prüfe z, falls vorhanden
    if (!zInputContainer.classList.contains("hidden")) {
        if (z == null || isInvalidCoordinate(z) || BigInt(z) > maxCoordinateValue) {
            zInput.classList.add('input-error');
            zError.textContent = "Enter an integer between 0 and "+ maxCoordinateValue;
            zError.style.display = "block";
            hasError = true;
        } else {
            zInput.classList.remove('input-error');
            zError.textContent = "";
            zError.style.display = "none";
        }
    }

    // wenn kein Fehler (gültige Eingabe), gebe true zurück
    return !hasError;
}

// Eingabefelder an Dimension anpassen
function updateCoordinateFields(point) {
    dimension = parseInt(document.getElementById("dimension").value);
    layout = document.getElementById("layout").value;
    const layoutContainer = document.getElementById("layoutContainer");
    const zInput = document.getElementById(`${point.id}-zInput`);
    const zLabel = document.getElementById(`${point.id}-zLabel`);
    const zError = document.getElementById(`${point.id}-zError`);

    if (dimension === 3) {
        zLabel.classList.remove('hidden');
        zInput.classList.remove('hidden');
        zError.classList.remove('hidden');
        layoutContainer.classList.remove("hidden");
    } else {
        zLabel.classList.add('hidden');
        zInput.classList.add('hidden');
        zError.classList.add('hidden');
        layoutContainer.classList.add("hidden"); 
        layout = 'xyz'; // bei Auswahl der dimension 2, wird das layout "zurückgesetzt" auf xyz
    }

    // Reihenfolge der Eingabefelder in Abhängigkeit vom Layout aktualisieren 
    updateCoordinateInputOrder(layout, point);
}

// Reihenfolge der Eingabefelder in Abhängigkeit vom Layout aktualisieren 
function updateCoordinateInputOrder(layout, point) {
    const xLabel = document.querySelector(`label[for="${point.id}-x"]`);
    const yLabel = document.querySelector(`label[for="${point.id}-y"]`);
    const zLabel = document.querySelector(`label[for="${point.id}-z"]`);

    const xGroup = document.querySelector(`#${point.id}-x`).closest('.input-group');
    const yGroup = document.querySelector(`#${point.id}-y`).closest('.input-group');
    const zGroup = document.querySelector(`#${point.id}-zInput`);

    const calculateButton = document.getElementById(`${point.id}-calculateButton`);
    const coordinateInputs = document.getElementById(`${point.id}-coordinateInputs`);

    // Layout anpassen
    if (layout === 'xyz') {
        coordinateInputs.appendChild(xLabel);
        coordinateInputs.appendChild(xGroup);
        coordinateInputs.appendChild(yLabel);
        coordinateInputs.appendChild(yGroup);
        if (zLabel) coordinateInputs.appendChild(zLabel);
        if (zGroup) coordinateInputs.appendChild(zGroup);
        coordinateInputs.appendChild(calculateButton);
    } else if (layout === 'zyx') {
        coordinateInputs.appendChild(zLabel);
        coordinateInputs.appendChild(zGroup);
        coordinateInputs.appendChild(yLabel);
        coordinateInputs.appendChild(yGroup);
        coordinateInputs.appendChild(xLabel);
        coordinateInputs.appendChild(xGroup);
        coordinateInputs.appendChild(calculateButton);
    }
}

// Einstellungen verwalten
function handleSettingsChange() {
    bitLength = parseInt(document.getElementById("bitLength").value);
    dimension = parseInt(document.getElementById("dimension").value);
    layout = document.getElementById("layout").value;

    clearContainers();
    updateCoordinateFields(pointA); 
    updateCoordinateFields(pointB);
    displayMaxCoord();

    if(!document.getElementById('a-forLoopCodeContainer').classList.contains("hidden")) {
        closeCode('a-forLoopCodeContainer', 'a-magicBitsHeader', 'a-show-code-btn', 'a-resultMagicBits');  
    }

    if(!document.getElementById('a-magicBitsCodeContainer').classList.contains("hidden")) {
        closeCode('a-magicBitsCodeContainer', 'a-forLoopHeader','a-show-code-btn2','a-resultForLoop');
    }

    if(!document.getElementById('b-forLoopCodeContainer').classList.contains("hidden")) {
        closeCode('b-forLoopCodeContainer', 'b-magicBitsHeader', 'b-show-code-btn', 'b-resultMagicBits');  
    }
    
    if(!document.getElementById('b-magicBitsCodeContainer').classList.contains("hidden")) {
        closeCode('b-magicBitsCodeContainer', 'b-forLoopHeader','b-show-code-btn2','b-resultForLoop');
    }
}

// -------------------------------------------------- Berechnung des Morton-Code --------------------------------------------------------------

function calculateMortonCode(point) {
    // Ergebnisse zurücksetzen
    document.getElementById(`${point.id}-resultForLoop`).innerHTML = '';
    document.getElementById(`${point.id}-resultMagicBits`).innerHTML = '';

    // Point Container wieder klein und nicht mehr größenveränderbar
    const pointContainer = document.getElementById(`point-${point.id}`);
    pointContainer.style.removeProperty('height');
    pointContainer.style.resize = 'none';

    // Stencil leeren
    clearStencil(point) 

    // Additions- und Subtraktionsergebnisse und Fehlermeldungen leeren
    document.getElementById(`resultAddition`).innerHTML = '';
    document.getElementById(`resultSubtraction`).innerHTML = '';
    document.getElementById(`additionError`).innerHTML = '';
    document.getElementById(`subtractionError`).innerHTML = '';

    // Addition und Subtraktion Container Höhe zurücksetzen und nicht mehr größenveränderbar
    document.getElementById(`resultAddition`).style.removeProperty('height');
    document.getElementById(`resultSubtraction`).style.removeProperty('height');
    document.getElementById(`resultAddition`).style.resize = 'none';
    document.getElementById(`resultSubtraction`).style.resize = 'none';

    // Koordinaten überprüfen
    if (checkCoordinateLimits(point) == false) {
        console.log("No calculation for point", point.id);
        return;
    }

    // Höhe und Größenveränderbarkeit für Ergebnisse
    pointContainer.style.height = '500px';
    pointContainer.style.resize = 'vertical';

    // Koordinatenwerte aus html holen
    const x = parseInt(document.getElementById(`${point.id}-x`).value);
    const y = parseInt(document.getElementById(`${point.id}-y`).value);
    const z = dimension === 3 ? (parseInt(document.getElementById(`${point.id}-z`).value)) : 0;

    // Koordinatenwerte in point objekt speichern
    point.x = x;
    point.y = y;
    point.z = dimension === 3 ? z : null; // Z nur speichern, wenn Dimension 3

    // Berechnungen durchführen
    const mortonCode = interleaveForLoop(point);
    interleaveMagicBits(point);

    // Morton-Codes in Objekt speichern
    point.mortonCode = mortonCode;

    // Stencil generieren
    generateStencil(`${point.id}`);
}

// ---------------------------------------------- Verschränken mit For-Schleife ----------------------------------------------------------


function interleaveForLoop(point) {
    let mortonCode = BigInt(0);
    const bitsPerCoord = parseInt(bitLength / dimension); 

    const resultContainer = document.getElementById(`${point.id}-resultForLoop`);

    // Koordinaten in ein Array speichern
    let coords = [];
    if (dimension === 3) {
        coords = layout === "xyz" ? [point.x, point.y, point.z] : [point.z, point.y, point.x];
    } else {
        coords = [point.x, point.y];
    }

    // Koordinaten styling (binär und gefärbt)
    let binaryCoordinates = '';
    for (let i = 0; i < coords.length; i++) {
        const coord = coords[i];
        const colorClass = `color-${layout[i]}`; // Farben basierend auf Index
        const binaryString = `<span class="${colorClass}">${coord.toString(2).padStart(bitsPerCoord, '0')}</span>`;
        binaryCoordinates += `<div class="binary">${layout[i]} = ${binaryString} (decimal: ${coord})</div>`;
    }

    // Koordinaten ausgeben
    const coordinates = document.createElement("div");
    coordinates.innerHTML = `${binaryCoordinates}<br>`;
    resultContainer.appendChild(coordinates);

    // Funktion für die Darstellung in binär und vorne mit Nullen gefüllt
    function formatBinary(value) {
        return value.toString(2).padStart(Number(bitLength), '0');
    }

    // Morton Code färben
    function colorizeBits(binaryStr) {
        let coloredStr = '';
        const length = binaryStr.length;

        // Schleife von rechts nach links durch die Bits, damit die Bits richtig gefärbt werden
        for (let k = length - 1; k >= 0; k--) {
            const colorClass = `color-${layout[(length - 1 - k) % dimension]}`; // Farben basierend auf Index

            // Das jeweilige Bit wird der gefärbten Zeichenkette am Anfang hinzugefügt
            coloredStr = `<span class="${colorClass}">${binaryStr[k]}</span>` + coloredStr;
        }

        return coloredStr;
    }


    // Current Bit und shifted bit formatieren
    function formatAndColorizeBits(value, colorClass) {
        const binaryString = formatBinary(value);
        let formattedBits = '';
    
        for (let i = 0; i < binaryString.length; i++) {
            const bit = binaryString[i];
            if (bit === '1') {
                formattedBits += `<span class="${colorClass}">1</span>`;
            } else {
                formattedBits += `<span style="color: black;">0</span>`;
            }
        }
    
        return formattedBits;
    }    

    // Iteration über die Bits und Koordinaten
    for (let i = 0; i < bitsPerCoord; ++i) {
        for (let j = 0; j < coords.length; ++j) {
            const currentBit = (BigInt(coords[j]) & (BigInt(1) << BigInt(i)));
            const shiftedBit = currentBit << BigInt(i * (coords.length - 1) + j);

            // Aktualisieren von Morton-Code
            mortonCode |= shiftedBit;

            // Wählen der entsprechenden Farbe basierend auf j-Wert
            const colorClass = `color-${layout[j]}`;

            // Formatierte Ausgabe des aktuellen Bits und des verschobenen Bits
            const formattedCurrentBit = formatAndColorizeBits(currentBit, colorClass);
            const formattedShiftedBit = formatAndColorizeBits(shiftedBit, colorClass);

            // Schritt-Container erstellen und farbkodierte Bits anzeigen
            const stepDiv = document.createElement("div");
            stepDiv.classList.add("step-bit");

            stepDiv.innerHTML = `
            <p><strong>Bit position ${i}, coordinate ${layout[j]}:</strong></p>
            <p>Current Bit: <span>${formattedCurrentBit}</span></p>
            <p>Shifted Bit: <span>${formattedShiftedBit}</span></p>
            <p>Morton Code: <span>${colorizeBits(formatBinary(mortonCode))}</span></p><br>
        `;
            resultContainer.appendChild(stepDiv);
        }
    }

    const finalResult = document.createElement("div");
    finalResult.innerHTML = `<p><strong>Final Morton Code:</strong> ${colorizeBits(formatBinary(mortonCode))} (decimal: ${mortonCode.toString()})</p>`;
    resultContainer.appendChild(finalResult);

    return mortonCode;
}


// ---------------------------------------------- Verschränken mit Magic Bits ----------------------------------------------------------
// Quelle des 3D Magic-Bits-Algorithmus: "Morton encoding/decoding through bit interleaving: Implementations", link=https://www.forceflow.be/2013/10/07/morton-encodingdecoding-through-bit-interleaving-implementations/
// Quelle des 2D Magic-Bits-Algorithmus: "Forceflow / libmorton", link=https://github.com/Forceflow/libmorton/blob/main/include/libmorton/morton2D.h


function splitBy3(a, bitLength) {
    const steps = [];
    let x = BigInt(a);

    if (bitLength === 64) {

        x = (x | (x << 32n)) & 0x1f00000000ffffn;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        x = (x | (x << 16n)) & 0x1f0000ff0000ffn;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        x = (x | (x << 8n)) & 0x100f00f00f00f00fn;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        x = (x | (x << 4n)) & 0x10c30c30c30c30c3n;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        x = (x | (x << 2n)) & 0x1249249249249249n;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        return { result: x, steps };

    } else if (bitLength === 32) {

        x = (x | (x << 16n)) & 0x30000ffn;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        x = (x | (x << 8n)) & 0x0300f00fn;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        x = (x | (x << 4n)) & 0x30c30c3n;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        x = (x | (x << 2n)) & 0x9249249n;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        return { result: x, steps };

    } else if (bitLength === 16) {

        x = (x | (x << 8n)) & 0x0300F00Fn;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        x = (x | (x << 4n)) & 0x030C30C3n;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        x = (x | (x << 2n)) & 0x09249249n;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        return { result: x, steps };

    } else {
        console.log("Bitlänge ungültig");
        return { result: 0, steps };
    }
}

function encodeMagicBits3D(x, y, z, bitLength) {
    const xSplit = splitBy3(x, bitLength);
    const ySplit = splitBy3(y, bitLength);
    const zSplit = splitBy3(z, bitLength);

    const result = xSplit.result | (ySplit.result << 1n) | (zSplit.result << 2n);

    return { mortonCode: result, steps: [xSplit, ySplit, zSplit] };
}


function splitBy2(a, bitLength) {
    const steps = [];
    let x = BigInt(a);

    if (bitLength === 64) {

        x = (x | (x << 32n)) & 0x00000000FFFFFFFFn;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        x = (x | (x << 16n)) & 0x0000FFFF0000FFFFn;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        x = (x | (x << 8n)) & 0x00FF00FF00FF00FFn;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        x = (x | (x << 4n)) & 0x0F0F0F0F0F0F0F0Fn;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        x = (x | (x << 2n)) & 0x3333333333333333n;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        x = (x | (x << 1n)) & 0x5555555555555555n;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        return { result: x, steps };

    } else if (bitLength === 32) {

        x = (x | (x << 16n)) & 0x0000ffffn;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        x = (x | (x << 8n)) & 0x00ff00ffn;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        x = (x | (x << 4n)) & 0x0f0f0f0fn;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        x = (x | (x << 2n)) & 0x33333333n;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        x = (x | (x << 1n)) & 0x55555555n;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        return { result: x, steps };

    } else if (bitLength === 16) {
        x = (x | (x << 8n)) & 0x00FFn;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        x = (x | (x << 4n)) & 0x0F0Fn;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        x = (x | (x << 2n)) & 0x3333n;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        x = (x | (x << 1n)) & 0x5555n;
        steps.push(x.toString(2).padStart(bitLength, '0'));

        return { result: x, steps };

    } else {
        console.log(bitLength)
        console.log("Bitlänge ungültig");
        return { result: 0, steps };
    } 
}

function encodeMagicBits2D(x, y, bitLength) {
    const xSplit = splitBy2(x, bitLength);
    const ySplit = splitBy2(y, bitLength);
    const result = xSplit.result | (ySplit.result << 1n);

    return { mortonCode: result, steps: [xSplit, ySplit] };
}

function interleaveMagicBits(point) {
    const resultContainer = document.getElementById(`${point.id}-resultMagicBits`);
    const maxBits = parseInt(bitLength / dimension);

    // koordinaten in ein array speichern
    let coords = [];
    if (dimension === 3) {
        coords = layout === "xyz" ? [point.x, point.y, point.z] : [point.z, point.y, point.x];
    } else {
        coords = [point.x, point.y];
    }

    // Berechnung entsprechend der Dimension
    const { mortonCode, steps } = dimension === 2
        ? encodeMagicBits2D(coords[0], coords[1], bitLength)
        : encodeMagicBits3D(coords[0], coords[1], coords[2], bitLength);

    // Koordinaten in binär und gefärbt ausgeben
    let binaryCoordinates = '';
    for (let i = 0; i < coords.length; i++) {
        const coord = coords[i];
        const colorClass = `color-${layout[i]}`;
        const binaryString = `<span class="${colorClass}">${coord.toString(2).padStart(maxBits, '0')}</span>`;
        binaryCoordinates += `<div class="binary">${layout[i]} = ${binaryString} (decimal: ${coord})</div>`;
    }


    // Schritte formatieren und farbig kodieren
    let bitSteps = '';
    for (let i = 0; i < steps.length; i++) {
        const stepInfo = steps[i];
        const colorClass = `color-${layout[i]}`; // Farben basierend auf Index
        bitSteps += `<h5>Bits for ${layout[i]}:</h5>`;
        for (let i = 0; i < stepInfo.steps.length; i++) {
            const step = stepInfo.steps[i];
            bitSteps += `<div class="binary">After step ${i + 1}: <span class="${colorClass}">${step}</span></div>`;
        }
    }
      

    // Kombination (Morton-Code) gefärbt ausgeben
    let mortonCodeBinary = mortonCode.toString(2).padStart(maxBits * dimension, '0');
    let formattedBits = '';

    for (let i = 0; i < mortonCodeBinary.length; i++) {
        const reversedIndex = mortonCodeBinary.length - 1 - i;
        const colorClass = `color-${layout[reversedIndex % dimension]}`; // Farben basierend auf Index
        reversedIndex % dimension === 1 ? 'color-y' : 'color-z';
        formattedBits += `<span class="${colorClass}">${mortonCodeBinary[i]}</span>`;
    }

    const combination = `
        <div class="binary">Morton Code: ${formattedBits} (decimal: ${mortonCode})</div>
    `;

    resultContainer.innerHTML = `
        ${binaryCoordinates}
        ${bitSteps}
        <h5>Combination:</h5>
        ${combination}
    `;

    return combination;
}

// ----------------------------------------------- Quellcode anzeigen -------------------------------------------------------

const forLoopCode = `For Loop Algorithm

function interleave(coords, bitLength) {
    const bitsPerCoord = bitLength / coords.length; 

    for (let i = 0; i < bitsPerCoord; ++i) {
        for (let j = 0; j < coords.length; ++j) {
            const currentBit = (coords[j] & (1 << i));
            const shiftedBit = currentBit << (i * (coords.length - 1) + j);
        
            mortonCode |= shiftedBit;
        }
    } 
}
`;

function getMagicBits3D64() {
    return `Magic Bits Algorithm 3D

function splitBy3(x) {
    x = (x | (x << 32)) & 0x1F00000000FFFF;
    x = (x | (x << 16)) & 0x1F0000FF0000FF;
    x = (x | (x << 8)) & 0x100F00F00F00F00F;
    x = (x | (x << 4)) & 0x10C30C30C30C30C3;
    x = (x | (x << 2)) & 0x1249249249249249;

    return x;   
}

function encodeMagicBits3D(x, y, z) {
    const xSplit = splitBy3(x);
    const ySplit = splitBy3(y);
    const zSplit = splitBy3(z);

    return ${layout === "xyz" ? 
    "xSplit | (ySplit << 1) | (zSplit << 2);" : 
    "zSplit | (ySplit << 1) | (xSplit << 2);"
    }
}
`;
}

function getMagicBits3D32() {
    return `Magic Bits Algorithm 3D

function splitBy3(x) {
    x = (x | (x << 16)) & 0x30000FF;
    x = (x | (x << 8)) & 0x0300F00F;
    x = (x | (x << 4)) & 0x30C30C3;
    x = (x | (x << 2)) & 0x9249249;
    return x;   
}

function encodeMagicBits3D(x, y, z) {
    const xSplit = splitBy3(x);
    const ySplit = splitBy3(y);
    const zSplit = splitBy3(z);

    return ${layout === "xyz" ? 
    "xSplit | (ySplit << 1) | (zSplit << 2);" : 
    "zSplit | (ySplit << 1) | (xSplit << 2);"
    }
}
`;
}

function getMagicBits3D16() {
    return `Magic Bits Algorithm 3D

function splitBy3(x) {
    x = (x | (x << 8)) & 0x0300F00F;
    x = (x | (x << 4)) & 0x030C30C3;
    x = (x | (x << 2)) & 0x09249249;
    return x;   
}

function encodeMagicBits3D(x, y, z) {
    const xSplit = splitBy3(x);
    const ySplit = splitBy3(y);
    const zSplit = splitBy3(z);

    return ${layout === "xyz" ? 
    "xSplit | (ySplit << 1) | (zSplit << 2);" : 
    "zSplit | (ySplit << 1) | (xSplit << 2);"
    }
}
`;
}

const magicBitsCode2D64 = `Magic Bits Algorithm 2D

function splitBy2(x) {
    x = (x | (x << 32)) & 0x00000000FFFFFFFF;
    x = (x | (x << 16)) & 0x0000FFFF0000FFFF;
    x = (x | (x << 8)) & 0x00FF00FF00FF00FF;
    x = (x | (x << 4)) & 0x0F0F0F0F0F0F0F0F;
    x = (x | (x << 2)) & 0x3333333333333333;
    x = (x | (x << 1)) & 0x5555555555555555;

    return x;
}

function encodeMagicBits2D(x, y) {
    const xSplit = splitBy2(x);
    const ySplit = splitBy2(y);

    return xSplit | (ySplit << 1);
}
`;

const magicBitsCode2D32 = `Magic Bits Algorithm 2D

function splitBy2(x) {
    x = (x | (x << 16)) & 0x0000FFFF;
    x = (x | (x << 8)) & 0x00FF00FF;
    x = (x | (x << 4)) & 0x0F0F0F0F;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;
    
    return x;
}

function encodeMagicBits2D(x, y) {
    const xSplit = splitBy2(x);
    const ySplit = splitBy2(y);

    return xSplit | (ySplit << 1);
}
`;

const magicBitsCode2D16 = `Magic Bits Algorithm 2D

function splitBy2(x) {
    x = (x | (x << 8)) & 0x00FF;
    x = (x | (x << 4)) & 0x0F0F;
    x = (x | (x << 2)) & 0x3333;
    x = (x | (x << 1)) & 0x5555;

    return x;
}

function encodeMagicBits(x, y) {
    const xSplit = splitBy2(x);
    const ySplit = splitBy2(y);

    return xSplit | (ySplit << 1);
}
`;

// Quellcode auf der Benutzeroberfläche anzeigen
function showSourceCode(codeContainerId, HeaderId, buttonId, resultContainerId, code) {
    const codeContainer = document.getElementById(codeContainerId);
    const resultContainer = document.getElementById(resultContainerId);
    const headerContainer = document.getElementById(HeaderId);
    const button = document.getElementById(buttonId);
    const dimension = document.getElementById("dimension").value;
    const bitLength = document.getElementById("bitLength").value;

    if (code === "magicBitsCode") {
        if (dimension === "2") {
            code = bitLength === "64" ? magicBitsCode2D64 :
                   bitLength === "32" ? magicBitsCode2D32 : magicBitsCode2D16;
        } else if (dimension === "3") {
            code = bitLength === "64" ? getMagicBits3D64() :
                   bitLength === "32" ? getMagicBits3D32() : getMagicBits3D16();
        }
    }    

    // Quellcode Container sichbar machen 
    codeContainer.classList.remove("hidden");

    // eigentliche Inhalte der Spalte verstecken 
    headerContainer.classList.add("hidden");
    resultContainer.classList.add("hidden");
    button.classList.add("hidden");

    // Quellcode Container mit dem jeweiligen Code füllen und ein Button zum schließen hinzufügen
    // Quelle des svg-icon: link=https://www.svgviewer.dev/s/17225/x
    codeContainer.innerHTML = `
        <button class="close-btn" onclick="closeCode('${codeContainerId}', '${HeaderId}', '${resultContainerId}', '${buttonId}')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        </button>
        <pre><code class="language-javascript">${code}</code></pre>
        `;
    Prism.highlightAll();
}

// Quellcode Container schließen
function closeCode(codeContainerId, HeaderId, resultContainerId, buttonId) {
    const codeContainer = document.getElementById(codeContainerId);
    const resultContainer = document.getElementById(resultContainerId);
    const headerContainer = document.getElementById(HeaderId);
    const button = document.getElementById(buttonId);

    codeContainer.classList.add("hidden");
    headerContainer.classList.remove("hidden");
    resultContainer.classList.remove("hidden");
    button.classList.remove("hidden");
    codeContainer.innerHTML = '';
}

// --------------------------------------------------------- Addition und Subtraktion -----------------------------------------------------------------------

// Überprüfen, ob Morton-Codes der Punkte a und b existieren
function checkMortonCodesExist(errorElementId) {
    const error = document.getElementById(errorElementId);

    // Überprüfe, ob der Morton-Code `null` oder `undefined` ist
    if (pointA.mortonCode === null || pointA.mortonCode === undefined || 
        pointB.mortonCode === null || pointB.mortonCode === undefined) {
        error.textContent = "Please calculate Morton Codes for points A and B!";
        error.style.display = "block";
        return false;
    } else {
        error.textContent = "";
        error.style.display = "none";
        return true;
    }
}


function addition() {
    // Ergebnisse zurücksetzen
    const resultContainer = document.getElementById(`resultAddition`);
    resultContainer.innerHTML = "";
    
    if (!checkMortonCodesExist('additionError')) {
        console.log("Morton code does not exist");
        return;
    }
    if (!checkCoordinatesForAddition()) {
        console.log("out of range");
        return;
    }

    // höhe und größenveränderbarkeit für ergebnisse
    resultContainer.style.height = '300px';
    resultContainer.style.resize = 'vertical';

    let sum;
    let steps = "";

    // Hilfsfunktion um die jeweiligen Masken für die verschiedenen Bitlängen zu generieren
    function generateMask(pattern, bitLength) {
        let mask = 0n;
        for (let i = 0; i < bitLength; i += pattern.length) {
            for (let j = 0; j < pattern.length; j++) {
                if (i + j < bitLength && pattern[j] === "1") {
                    mask |= 1n << BigInt(i + j);
                }
            }
        }
        return mask;
    }

    if (dimension === 2) {
        // Generiere die Masken
        const x2_mask = generateMask("10", bitLength);
        const y2_mask = generateMask("01", bitLength);

        steps += `<h4>calculation steps: </h4>`;
        steps += `<p>masks: </p>
        <div class="binary">x-mask: 0x${x2_mask.toString(16).toUpperCase()}<br>
        y-mask: 0x${y2_mask.toString(16).toUpperCase()}</div><br>`;

        // x-Summe
        const x_sum = ((pointA.mortonCode | y2_mask) + (pointB.mortonCode & x2_mask)) & x2_mask;
        steps += `<p>x-sum calculation:</p><div class="binary">((pointA | y-mask) + (pointB & x-mask)) & x-mask:<br><br>
        ((<span class="color-a">${pointA.mortonCode.toString(2).padStart(bitLength, '0')}</span> | 
        ${y2_mask.toString(2).padStart(bitLength, '0')}) + 
        (<span class="color-b">${pointB.mortonCode.toString(2).padStart(bitLength, '0')}</span> & 
        ${x2_mask.toString(2).padStart(bitLength, '0')})) & ${x2_mask.toString(2).padStart(bitLength, '0')}<br><br>= 
        ${x_sum.toString(2).padStart(bitLength, '0')}</div><br>`;

        // y-Summe
        const y_sum = ((pointA.mortonCode | x2_mask) + (pointB.mortonCode & y2_mask)) & y2_mask;
        steps += `<p>y-sum calculation: </p><div class="binary">((pointA | x-mask) + (pointB & y-mask)) & y-mask:<br><br>
        ((<span class="color-a">${pointA.mortonCode.toString(2).padStart(bitLength, '0')}</span> | 
        ${x2_mask.toString(2).padStart(bitLength, '0')}) + 
        (<span class="color-b">${pointB.mortonCode.toString(2).padStart(bitLength, '0')}</span> & 
        ${y2_mask.toString(2).padStart(bitLength, '0')})) & ${y2_mask.toString(2).padStart(bitLength, '0')} <br><br>= 
        ${y_sum.toString(2).padStart(bitLength, '0')}</div><br>`;

        // Summe der Morton-Codes
        sum = x_sum | y_sum;
        steps += `<p>final sum: </p><div class="binary">x-sum | y-sum :<br><br>
        ${x_sum.toString(2).padStart(bitLength, '0')} | ${y_sum.toString(2).padStart(bitLength, '0')} <br><br>= 
        <b>${sum.toString(2).padStart(bitLength, '0')}</b></div>`;

    } else if (dimension === 3) {
        // Masken generieren
        const x3_mask = generateMask("100", bitLength);
        const y3_mask = generateMask("010", bitLength);
        const z3_mask = generateMask("001", bitLength);
        const xy3_mask = x3_mask | y3_mask;
        const xz3_mask = x3_mask | z3_mask;
        const yz3_mask = y3_mask | z3_mask;

        steps += `<h4>calculation steps: </h4>`;
        steps += `<p>masks: </p>
        <div class="binary">
        ${layout[0]}-mask: 0x${x3_mask.toString(16).toUpperCase()}<br>
        ${layout[1]}-mask: 0x${y3_mask.toString(16).toUpperCase()}<br>
        ${layout[2]}-mask: 0x${z3_mask.toString(16).toUpperCase()}<br>
        ${layout[0]}${layout[1]}-mask: 0x${xy3_mask.toString(16).toUpperCase()}<br>
        ${layout[0]}${layout[2]}-mask: 0x${xz3_mask.toString(16).toUpperCase()}<br>
        ${layout[1]}${layout[2]}-mask: 0x${yz3_mask.toString(16).toUpperCase()}<br></div><br>`; 

        // x-Summe (oder z-Summe, je nach dem welches Layout gewählt wurde)
        const x_sum = ((pointA.mortonCode | yz3_mask) + (pointB.mortonCode & x3_mask))  & x3_mask;
        steps += `<p>${layout[0]}-sum calculation:</p><div class="binary">((pointA | 
        ${layout[1]}${layout[2]}-mask) + (pointB & ${layout[0]}-mask)) & ${layout[0]}-mask:<br><br>

        ((<span class="color-a">${pointA.mortonCode.toString(2).padStart(bitLength, '0')}</span> | 
        ${yz3_mask.toString(2).padStart(bitLength, '0')}) + 
        (<span class="color-b">${pointB.mortonCode.toString(2).padStart(bitLength, '0')}</span> & 
        ${x3_mask.toString(2).padStart(bitLength, '0')})) & ${x3_mask.toString(2).padStart(bitLength, '0')}<br><br>= 
        ${x_sum.toString(2).padStart(bitLength, '0')}</div><br>`;

        // y-Summe
        const y_sum = ((pointA.mortonCode | xz3_mask) + (pointB.mortonCode & y3_mask)) & y3_mask;
        steps += `<p>${layout[1]}-sum calculation: </p><div class="binary">((pointA | 
        ${layout[0]}${layout[2]}-mask) + (pointB & ${layout[1]}-mask)) & ${layout[1]}-mask:<br><br>

        ((<span class="color-a">${pointA.mortonCode.toString(2).padStart(bitLength, '0')}</span> | 
        ${xz3_mask.toString(2).padStart(bitLength, '0')}) + 
        (<span class="color-b">${pointB.mortonCode.toString(2).padStart(bitLength, '0')}</span> & 
        ${y3_mask.toString(2).padStart(bitLength, '0')})) & ${y3_mask.toString(2).padStart(bitLength, '0')}<br><br>= 
        ${y_sum.toString(2).padStart(bitLength, '0')}</div><br>`;

        // z-Summe (oder x-Summe, je nach dem welches Layout gewählt wurde)
        const z_sum = ((pointA.mortonCode | xy3_mask) + (pointB.mortonCode & z3_mask)) & z3_mask;
        steps += `<p>${layout[2]}-sum calculation: </p><div class="binary">((pointA | 
        ${layout[0]}${layout[1]}-mask) + (pointB & ${layout[2]}-mask)) & ${layout[2]}-mask:<br><br>

        ((<span class="color-a">${pointA.mortonCode.toString(2).padStart(bitLength, '0')}</span> | 
        ${xy3_mask.toString(2).padStart(bitLength, '0')}) + 
        (<span class="color-b">${pointB.mortonCode.toString(2).padStart(bitLength, '0')}</span> & 
        ${z3_mask.toString(2).padStart(bitLength, '0')})) & ${z3_mask.toString(2).padStart(bitLength, '0')} <br><br>= 
        ${z_sum.toString(2).padStart(bitLength, '0')}</div><br>`;

        // Summe der Morton-Codes
        sum = x_sum| y_sum | z_sum;
        steps += `<p>final sum: </p><div class="binary">
        ${layout[0]}-sum | ${layout[1]}-sum | ${layout[2]}-sum:<br><br>
        ${x_sum.toString(2).padStart(bitLength, '0')} | ${y_sum.toString(2).padStart(bitLength, '0')} | ${z_sum.toString(2).padStart(bitLength, '0')} <br><br>
        = <b>${sum.toString(2).padStart(bitLength, '0')}</b></div>`;
    } else {
        return;
    }

    // Koordinaten formatieren, Layout berücksichtigen: xyz oder zyx
    function formatCoordinates(point, layout) {
        if (layout === "zyx") {
            return `(${point.z !== null ? `${point.z}, ` : ''}${point.y}, ${point.x})`;
        }
        return `(${point.x}, ${point.y}${point.z !== null ? `, ${point.z}` : ''})`;
    }

    // Morton-Code formatieren
    function formatMortonCode(mortonCode, bitLength) {
        return mortonCode.toString(2).padStart(bitLength, '0');
    }

    // Ergebnis anzeigen oben
    resultContainer.innerHTML = `
        <p class="binary">
            point a = ${formatCoordinates(pointA, layout)}<br><br> 
            morton code: <span class="color-a">${formatMortonCode(pointA.mortonCode, bitLength)}</span> 
            (decimal: ${pointA.mortonCode})<br><br><br>

            point b = ${formatCoordinates(pointB, layout)}<br><br> 
            morton code: <span class="color-b">${formatMortonCode(pointB.mortonCode, bitLength)}</span> 
            (decimal: ${pointB.mortonCode})<br><br><br>

            result:<br><br>
            a + b = ${formatCoordinates({
                x: pointA.x + pointB.x, 
                y: pointA.y + pointB.y, 
                z: pointA.z !== null ? pointA.z + pointB.z : null
            }, layout)}<br><br>

            morton code: <b>${formatMortonCode(sum, bitLength)}</b> (decimal: ${sum})<br><br><br>
        </p>
    `;

    // Rechenschritte anzeigen
    resultContainer.innerHTML += steps;
}




function subtraction() {
    // Ergebnisse zurücksetzen
    const resultContainer = document.getElementById(`resultSubtraction`);
    resultContainer.innerHTML = "";

    if (!checkMortonCodesExist('subtractionError')) {
        console.log("Morton code does not exist");
        return;
    }

    if (checkCoordinatesForSubtraction() === false) {
        console.log("No subtraction!");
        return;
    }

    // Höhe und Größenveränderbarkeit für ergebnisse
    resultContainer.style.height = '300px';
    resultContainer.style.resize = 'vertical';

    let diff;
    let steps = ""; 

    // Hilfsfunktion um die jeweiligen Masken für die verschiedenen Bitlängen zu generieren
    function generateMask(pattern, bitLength) {
        let mask = 0n;
        for (let i = 0; i < bitLength; i += pattern.length) {
            for (let j = 0; j < pattern.length; j++) {
                if (i + j < bitLength && pattern[j] === "1") {
                    mask |= 1n << BigInt(i + j);
                }
            }
        }
        return mask;
    }

    if (dimension === 2) {
        // Masken generieren
        const x2_mask = generateMask("10", bitLength);
        const y2_mask = generateMask("01", bitLength);

        steps += `<h4>calculation steps: </h4>`;
        steps += `<p>masks: </p>
        <div class="binary">x-mask: 0x${x2_mask.toString(16).toUpperCase()}<br>
        y-mask: 0x${y2_mask.toString(16).toUpperCase()}</div><br>`;

        // x-Differenz
        const x_diff = ((pointA.mortonCode & x2_mask) - (pointB.mortonCode & x2_mask)) & x2_mask;
        steps += `<p>x-difference calculation:</p><div class="binary">((pointA & x-mask) - (pointB & x-mask)) & x-mask:<br><br>
        ((<span class="color-a">${pointA.mortonCode.toString(2).padStart(bitLength, '0')}</span> & 
        ${x2_mask.toString(2).padStart(bitLength, '0')}) - 
        (<span class="color-b">${pointB.mortonCode.toString(2).padStart(bitLength, '0')}</span> & 
        ${x2_mask.toString(2).padStart(bitLength, '0')})) & 
        ${x2_mask.toString(2).padStart(bitLength, '0')}<br><br>= 
        ${x_diff.toString(2).padStart(bitLength, '0')}</div><br>`;

        // y-Differenz
        const y_diff = ((pointA.mortonCode & y2_mask) - (pointB.mortonCode & y2_mask)) & y2_mask;
        steps += `<p>y-difference calculation:</p><div class="binary">((pointA & y-mask) - (pointB & y-mask)) & y-mask:<br><br>
        ((<span class="color-a">${pointA.mortonCode.toString(2).padStart(bitLength, '0')}</span> & 
        ${y2_mask.toString(2).padStart(bitLength, '0')}) - 
        (<span class="color-b">${pointB.mortonCode.toString(2).padStart(bitLength, '0')}</span> & 
        ${y2_mask.toString(2).padStart(bitLength, '0')})) & 
        ${y2_mask.toString(2).padStart(bitLength, '0')} <br><br>= 
        ${y_diff.toString(2).padStart(bitLength, '0')}</div><br>`;

        // Differenz beider Morton-Codes
        diff = x_diff | y_diff;
        steps += `<p>final difference:</p><div class="binary">x-difference | y-difference:<br><br>
        ${x_diff.toString(2).padStart(bitLength, '0')} | 
        ${y_diff.toString(2).padStart(bitLength, '0')} <br><br>= 
        <b>${diff.toString(2).padStart(bitLength, '0')}</b></div>`;

    } else if (dimension === 3) {
        // Masken generieren
        const x3_mask = generateMask("100", bitLength);
        const y3_mask = generateMask("010", bitLength);
        const z3_mask = generateMask("001", bitLength);

        steps += `<h4>calculation steps: </h4>`;
        steps += `<p>masks: </p>
        <div class="binary">${layout[0]}-mask: 0x${x3_mask.toString(16).toUpperCase()}<br>
        ${layout[1]}-mask: 0x${y3_mask.toString(16).toUpperCase()}<br>
        ${layout[2]}-mask: 0x${z3_mask.toString(16).toUpperCase()}</div><br>`;

        // x-Differenz (oder z-Differenz, je nach Layout)
        const x_diff = ((pointA.mortonCode & x3_mask) - (pointB.mortonCode & x3_mask)) & x3_mask;
        steps += `<p>${layout[0]}-difference calculation:</p><div class="binary">((pointA & ${layout[0]}-mask) - (pointB & ${layout[0]}-mask)) & ${layout[0]}-mask:<br><br>
        ((<span class="color-a">${pointA.mortonCode.toString(2).padStart(bitLength, '0')}</span> & 
        ${x3_mask.toString(2).padStart(bitLength, '0')}) - 
        (<span class="color-b">${pointB.mortonCode.toString(2).padStart(bitLength, '0')}</span> & 
        ${x3_mask.toString(2).padStart(bitLength, '0')})) &
        ${x3_mask.toString(2).padStart(bitLength, '0')} <br><br>= 
        ${x_diff.toString(2).padStart(bitLength, '0')}</div><br>`;

        // y-Differenz
        const y_diff = ((pointA.mortonCode & y3_mask) - (pointB.mortonCode & y3_mask)) & y3_mask;
        steps += `<p>${layout[1]}-difference calculation:</p><div class="binary">((pointA & ${layout[1]}-mask) - (pointB & ${layout[1]}-mask)) & ${layout[1]}-mask:<br><br>
        ((<span class="color-a">${pointA.mortonCode.toString(2).padStart(bitLength, '0')}</span> & 
        ${y3_mask.toString(2).padStart(bitLength, '0')}) - 
        (<span class="color-b">${pointB.mortonCode.toString(2).padStart(bitLength, '0')}</span> & 
        ${y3_mask.toString(2).padStart(bitLength, '0')})) &
        ${y3_mask.toString(2).padStart(bitLength, '0')} <br><br>= 
        ${y_diff.toString(2).padStart(bitLength, '0')}</div><br>`;

        // z-Differenz (oder x-Differenz, je nach Layout)
        const z_diff = ((pointA.mortonCode & z3_mask) - (pointB.mortonCode & z3_mask)) & z3_mask;
        steps += `<p>${layout[2]}-difference calculation:</p><div class="binary">((pointA & ${layout[2]}-mask) - (pointB & ${layout[2]}-mask)) & ${layout[2]}-mask:<br><br>
        ((<span class="color-a">${pointA.mortonCode.toString(2).padStart(bitLength, '0')}</span> & 
        ${z3_mask.toString(2).padStart(bitLength, '0')}) - 
        (<span class="color-b">${pointB.mortonCode.toString(2).padStart(bitLength, '0')}</span> & 
        ${z3_mask.toString(2).padStart(bitLength, '0')})) &
        ${z3_mask.toString(2).padStart(bitLength, '0')} <br><br>= 
        ${z_diff.toString(2).padStart(bitLength, '0')}</div><br>`;

        // Differenz der Morton-Codes
        diff = x_diff | y_diff | z_diff;
        steps += `<p>final difference:</p><div class="binary">${layout[0]}-difference | ${layout[1]}-difference | ${layout[2]}-difference:<br><br>
        ${x_diff.toString(2).padStart(bitLength, '0')} | 
        ${y_diff.toString(2).padStart(bitLength, '0')} | 
        ${z_diff.toString(2).padStart(bitLength, '0')} <br><br>= 
        <b>${diff.toString(2).padStart(bitLength, '0')}</b></div>`;
    }


    // Koordinaten Reihenfolge, Layout berücksichtigen: xyz oder zyx
    function formatCoordinates(point) {
        if (layout === "zyx") {
            return `(${point.z !== null ? `${point.z}, ` : ''}${point.y}, ${point.x})`;
        }
        return `(${point.x}, ${point.y}${point.z !== null ? `, ${point.z}` : ''})`;
    }

    // Morton-Code formatieren
    function formatMortonCode(mortonCode, bitLength) {
        return mortonCode.toString(2).padStart(bitLength, '0');
    }

    // Ergebnis anzeigen
    resultContainer.innerHTML = `
        <p class="binary">
            point a = ${formatCoordinates(pointA)}<br><br> 
            morton code: <span class="color-a">${formatMortonCode(pointA.mortonCode, bitLength)}</span> 
            (decimal: ${pointA.mortonCode})<br><br><br>

            point b = ${formatCoordinates(pointB)}<br><br> 
            morton code: <span class="color-b">${formatMortonCode(pointB.mortonCode, bitLength)}</span> 
            (decimal: ${pointB.mortonCode})<br><br><br>

            result:<br><br>
            a - b = ${formatCoordinates({
                x: pointA.x - pointB.x, 
                y: pointA.y - pointB.y, 
                z: pointA.z !== null ? pointA.z - pointB.z : null
            })}<br><br>

            morton code: <b>${formatMortonCode(diff, bitLength)}</b> (decimal: ${diff})<br><br><br>
        </p>
    `;

    // Schritte anzeigen
    resultContainer.innerHTML += steps;
}

function checkCoordinatesForAddition() {
    const error = document.getElementById(`additionError`);

    if (pointA.x + pointB.x > maxCoordinateValue || pointA.x + pointB.x > maxCoordinateValue || (pointA.z && pointB.z && pointA.z + pointB.z > maxCoordinateValue)) {
        error.textContent = `Each coordinate sum must be within the allowed range! (max allowed: ${maxCoordinateValue})`;
        error.style.display = "block";
        return false;
    }

    error.textContent = "";
    error.style.display = "none";
    return true;
}


function checkCoordinatesForSubtraction() {
    const error = document.getElementById(`subtractionError`);

    if (pointA.x < pointB.x || pointA.y < pointB.y || (pointA.z && pointB.z && pointA.z < pointB.z)) {
        error.textContent = "Each coordinate of A must be ≥ the corresponding coordinate of B!";
        error.style.display = "block";
        return false;
    }

    error.textContent = "";
    error.style.display = "none";
    return true;
}


//--------------------------------------------------------- stencil -------------------------------------------------------------

function generateStencil(pointId) {
    document.getElementById(`stencilContainer-${pointId}`).classList.add('expanded');
    const canvas = document.getElementById(`canvasStencil-${pointId}`);
    const ctx = canvas.getContext('2d');

    ctx.setTransform(1, 0, 0, 1, 0, 0); // Skalierung und Verschiebung zurücksetzen
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Löscht den Canvas-Inhalt

    if (pointId == 'a') {
        if (dimension == 2){
            generateStencil2D(canvas, ctx, pointA);
        } else if (dimension == 3){
            generateStencil3D(canvas, ctx, pointA);
        }
    }

    if (pointId == 'b') {
        if (dimension == 2){
            generateStencil2D(canvas, ctx, pointB);
        } else if (dimension == 3){
            generateStencil3D(canvas, ctx, pointB);
        }
    }
}

function generateStencil2D(canvas, ctx, pointId){
    // Größe der Zeichenfläche
    canvas.width = 700;  
    canvas.height = 550;

    // Darstellungsgröße
    canvas.style.width = '350px'; 
    canvas.style.height = '275px'; 

    ctx.scale(2, 2); // skaliert das bild (für höhere auflösung)

    // Achsenlayout zeigen
    const img = new Image();
    img.src = "assets/xy.svg";
    img.onload = function () {
        ctx.drawImage(img, 10, 10, 40, 40);
    };

    const centerX = 180; 
    const centerY = canvas.height / 4;
    const offset = 80; // Abstand zwischen den Punkten

    const points = [
        { x: pointId.x - 1, y: pointId.y + 1 }, // oben links
        { x: pointId.x, y: pointId.y + 1 },     // oben mittig
        { x: pointId.x + 1, y: pointId.y + 1 }, // oben rechts
        { x: pointId.x - 1, y: pointId.y },     // mitte links
        { x: pointId.x, y: pointId.y },         // mitte
        { x: pointId.x + 1, y: pointId.y },     // mitte rechts
        { x: pointId.x - 1, y: pointId.y - 1 }, // unten links
        { x: pointId.x, y: pointId.y - 1 },     // unten mittig
        { x: pointId.x + 1, y: pointId.y - 1 }  // unten rechts
    ];

    // Farben und Stile anpassen
    const lineColor = '#707070'; 
    const hiddenColor = '#ccc'
    const circleColor = '#303030'; 
    const centerColor = '#0C9329'; 
    const textColor = '#000'

    function isOutOfBounds(point) {
        return point.x < 0 || point.y < 0 ||
               point.x > maxCoordinateValue || point.y > maxCoordinateValue;
    }

    ctx.font = '9px Helvetica';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Verbindungen zeichnen
    ctx.strokeStyle = lineColor;
    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const px = centerX + (point.x - pointId.x) * offset;
        const py = centerY - (point.y - pointId.y) * offset;

        // Horizontale Verbindungen
        if (i % 3 !== 2) {
            const rightPoint = points[i + 1];
            if (isOutOfBounds(point) || isOutOfBounds(rightPoint)){
                ctx.strokeStyle = hiddenColor;
            } else {
                ctx.strokeStyle = lineColor;
            }
            const pxRight = centerX + (rightPoint.x - pointId.x) * offset;
            const pyRight = centerY - (rightPoint.y - pointId.y) * offset;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(pxRight, pyRight);
            ctx.stroke();
        }

        // Vertikale Verbindungen
        if (i < 6) {
            const bottomPoint = points[i + 3];
            if (isOutOfBounds(point) ||isOutOfBounds(bottomPoint)){
                ctx.strokeStyle = hiddenColor;
            } else {
                ctx.strokeStyle = lineColor;
            }
            const pxBottom = centerX + (bottomPoint.x - pointId.x) * offset;
            const pyBottom = centerY - (bottomPoint.y - pointId.y) * offset;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(pxBottom, pyBottom);
            ctx.stroke();
        }
    }

    // Zeichne Punkte und Koordinaten
    points.forEach((point, index) => {
        const px = centerX + (point.x - pointId.x) * offset;
        const py = centerY - (point.y - pointId.y) * offset;

        ctx.beginPath();
        ctx.arc(px, py, 8, 0, 2 * Math.PI);    

        // Punkte, die nicht im gültigen Bereich sind, werden "versteckt" (in hellgrau eingefärbt)
        if (isOutOfBounds(point)){
            ctx.fillStyle = hiddenColor;
        } else {
            ctx.fillStyle = (index === 4) ? centerColor : circleColor; // Mittelpunkt grün füllen
        }
        ctx.fill();

        // Koordinaten zeichnen
        ctx.fillStyle = textColor;
        const adjustedPy = [1, 4, 7].includes(index) ? py - 10 : py; // 10 Pixel nach unten für Index 1, 4, 7 damit bei großen Zahlen genug Platz ist für Koordinatendarstellungen
        if (!isOutOfBounds(point)){
            ctx.fillText(`(${point.x}, ${point.y})`, px, adjustedPy + 25); 
        }
    });


    // Morton-Codes für 2D-Stencil ausgeben
    outputMortonCodes(points, pointId);
}


// 3D Stencil generieren
function generateStencil3D(canvas, ctx, pointId) {
    // Container von den Morton-Code Ergebnissen der benachbarten Punkte leeren 
    const resultContainer = document.getElementById(`stencilResult-${pointId.id}`)
    resultContainer.innerHTML = '';
    // Höhe und größenveränderbarkeit zurücksetzen 
    resultContainer.style.height = '250px';
    resultContainer.style.resize = 'vertical';
    
    // Ändert die interne Größe 
    canvas.width = 1700;  
    canvas.height = 700;

    // Darstellungsgröße
    canvas.style.width = '850px';  
    canvas.style.height = '350px'; 

    ctx.scale(2, 2); // skaliert das bild (für höhere auflösung)

    // Achsenlayout zeigen
    const img = new Image();
    img.src = "assets/xyz.svg";
    img.onload = function () {
        ctx.drawImage(img, 10, 10, 40, 40);
    };

    const centerX = 170;
    const centerY = 210;
    const offset = 90; // Abstand zwischen den Punkten
    const layerOffsetX = 250; // Abstand zwischen den Lagen
    const layerOffsetY = 50;


    // Punkte in drei Lagen definieren
    const layers = [
        pointId.z + 1,
        pointId.z,
        pointId.z - 1
    ];

    // Farben und Stile anpassen
    const lineColor = '#707070'; 
    const hiddenColor = '#ccc'  
    const circleColor = '#303030'; 
    const centerColor = '#0C9329'; 
    const textColor = '#000'

    function isOutOfBounds(point, z) {
        return point.x < 0 || point.y < 0 || z < 0 ||
               point.x > maxCoordinateValue || point.y > maxCoordinateValue || z > maxCoordinateValue;
    } 
    ctx.font = '9px Helvetica';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let layerCenters = [];

    layers.forEach((z, layerIndex) => {
        const layerCenterX = centerX + layerIndex * layerOffsetX;
        const layerCenterY = centerY - layerIndex * layerOffsetY;
        layerCenters.push({ x: layerCenterX, y: layerCenterY }); // Speichere die Mittelpunkte der Lagen

        const points = [
            { x: pointId.x - 1, y: pointId.y + 1 }, // oben links
            { x: pointId.x, y: pointId.y + 1 },     // oben mittig
            { x: pointId.x + 1, y: pointId.y + 1 }, // oben rechts
            { x: pointId.x - 1, y: pointId.y },     // mitte links
            { x: pointId.x, y: pointId.y },         // mitte
            { x: pointId.x + 1, y: pointId.y },     // mitte rechts
            { x: pointId.x - 1, y: pointId.y - 1 }, // unten links
            { x: pointId.x, y: pointId.y - 1 },     // unten mittig
            { x: pointId.x + 1, y: pointId.y - 1 }  // unten rechts
        ];

        // Verbindungen zeichnen
        points.forEach((point, i) => {
            const px = layerCenterX + (point.x - pointId.x) * offset;
            const py = layerCenterY - (point.y - pointId.y) * offset;

            // Horizontale Verbindungen
            if (i % 3 !== 2) {
                const rightPoint = points[i + 1];
                if (isOutOfBounds(point, z) || isOutOfBounds(rightPoint, z)){
                    ctx.strokeStyle = hiddenColor;
                } else {
                    ctx.strokeStyle = lineColor;
                }
                const pxRight = layerCenterX + (rightPoint.x - pointId.x) * offset;
                const pyRight = layerCenterY - (rightPoint.y - pointId.y) * offset;
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(pxRight, pyRight);
                ctx.stroke();
            }

            // Vertikale Verbindungen
            if (i < 6) {
                const bottomPoint = points[i + 3];
                if (isOutOfBounds(point, z) ||isOutOfBounds(bottomPoint, z)){
                    ctx.strokeStyle = hiddenColor;
                } else {
                    ctx.strokeStyle = lineColor;
                }
                const pxBottom = layerCenterX + (bottomPoint.x - pointId.x) * offset;
                const pyBottom = layerCenterY - (bottomPoint.y - pointId.y) * offset;
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(pxBottom, pyBottom);
                ctx.stroke();
            }
        });


        // Punkte und Koordinaten zeichnen
        points.forEach((point, index) => {
            const px = layerCenterX + (point.x - pointId.x) * offset;
            const py = layerCenterY - (point.y - pointId.y) * offset;

            ctx.beginPath();
            ctx.arc(px, py, 7, 0, 2 * Math.PI);
            // Punkte, die nicht im gültigen Bereich sind, werden "versteckt" (in hellgrau eingefärbt)
            if (isOutOfBounds(point, z)){
                ctx.fillStyle = hiddenColor;
            } else {
                ctx.fillStyle = (index === 4 && layerIndex === 1) ? centerColor : circleColor; // Mittelpunkt grün füllen
            }
            ctx.fill(); 

            // Koordinaten zeichnen
            ctx.fillStyle = textColor;
            const adjustedPy = [1, 4, 7].includes(index) ? py - 10 : py; // 10 Pixel nach oben für Index 1, 4, 7
            if (!isOutOfBounds(point, z)){
                if (layout == 'xyz'){
                    ctx.fillText(`(${point.x}, ${point.y}, ${z})`, px + 2, adjustedPy + 25); 
                } else if (layout == 'zyx') {
                    ctx.fillText(`(${z}, ${point.y}, ${point.x})`, px + 2, adjustedPy + 25); 
                }
            }
        });
        // Morton-Codes der Nachbarn des jeweiligen Layers ausrechnen und ausgeben 
        outputMortonCodes3D(points, layerIndex, pointId);
    });

     // Zeichne Linie vom Mittelpunkt der ersten Lage zum Mittelpunkt der letzten Lage
     const firstCenter = layerCenters[0];
     const lastCenter = layerCenters[2];
     ctx.strokeStyle = circleColor; 
     ctx.setLineDash([10, 10]); // Linie gestrichelt: 10 Pixel Linie, 10 Pixel Lücke
     ctx.beginPath();
     ctx.moveTo(firstCenter.x, firstCenter.y);
     ctx.lineTo(lastCenter.x, lastCenter.y);
     ctx.stroke();
     ctx.setLineDash([]);
}

// Funktion, um die Morton-Codes der Punkte des Stencils (2d) auszugeben
function outputMortonCodes(points, pointId) {
    document.getElementById(`stencilResult-${pointId.id}`).innerHTML = '';
    document.getElementById(`stencilResult-${pointId.id}`).innerHTML += `<h4>Morton Codes:</h4>`;

    // Mittelpunkt-Morton-Code
    const centerMorton = BigInt(pointId.mortonCode);

    // Masken je nach bitlänge
    if (bitLength == 16){
        x_mask = BigInt(0x5555); 
        y_mask = BigInt(0xAAAA);
    } else if (bitLength == 32) {
        x_mask = BigInt(0x55555555); 
        y_mask = BigInt(0xAAAAAAAA); 
    } else if (bitLength == 64) {
        x_mask = BigInt(0x5555555555555555n); 
        y_mask = BigInt(0xAAAAAAAAAAAAAAAAn); 
    }

    function isOutOfBounds(point) {
        return point.x < 0 || point.y < 0 ||
               point.x > maxCoordinateValue || point.y > maxCoordinateValue;
    }

    points.forEach((point, index) => {
        let mortonCode;

        if (index === 4) { // Mittelpunkt
            mortonCode = centerMorton;

            const colorStyle = 'style="color: #0C9329;"'
            document.getElementById(`stencilResult-${pointId.id}`).innerHTML += 
            `<p ${colorStyle}> point (${point.x}, ${point.y}): Morton Code = ${mortonCode.toString(2).padStart(bitLength, '0')} (decimal: ${mortonCode})</p>`;

        } else if (!isOutOfBounds(point)){
            // Morton-Code für direkte Nachbarpunkte berechnen
            if (index === 1) { // Oben
                mortonCode = (((centerMorton | x_mask) + 1n) & y_mask) | (centerMorton & x_mask);
            } else if (index === 7) { // Unten
                mortonCode = (((centerMorton & y_mask) - 1n) & y_mask) | (centerMorton & x_mask);
            } else if (index === 3) { // Links
                mortonCode = (((centerMorton & x_mask) - 1n) & x_mask) | (centerMorton & y_mask);
            } else if (index === 5) { // Rechts
                mortonCode = (((centerMorton | y_mask) + 1n) & x_mask) | (centerMorton & y_mask);
            } else if (index === 0) { // Oben links
                let temp = (((centerMorton | x_mask) + 1n) & y_mask) | (centerMorton & x_mask);
                mortonCode = (((temp & x_mask) - 1n) & x_mask) | (temp & y_mask);
            } else if (index === 2) { // Oben rechts
                let temp = (((centerMorton | x_mask) + 1n) & y_mask) | (centerMorton & x_mask);
                mortonCode = (((temp | y_mask) + 1n) & x_mask) | (temp & y_mask);
            } else if (index === 6) { // Unten links
                let temp = (((centerMorton & y_mask) - 1n) & y_mask) | (centerMorton & x_mask);
                mortonCode = (((temp & x_mask) - 1n) & x_mask) | (temp & y_mask);
            } else if (index === 8) { // Unten rechts
                let temp = (((centerMorton & y_mask) - 1n) & y_mask) | (centerMorton & x_mask);
                mortonCode = (((temp | y_mask) + 1n) & x_mask) | (temp & y_mask);
            }

            document.getElementById(`stencilResult-${pointId.id}`).innerHTML += 
            `<p> point (${point.x}, ${point.y}): Morton Code = ${mortonCode.toString(2).padStart(bitLength, '0')} (decimal: ${mortonCode})</p>`;
        }
    });
}

// Funktion, um die Morton-Codes der Punkte des Stencils (3d) auszugeben
function outputMortonCodes3D(points, layerIndex, pointId) {

    // Überschrift einmal ausgeben (vor der Ausgabe der Morton Codes des vorderen Layers)
    if (layerIndex == 0) {document.getElementById(`stencilResult-${pointId.id}`).innerHTML += `<h4>Morton Codes:</h4>`;}

    // Hilfsfunktion um Masken zu generieren
    function generateMask(pattern, bitLength) {
        let mask = 0n;
        for (let i = 0; i < bitLength; i += pattern.length) {
            for (let j = 0; j < pattern.length; j++) {
                if (i + j < bitLength && pattern[j] === "1") {
                    mask |= 1n << BigInt(i + j);
                }
            }
        }
        return mask;
    }

    let x3_mask;

    // Masken je nach layout
    if (layout == 'xyz') {
        x3_mask = generateMask("100", bitLength);
        y3_mask = generateMask("010", bitLength);
        z3_mask = generateMask("001", bitLength);        
    } else if (layout == 'zyx') {
        x3_mask = generateMask("001", bitLength);
        y3_mask = generateMask("010", bitLength);
        z3_mask = generateMask("100", bitLength);
    }

    const xy3_mask = x3_mask | y3_mask;
    const xz3_mask = x3_mask | z3_mask;
    const yz3_mask = y3_mask | z3_mask;

    // Mittelpunkt-Morton-Code je nach layer
    if (layerIndex == 0) {
        // center von dem layer z+1 (vorne)
        centerMorton = (((BigInt(pointId.mortonCode) | xy3_mask) +1n) & z3_mask) | (BigInt(pointId.mortonCode) & xy3_mask);
    } else if (layerIndex == 1) {
        // center von dem layer in der mitte
        centerMorton = BigInt(pointId.mortonCode);
    } else if (layerIndex == 2){
        // center von dem layer z-1 (hinten)
        centerMorton = (((BigInt(pointId.mortonCode) & z3_mask) -1n) & z3_mask) | (BigInt(pointId.mortonCode) & xy3_mask);
    }

    // prüfen, ob der jeweilige Nachbar außerhalb des Gültigkeitsbereichs ist
    function isOutOfBounds(point, z) {
        return point.x < 0 || point.y < 0 || z < 0 ||
               point.x > maxCoordinateValue || point.y > maxCoordinateValue || z > maxCoordinateValue;
    } 

    // Z Werte der layers 
    const layers = [
        pointId.z + 1,
        pointId.z,
        pointId.z - 1
    ];
 
    // schleife durch die points je layer
    points.forEach((point, index) => {
        let mortonCode;

        if (!isOutOfBounds(point, layers[layerIndex]) && index === 4) { // Mittelpunkt
            mortonCode = centerMorton;
            const colorStyle = layerIndex === 1 ? 'style="color: #0C9329;"' : '';

            // Morton-Code des Mittelpunkt ausgeben
            if (layout == 'xyz') {
                    document.getElementById(`stencilResult-${pointId.id}`).innerHTML += 
                `<p ${colorStyle}> point (${point.x}, ${point.y}, ${layers[layerIndex]}): Morton Code = ${mortonCode.toString(2).padStart(bitLength, '0')} (decimal: ${mortonCode})</p>`;
            } else if (layout == 'zyx') {
                document.getElementById(`stencilResult-${pointId.id}`).innerHTML += 
                `<p ${colorStyle}> point (${layers[layerIndex]}, ${point.y}, ${point.x}): Morton Code = ${mortonCode.toString(2).padStart(bitLength, '0')} (decimal: ${mortonCode})</p>`;
            }
        } else if (!isOutOfBounds(point, layers[layerIndex])){
            // Morton-Code für direkte Nachbarpunkte berechnen
            if (index === 1) { // Oben
                mortonCode = (((centerMorton | xz3_mask) +1n) & y3_mask) | (centerMorton & xz3_mask);
            } else if (index === 7) { // Unten
                mortonCode = (((centerMorton & y3_mask) -1n) & y3_mask) | (centerMorton & xz3_mask);
            } else if (index === 3) { // Links
                mortonCode = (((centerMorton & x3_mask) -1n) & x3_mask) | (centerMorton & yz3_mask);
            } else if (index === 5) { // Rechts
                mortonCode = (((centerMorton | yz3_mask) +1n) & x3_mask) | (centerMorton & yz3_mask);
            } else if (index === 0) { // Oben links
                let temp = (((centerMorton | xz3_mask) +1n) & y3_mask) | (centerMorton & xz3_mask);
                mortonCode = (((temp & x3_mask) -1n) & x3_mask) | (temp & yz3_mask);
            } else if (index === 2) { // Oben rechts
                let temp = (((centerMorton | xz3_mask) +1n) & y3_mask) | (centerMorton & xz3_mask);
                mortonCode = (((temp | yz3_mask) +1n) & x3_mask) | (temp & yz3_mask);
            } else if (index === 6) { // Unten links
                let temp = (((centerMorton & y3_mask) -1n) & y3_mask) | (centerMorton & xz3_mask);
                mortonCode = (((temp & x3_mask) -1n) & x3_mask) | (temp & yz3_mask);
            } else if (index === 8) { // Unten rechts
                let temp = (((centerMorton & y3_mask) -1n) & y3_mask) | (centerMorton & xz3_mask);
                mortonCode = (((temp | yz3_mask) +1n) & x3_mask) | (temp & yz3_mask);
            }

            // Ausgeben des Ergebnisses
            if (layout == 'xyz') {
                document.getElementById(`stencilResult-${pointId.id}`).innerHTML += 
                `<p> point (${point.x}, ${point.y}, ${layers[layerIndex]}): 
                Morton Code = ${mortonCode.toString(2).padStart(bitLength, '0')} 
                (decimal: ${mortonCode})</p>`;
            } else if (layout == 'zyx') {
                document.getElementById(`stencilResult-${pointId.id}`).innerHTML += 
                `<p> point (${layers[layerIndex]}, ${point.y}, ${point.x}): 
                Morton Code = ${mortonCode.toString(2).padStart(bitLength, '0')} 
                (decimal: ${mortonCode})</p>`;
            }
        }
    });
}
   
