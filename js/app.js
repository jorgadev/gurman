import { restaurants as importedRestaurants } from "./restaurants.js";

let view = "all";
const favButton = document.getElementById("fav-button");
const cards = document.getElementById("cards");
const search = document.getElementById("search-bar");
const sort = document.getElementById("sort");
const type = document.getElementById("type");
const addBtn = document.querySelector("#add-button");
const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".close-modal-btn");
const allBtn = document.getElementById("all-button");
const submitBtn = document.querySelector("#submit-button");

submitBtn.addEventListener("click", submitForm);
favButton.addEventListener("click", showFavorite);
type.addEventListener("input", tagsValue);
sort.addEventListener("input", sortValue);
search.addEventListener("input", (e) => searchByName(e.target.value));
addBtn.addEventListener("click", showModal);
closeModalBtn.addEventListener("click", hideModal);
allBtn.addEventListener("click", showAll);

let restaurants = JSON.parse(localStorage.getItem("restaurants"));
if (!restaurants) {
  localStorage.setItem("restaurants", JSON.stringify(importedRestaurants));
  restaurants = importedRestaurants;
}

//Render the Cards
function renderingCards(filteredValue) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const restMap = filteredValue.map((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src=${item.photo} alt=${item.name} class="card-image" />
      <div class="card-content">
        <h3 class="card-title">${item.name}</h3>
        <p class="card-description">Lokacija: ${item.location}</p>
        <p class="card-rating">Ocena: ${item.rating}</p>
        <p class="card-eta">ETA (v minutah): ${item.ETA}</p>
        <p class="card-tags">Oznake: ${item.Tags.join(", ")}</p>
        <button class="add-to-favorites" data-id="${item.id}">${
      favorites.some((fav) => fav.id === item.id)
        ? "Odstrani iz priljubljenih"
        : "Dodaj med priljubljene"
    }</button>
      </div>
    `;

    const addToFavButton = card.querySelector(".add-to-favorites");

    addToFavButton.addEventListener("click", () => {
      const index = favorites.findIndex((fav) => fav.id === item.id);
      if (index !== -1) {
        favorites.splice(index, 1);
        addToFavButton.textContent = "Dodaj med priljubljene";
        removeFromFav(item.id);
      } else {
        favorites.push(item);
        addToFavButton.textContent = "Odstrani iz priljubljenih";
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
    });

    return card;
  });
  cards.innerHTML = "";

  if (!filteredValue.length) {
    cards.innerHTML = `<p style="padding: 10px">Ni nobene restavracije za prikaz...</p>`;
    return;
  }

  restMap.forEach((card) => {
    cards.appendChild(card);
  });
}

function submitForm(event) {
  event.preventDefault();

  const name = document.querySelector("#name").value;
  const location = document.querySelector("#location").value;
  const photo = document.querySelector("#photo").value;
  const rating = parseInt(document.querySelector("#rating").value);
  const eta = parseInt(document.querySelector("#eta").value);
  const tags = document
    .querySelector("#tags")
    .value.split(",")
    .map((tag) => tag.trim());

  if (!name || !location || !photo || !rating || !eta || !tags) {
    alert("Prosim vnesite vse podatke.");
    return false;
  }

  const newRestaurant = {
    id: restaurants.length + 1,
    name: name,
    location: location,
    photo: photo,
    rating: rating,
    ETA: eta,
    Tags: tags,
  };

  restaurants.push(newRestaurant);
  localStorage.setItem("restaurants", JSON.stringify(restaurants));
  modal.style.display = "none";
  showAll();
}

// Remove from favorites
function removeFromFav(id, rerender = false) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const updatedFavorites = favorites.filter(
    (restaurant) => restaurant.id !== id
  );
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  const card = document.querySelector(`[data-id="${id}"]`);
  card.textContent = "Dodaj med priljubljene";

  if (view === "favorite") {
    renderingCards(updatedFavorites);
  }
}

//Adding the Functionality to Search
function searchByName(value) {
  const filteredValue = restaurants.filter((restaurant) => {
    return restaurant.name.toLowerCase().includes(value.toLowerCase());
  });
  renderingCards(filteredValue);
}

//Sorting restaurants based on Rating , ETA
function sortValue(event) {
  if (event.target.value === "Rating") {
    const sorting = restaurants.sort((a, b) => {
      return b.rating - a.rating;
    });
    renderingCards(sorting);
  } else if (event.target.value === "ETA") {
    const sortVal = restaurants.sort((a, b) => {
      return a.ETA - b.ETA;
    });
    renderingCards(sortVal);
  }
}

// Sorting restaurants by country
function tagsValue(event) {
  let val = event.target.value;
  const filter = restaurants.filter((fil) => {
    return fil.Tags.join("|")
      .toLowerCase()
      .split("|")
      .includes(val.toLowerCase());
  });
  renderingCards(filter);
}

// Show favorites
function showFavorite() {
  view = "favorite";
  let retrievedObject = localStorage.getItem("favorites");
  let parse = JSON.parse(retrievedObject);
  renderingCards(parse);
}

// Show all
function showAll() {
  view = "all";
  let retrievedObject = localStorage.getItem("restaurants");
  let parse = JSON.parse(retrievedObject);
  renderingCards(parse);
}

// Show and hide modal
function showModal() {
  modal.style.display = "block";
}
function hideModal() {
  modal.style.display = "none";
}

// Render cards
renderingCards(restaurants);
