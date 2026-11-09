
// Obtener los elementos de la pantalla
const operacion = document.getElementById("operacion");
const resultado = document.getElementById("resultado");

// Variables para controlar la calculadora
let expresion = "";
let terminado = false;

// Seleccionar todos los botones
const botones = document.querySelectorAll("button");

// Escuchar los clics de los botones
botones.forEach((boton) => {

    boton.addEventListener("click", () => {

        const valor = boton.dataset.valor;
        const accion = boton.dataset.accion;

        // Limpiar toda la operación
        if (accion === "limpiar") {
            limpiarCalculadora();
            return;
        }

        // Borrar el último carácter
        if (accion === "borrar") {
            expresion = expresion.slice(0, -1);
            actualizarPantalla();
            return;
        }

        // Agregar porcentaje
        if (accion === "porcentaje") {
            aplicarPorcentaje();
            return;
        }

        // Agregar decimal
        if (accion === "decimal") {
            agregarDecimal();
            return;
        }

        // Calcular el resultado
        if (accion === "calcular") {
            calcularResultado();
            return;
        }

        // Agregar números y operadores
        if (valor !== undefined) {

            const operadores = ["+", "-", "*", "/"];
            const ultimo = expresion.slice(-1);

            if (terminado && !operadores.includes(valor)) {
                expresion = "";
            }

            if (operadores.includes(valor)) {
                terminado = false;

                if (expresion === "" && valor !== "-") {
                    return;
                }

                if (operadores.includes(ultimo)) {
                    expresion = expresion.slice(0, -1);
                }
            } else {
                terminado = false;
            }

            expresion += valor;
            actualizarPantalla();
        }
    });
});

// Actualizar la pantalla
function actualizarPantalla() {
    operacion.textContent = expresion;
    resultado.textContent = expresion || "0";
}

// Limpiar calculadora
function limpiarCalculadora() {
    expresion = "";
    terminado = false;
    operacion.textContent = "";
    resultado.textContent = "0";
}

// Agregar punto decimal
function agregarDecimal() {

    const partes = expresion.split(/[+\-*/]/);
    const ultimoNumero = partes[partes.length - 1];

    if (!ultimoNumero.includes(".")) {

        if (terminado) {
            expresion = "";
            terminado = false;
        }

        expresion += ultimoNumero === "" ? "0." : ".";
        actualizarPantalla();
    }
}

// Aplicar porcentaje
function aplicarPorcentaje() {

    const coincidencia = expresion.match(
        /(-?\d+\.?\d*)$/
    );

    if (coincidencia) {

        const numero = Number(coincidencia[0]);
        const porcentaje = numero / 100;

        expresion = expresion.slice(
            0,
            -coincidencia[0].length
        ) + porcentaje;

        terminado = false;
        actualizarPantalla();
    }
}

// Calcular operación
function calcularResultado() {

    if (expresion === "") {
        return;
    }

    try {

        // Validar que solo existan caracteres permitidos
        if (!/^[0-9+\-*/. ]+$/.test(expresion)) {
            throw new Error("Operación no válida");
        }

        // Evitar operadores al final
        if (/[+\-*/.]$/.test(expresion)) {
            throw new Error("Operación incompleta");
        }

        const calculo = Function(
            '"use strict"; return (' + expresion + ')'
        )();

        // Evitar división por cero y resultados inválidos
        if (!Number.isFinite(calculo)) {
            throw new Error("Resultado no válido");
        }

        // Mostrar resultado
        const valorFinal = Number(
            calculo.toPrecision(12)
        );

        operacion.textContent = expresion + " =";
        resultado.textContent = valorFinal;

        expresion = String(valorFinal);
        terminado = true;

    } catch (error) {

        resultado.textContent = "Error";
        operacion.textContent = "Operación no válida";

        expresion = "";
        terminado = false;
    }
}
