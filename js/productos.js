//variable global para almacenar los productos cargados desde stock.json
let productos = [];


//función para cargar productos desde stock.json
const cargarProductos = async () => {
    try {
        const respuesta = await fetch('../data/stock.json');
        productos = await respuesta.json(); //guarda los productos en la variable global

        //llama a la función que muestra los productos
        mostrarProductos();
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
};


//función para mostrar los productos en el DOM
const mostrarProductos = () => {
    const productosLista = document.getElementById("productos-lista");

    //uso de la librería lodash para ordenar productos por precio
    const productosOrdenados = _.sortBy(productos, 'precio'); //orden ascendente por precio

    productosOrdenados.forEach((producto) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <p class="card-title">${producto.nombre}</p>
            <p class="card-text">Precio: $${producto.precio}</p>
            <p class="stock">Stock disponible: ${producto.cantidad_stock}</p>
            <button class="agregar-carrito" data-id="${producto.id}">Agregar al carrito</button>
        `;
        productosLista.appendChild(card);
    });
};


//función para agregar un producto al carrito
const agregarAlCarrito = (id) => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const producto = productos.find((prod) => prod.id === id);
    if (producto) {
        carrito.push(producto);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
    }
};


//función para mostrar productos en el carrito
const mostrarCarrito = () => {
    const carritoItems = document.getElementById("carrito-items");
    carritoItems.innerHTML = "";
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("carrito-item");
        div.innerHTML = `
            <p>${item.nombre} - $${item.precio}</p>
            <button class="eliminar-item" data-index="${index}">Eliminar</button>
        `;
        carritoItems.appendChild(div);
    });
};


//función para eliminar un producto del carrito
const eliminarDelCarrito = (index) => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
};


//función para actualizar el carrito
const actualizarCarrito = () => {
    mostrarCarrito();
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalSinIva = carrito.reduce((acc, item) => acc + item.precio, 0);
    const iva = totalSinIva * 0.21; //calcula el IVA (21%)
    const totalConIva = totalSinIva + iva;

    //muestra el total y el IVA en el DOM
    document.getElementById("total-carrito").textContent = totalSinIva.toFixed(2);
    document.getElementById("iva-carrito").textContent = iva.toFixed(2);
    document.getElementById("total-con-iva").textContent = totalConIva.toFixed(2);
};


//función para realizar la compra
const comprarCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (carrito.length > 0) {
        alert("¡Compra realizada con éxito! Total: $" + document.getElementById("total-con-iva").textContent);
        vaciarCarrito();
    } else {
        alert("Tu carrito está vacío.");
    }
};


//función para vaciar el carrito
const vaciarCarrito = () => {
    localStorage.removeItem("carrito");
    actualizarCarrito();
};


//eventos
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("agregar-carrito")) {
        const id = parseInt(e.target.dataset.id);
        agregarAlCarrito(id);
    }
    if (e.target.classList.contains("eliminar-item")) {
        const index = parseInt(e.target.dataset.index);
        eliminarDelCarrito(index);
    }
    if (e.target.id === "vaciar-carrito") {
        vaciarCarrito();
    }
    if (e.target.id === "comprar-carrito") {
        comprarCarrito();
    }
});


//inicializa la página y carga los productos
window.addEventListener("load", () => {
    cargarProductos(); //llama a la función para cargar los productos al cargar la página
    actualizarCarrito();
});