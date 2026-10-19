/* ======================================
   THERMOVERSE - FUNCIONES
====================================== */

const formulario = document.getElementById("formulario");
const entrada = document.getElementById("temperatura");
const unidadOrigen = document.getElementById("unidad");
const botonLimpiar = document.getElementById("limpiar");
const mensaje = document.getElementById("mensaje");
const botonArriba = document.getElementById("arriba");

const resultadosHTML = {
    C: document.getElementById("celsius"),
    K: document.getElementById("kelvin"),
    F: document.getElementById("fahrenheit"),
    R: document.getElementById("rankine")
};

const tarjetas = document.querySelectorAll(".resultado");

const simbolos = {
    C: "°C",
    K: "°K",
    F: "°F",
    R: "°R"
};


/* FORMATO DE NÚMEROS */

function formato(numero) {
    const redondeado = Number(numero.toFixed(2));
    const limpio = Object.is(redondeado, -0) ? 0 : redondeado;

    return limpio.toLocaleString("es-MX", {
        maximumFractionDigits: 2
    });
}


/* MENSAJES */

function mostrarMensaje(texto, error = false) {
    mensaje.textContent = texto;
    mensaje.classList.toggle("error", error);
}


/* CONVERTIR TEMPERATURA */

function convertir() {
    const texto = entrada.value.trim();
    const unidad = unidadOrigen.value;

    if (texto === "" || !Number.isFinite(Number(texto))) {
        mostrarMensaje(
            "Escribe una temperatura válida para continuar.",
            true
        );
        entrada.focus();
        return;
    }

    const valor = Number(texto);
    let celsius;

    // Convertimos el valor original a Celsius.
    switch (unidad) {
        case "C":
            celsius = valor;
            break;

        case "K":
            celsius = valor - 273.15;
            break;

        case "F":
            celsius = (valor - 32) / 1.8;
            break;

        case "R":
            celsius = (valor / 1.8) - 273.15;
            break;

        default:
            mostrarMensaje("Selecciona una escala válida.", true);
            return;
    }

    // Ninguna temperatura puede estar por debajo del cero absoluto.
    if (!Number.isFinite(celsius) || celsius < -273.150000001) {
        mostrarMensaje(
            "La temperatura no puede ser inferior al cero absoluto.",
            true
        );
        return;
    }

    // Corregimos pequeñas diferencias de precisión decimal.
    if (celsius < -273.15) {
        celsius = -273.15;
    }

    // Calculamos las otras escalas.
    const kelvin = celsius + 273.15;
    const fahrenheit = celsius * 1.8 + 32;
    const rankine = kelvin * 1.8;

    const valores = {
        C: celsius,
        K: kelvin,
        F: fahrenheit,
        R: rankine
    };

    if (!Object.values(valores).every(Number.isFinite)) {
        mostrarMensaje(
            "El valor es demasiado grande para realizar la conversión.",
            true
        );
        return;
    }

    // Actualizamos los resultados.
    Object.entries(resultadosHTML).forEach(([escala, elemento]) => {
        elemento.textContent =
            formato(valores[escala]) + " " + simbolos[escala];
    });

    // Reiniciamos y reproducimos la animación de cada tarjeta.
    tarjetas.forEach((tarjeta, indice) => {
        tarjeta.classList.remove("actualizado");
        tarjeta.style.animationDelay = `${indice * 90}ms`;

        // Fuerza el reinicio de la animación.
        void tarjeta.offsetWidth;

        tarjeta.classList.add("actualizado");
    });

    mostrarMensaje("✦ ¡Conversión realizada correctamente!");
}


/* ENVIAR EL FORMULARIO */

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();
    convertir();
});


/* LIMPIAR TODO */

botonLimpiar.addEventListener("click", function() {
    entrada.value = "";

    Object.values(resultadosHTML).forEach(elemento => {
        elemento.textContent = "—";
    });

    tarjetas.forEach(tarjeta => {
        tarjeta.classList.remove("actualizado");
        tarjeta.style.animationDelay = "";
    });

    mostrarMensaje("");
    entrada.focus();
});


/* BOTÓN VOLVER ARRIBA */

window.addEventListener("scroll", function() {
    botonArriba.classList.toggle("visible", window.scrollY > 350);
}, { passive: true });

botonArriba.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});