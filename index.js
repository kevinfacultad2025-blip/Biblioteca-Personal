const API = "http://localhost:3000";

let libros = [];
let generos = [];
let anotaciones = [];

const listaLibros = document.getElementById("lista-libros");
const listaGeneros = document.getElementById("lista-generos");
const listaAnotaciones = document.getElementById("lista-anotaciones");

const modalLibro = document.getElementById("modalLibro");
const modalGenero = document.getElementById("modalGenero");

const abrirLibro = document.getElementById("abrirLibro");
const abrirGenero = document.getElementById("abrirGenero");

const cerrarLibro = document.getElementById("cerrarLibro");
const cerrarGenero = document.getElementById("cerrarGenero");

const formLibro = document.getElementById("formLibro");
const formGenero = document.getElementById("formGenero");

const generoSelect = document.getElementById("generoSelect");

abrirLibro.addEventListener("click", () =>
    modalLibro.classList.add("show")
);

cerrarLibro.addEventListener("click", () =>
    modalLibro.classList.remove("show")
);

abrirGenero.addEventListener("click", () =>
    modalGenero.classList.add("show")
);

cerrarGenero.addEventListener("click", () =>
    modalGenero.classList.remove("show")
);

window.addEventListener("DOMContentLoaded", async () => {
    await cargarGeneros();
    await cargarLibros();
});

async function cargarGeneros() {

    generos =
        (await axios.get(`${API}/generos`)).data;

    renderizarGeneros();
    cargarSelectGeneros();
}

function cargarSelectGeneros() {

    generoSelect.textContent = "";

    const opcionInicial =
        document.createElement("option");

    opcionInicial.value = "";
    opcionInicial.textContent =
        "Seleccione un género";

    opcionInicial.selected = true;

    generoSelect.appendChild(opcionInicial);

    generos.forEach(genero => {

        const option =
            document.createElement("option");

        option.value = genero.id;
        option.textContent = genero.nombre;

        generoSelect.appendChild(option);
    });
}

function renderizarGeneros() {

    listaGeneros.textContent = "";

    generos.forEach(genero => {

        const card = document.createElement("div");

        const nombre = document.createElement("h3");
        nombre.textContent = genero.nombre;

        const editar = document.createElement("button");
        editar.textContent = "Editar";
        editar.classList.add("btn-editar");

        const eliminar = document.createElement("button");
        eliminar.textContent = "Eliminar";
        eliminar.classList.add("btn-eliminar");

        editar.addEventListener("click", () => editarGenero(genero));

        eliminar.addEventListener("click", () => eliminarGenero(genero.id));

        card.style.borderLeft = `10px solid ${genero.color}`;

        card.appendChild(nombre);
        card.appendChild(editar);
        card.appendChild(eliminar);

        listaGeneros.appendChild(card);
    });
}

formGenero.addEventListener("submit", async (e) => {

    e.preventDefault();

    const genero = {
        nombre: document.getElementById("nombreGenero").value,
        color: document.getElementById("colorGenero").value
    };

    await axios.post(`${API}/generos`, genero);

    formGenero.reset();

    modalGenero.classList.remove("show");

    await cargarGeneros();
});

async function editarGenero(genero) {

    const nuevoNombre = prompt("Nuevo nombre", genero.nombre);

    if (!nuevoNombre?.trim()) return;

    await axios.patch(`${API}/generos/${genero.id}`, {
        nombre: nuevoNombre
    });

    await cargarGeneros();
}        

async function eliminarGenero(id) {

    const response = await axios.get(`${API}/libros`);

    const asociados = response.data.filter(
    libro =>
        String(libro.generoId) === String(id)
);

    if (asociados.length > 0) {

        alert("Hay libros asociados a este género");

        return;
    }

    await axios.delete(`${API}/generos/${id}`);

    await cargarGeneros();
}

async function cargarLibros() {

    libros =
        (await axios.get(`${API}/libros`)).data;

    renderizarLibros();
}

function renderizarLibros() {

    listaLibros.textContent = "";

    libros.forEach(libro => {

        const genero = generos.find(
    g => String(g.id) === String(libro.generoId)
);

        const card = document.createElement("div");

        card.classList.add("card-libro");

        if (libro.url) {

    const imagen = document.createElement("img");

    imagen.src = libro.url;
    imagen.alt = libro.titulo;

    imagen.classList.add("portada-libro");

    card.appendChild(imagen);
}

        const titulo = document.createElement("h3");
        titulo.textContent = libro.titulo;

        const autor = document.createElement("p");
        autor.textContent = `Autor: ${libro.autor}`;

        const anio = document.createElement("p");
        anio.textContent = `Año: ${libro.anio}`;

        const paginas = document.createElement("p");
        paginas.textContent = `Páginas: ${libro.paginas}`;

        const estado = document.createElement("p");
        estado.textContent = `Estado: ${libro.estado}`;

        const generoTexto = document.createElement("p");
        generoTexto.textContent =
            genero ? `Género: ${genero.nombre}` : "Género: Sin género";

        const verNotas = document.createElement("button");
        verNotas.textContent = "Ver Anotaciones";

        const editar = document.createElement("button");
        editar.textContent = "✏️ Editar";
        editar.classList.add("btn-editar");

        const eliminar = document.createElement("button");
        eliminar.textContent = "🗑 Eliminar";
        eliminar.classList.add("btn-eliminar");

        verNotas.addEventListener("click", () => {
            cargarAnotaciones(libro.id);
        });

        editar.addEventListener("click", () => {
            editarLibro(libro);
        });

        eliminar.addEventListener("click", () => {
            eliminarLibro(libro.id);
        });

        card.appendChild(titulo);
        card.appendChild(autor);
        card.appendChild(anio);
        card.appendChild(paginas);
        card.appendChild(estado);
        card.appendChild(generoTexto);
        card.appendChild(verNotas);
        card.appendChild(editar);
        card.appendChild(eliminar);

        listaLibros.appendChild(card);
    });
}

