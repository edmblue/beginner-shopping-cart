//variables
const divCurso = document.querySelector('#lista-cursos');
const tableCarrito = document.querySelector('#lista-carrito tbody');
let listaCarrito = [];
const carrito = document.querySelector('#carrito');

callEventListeners();

function callEventListeners() {
  document.addEventListener('DOMContentLoaded', startApp);
  divCurso.addEventListener('click', agregarCurso);
  carrito.addEventListener('click', eliminarItems);
}

function startApp() {
  listaCarrito = JSON.parse(localStorage.getItem('listaCarrito')) || '[]';
  listaCarritoHTML();
}

function agregarCurso(e) {
  e.preventDefault();
  if (e.target.classList.contains('agregar-carrito')) {
    let cursoSeleccionado = e.target.parentElement.parentElement;
    getInfoCurso(cursoSeleccionado);
  }
}

function getInfoCurso(cursoSeleccionado) {
  const infoCurso = {
    titulo: cursoSeleccionado.querySelector('h4').textContent,
    precio: cursoSeleccionado.querySelector('.precio span').textContent,
    imagen: cursoSeleccionado.querySelector('img').src,
    id: cursoSeleccionado
      .querySelector('.agregar-carrito')
      .getAttribute('data-id'),
    cantidad: 1,
  };

  let existe = listaCarrito.some((producto) => producto.id === infoCurso.id);
  if (existe) {
    let listaCarritoCantidadActualizada = listaCarrito.map((producto) => {
      if (producto.id === infoCurso.id) {
        producto.cantidad++;
        return producto;
      } else {
        return producto;
      }
    });

    listaCarrito = [...listaCarritoCantidadActualizada];
  } else {
    listaCarrito = [...listaCarrito, infoCurso];
  }

  listaCarritoHTML();
}

function listaCarritoHTML() {
  vaciarCarrito();

  listaCarrito.forEach((carritoItem) => {
    let { titulo, precio, imagen, id, cantidad } = carritoItem;
    let row = document.createElement('tr');
    row.innerHTML = `
    <td><img src="${imagen}" width="100px"></td>
    <td>${titulo}</td>
    <td>${precio}</td>
    <td>${cantidad}</td>
    <td>
        <a href="#" class="borrar-curso" data-id="${id}">X</a>
    </td>
    `;
    tableCarrito.appendChild(row);
  });

  sincronizarStorage(listaCarrito);
}

function sincronizarStorage(itemAGuardar) {
  localStorage.setItem('listaCarrito', JSON.stringify(itemAGuardar));
}

function eliminarItems(e) {
  if (e.target.classList.contains('borrar-curso')) {
    let itemAEliminarId = e.target.getAttribute('data-id');
    let listaActualizadoItemEliminar = listaCarrito.filter(
      (item) => item.id !== itemAEliminarId
    );

    listaCarrito = [...listaActualizadoItemEliminar];

    listaCarritoHTML();
  } else if (e.target.id === 'vaciar-carrito') {
    listaCarrito = [];
    vaciarCarrito();
  }
}

function vaciarCarrito() {
  while (tableCarrito.firstChild) {
    tableCarrito.removeChild(tableCarrito.firstChild);
  }
}
