import { db } from './firebaseConfig.js';
import {
  collection, getDocs, addDoc,
  deleteDoc, doc, updateDoc
} from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';

const form = document.getElementById('movieForm');
const title = document.getElementById('title');
const description = document.getElementById('description');
const year = document.getElementById('year');
const imageUrlInput = document.getElementById('imageUrl');
const movieId = document.getElementById('movieId');
const tableBody = document.getElementById('movieTableBody');
const searchInput = document.getElementById('searchInput');

const detailTitle = document.getElementById('detailTitle');
const detailDescription = document.getElementById('detailDescription');
const detailYear = document.getElementById('detailYear');
const detailImage = document.getElementById('detailImage');

const peliculasRef = collection(db, 'peliculas');
let movieIdToDelete = null;

// Mostrar detalles
window.showDetails = (title, description, year, imageUrl) => {
  detailTitle.textContent = title;
  detailDescription.textContent = description;
  detailYear.textContent = year;
  detailImage.src = imageUrl || '';
};

// Editar
window.editMovie = (id, titleVal, desc, yr, imgUrl) => {
  movieId.value = id;
  title.value = titleVal;
  description.value = desc;
  year.value = yr;
  imageUrlInput.value = imgUrl;
};

// Eliminar
window.deleteMovie = (id) => {
  movieIdToDelete = id;
  new bootstrap.Modal(document.getElementById('confirmDeleteModal')).show();
};

document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
  if (movieIdToDelete) {
    await deleteDoc(doc(db, 'peliculas', movieIdToDelete));
    movieIdToDelete = null;
    bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal')).hide();
    loadMovies();
  }
});

// Guardar película
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    title: title.value,
    description: description.value,
    year: parseInt(year.value),
    imageUrl: imageUrlInput.value
  };

  if (movieId.value) {
    await updateDoc(doc(db, 'peliculas', movieId.value), data);
    movieId.value = '';
  } else {
    await addDoc(peliculasRef, data);
  }

  form.reset();
  bootstrap.Modal.getInstance(document.getElementById('movieModal')).hide();
  loadMovies();
});

// Cargar películas
export async function loadMovies() {
  tableBody.innerHTML = '';
  const querySnapshot = await getDocs(peliculasRef);

  querySnapshot.forEach(docSnap => {
    const data = docSnap.data();
    const safeTitle = data.title.replace(/'/g, "\\'");
    const safeDesc = data.description.replace(/'/g, "\\'");
    const safeImg = data.imageUrl?.replace(/'/g, "\\'") || '';
    const imageCell = data.imageUrl
      ? `<img src="${data.imageUrl}" width="60" class="rounded">`
      : `<span class="text-muted">Sin imagen</span>`;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${imageCell}</td>
      <td>
        <a href="#" data-bs-toggle="modal" data-bs-target="#detailModal"
           onclick="showDetails('${safeTitle}', '${safeDesc}', '${data.year}', '${safeImg}')">
          ${data.title}
        </a>
      </td>
      <td>${data.description}</td>
      <td>${data.year}</td>
      <td>
        <button class="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#movieModal"
          onclick="editMovie('${docSnap.id}', '${safeTitle}', '${safeDesc}', ${data.year}, '${safeImg}')">
          Editar
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteMovie('${docSnap.id}')">Eliminar</button>
      </td>`;
    tableBody.appendChild(row);
  });
}

// Búsqueda
searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase();
  Array.from(tableBody.children).forEach(row => {
    const match = row.children[1].textContent.toLowerCase().includes(term);
    row.style.display = match ? '' : 'none';
  });
});

// Inicial
loadMovies();