formLibro.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!generoSelect.value) {

    alert("Debe seleccionar un género");

    return;
}

    const libro = {

        titulo: document.getElementById("titulo").value,

        autor: document.getElementById("autor").value,

        anio: Number(
            document.getElementById("anio").value
        ),

        paginas: Number(
            document.getElementById("paginas").value
        ),

        estado: document.getElementById("estado").value,

        generoId: generoSelect.value,

        url: document.getElementById("url").value
    };

    await axios.post(`${API}/libros`, libro);

    formLibro.reset();

    modalLibro.classList.remove("show");

    await cargarLibros();
});

async function editarLibro(libro) {

    const nuevoTitulo = prompt(
        "Nuevo título",
        libro.titulo
    );

    if (!nuevoTitulo?.trim()) return;

    await axios.patch(`${API}/libros/${libro.id}`, {
        titulo: nuevoTitulo
    });

    await cargarLibros();
}

async function eliminarLibro(id) {

    const confirmar = confirm(
        "¿Eliminar libro?"
    );

    if (!confirmar) return;

    const response = await axios.get(
        `${API}/anotaciones?libroId=${id}`
    );

    const notas = response.data;

    for (const nota of notas) {

        await axios.delete(
            `${API}/anotaciones/${nota.id}`
        );
    }

    await axios.delete(
        `${API}/libros/${id}`
    );

    listaAnotaciones.textContent = "";

    await cargarLibros();
}

let libroActivo = null;

async function cargarAnotaciones(libroId) {

    libroActivo = libroId;

    const response = await axios.get(
        `${API}/anotaciones?libroId=${libroId}`
    );

    anotaciones = response.data;

    listaAnotaciones.textContent = "";

    const titulo = document.createElement("h2");
    titulo.textContent = "Anotaciones";

    listaAnotaciones.appendChild(titulo);

    const botonNueva = document.createElement("button");
    botonNueva.textContent = "➕ Nueva anotación";

    botonNueva.classList.add("btn-agregar");

    botonNueva.addEventListener(
        "click",
        crearAnotacion
    );

    listaAnotaciones.appendChild(botonNueva);

    if(anotaciones.length === 0){

        const mensaje = document.createElement("p");

        mensaje.textContent =
        "Este libro todavía no tiene anotaciones.";

        listaAnotaciones.appendChild(mensaje);

        return;
    }

    renderizarAnotaciones();
}

function renderizarAnotaciones() {

    listaAnotaciones.textContent = "";

    const titulo = document.createElement("h3");

    titulo.textContent =
        "Anotaciones del libro seleccionado";

    listaAnotaciones.appendChild(titulo);

    const botonNueva = document.createElement("button");

    botonNueva.textContent =
        "Nueva anotación";

    botonNueva.addEventListener(
        "click",
        crearAnotacion
    );

    listaAnotaciones.appendChild(
        botonNueva
    );

    anotaciones.forEach(anotacion => {

        const card = document.createElement("div");

        const texto = document.createElement("p");

        texto.textContent =
            anotacion.texto;

        const pagina = document.createElement("p");

        pagina.textContent =
            `Página: ${anotacion.pagina}`;

        const fecha = document.createElement("p");

        fecha.textContent =
            `Fecha: ${anotacion.fecha}`;

        const editar =
            document.createElement("button");

        editar.textContent = "Editar";
        editar.classList.add("btn-editar");

        const eliminar =
            document.createElement("button");

        eliminar.textContent = "Eliminar";
        eliminar.classList.add("btn-eliminar");

        editar.addEventListener(
            "click",
            () => editarAnotacion(anotacion)
        );

        eliminar.addEventListener(
            "click",
            () => eliminarAnotacion(anotacion.id)
        );

        card.appendChild(texto);
        card.appendChild(pagina);
        card.appendChild(fecha);
        card.appendChild(editar);
        card.appendChild(eliminar);

        listaAnotaciones.appendChild(card);
    });
}

async function crearAnotacion() {

    if (!libroActivo) {

        alert(
            "Seleccione primero un libro"
        );

        return;
    }

    const texto = prompt(
        "Ingrese la anotación"
    );

    if (!texto) return;

    const pagina = prompt(
        "Número de página"
    );

    const hoy =
    new Date().toISOString().split("T")[0];

    await axios.post(
        `${API}/anotaciones`,
        {
            libroId: libroActivo,
            texto: texto,
            pagina: Number(pagina),
            fecha: hoy
        }
    );

    await cargarAnotaciones(
        libroActivo
    );
}

async function editarAnotacion(
    anotacion
) {

    const nuevoTexto = prompt(
        "Editar texto",
        anotacion.texto
    );

    if (!nuevoTexto?.trim()) return;

    await axios.patch(
        `${API}/anotaciones/${anotacion.id}`,
        {
            texto: nuevoTexto
        }
    );

    await cargarAnotaciones(
        libroActivo
    );
}

async function eliminarAnotacion(
    id
) {

    const confirmar = confirm(
        "¿Eliminar anotación?"
    );

    if (!confirmar) return;

    await axios.delete(
        `${API}/anotaciones/${id}`
    );

    await cargarAnotaciones(
        libroActivo
    );
}