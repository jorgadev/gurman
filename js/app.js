import { restaurants as importedRestaurants } from "./restaurants.js";

const favButton = document.getElementById("fav-button");
const cards = document.getElementById("cards");
const search = document.getElementById("search-bar");
const sort = document.getElementById("sort");
const type = document.getElementById("type");
const addBtn = document.querySelector("#add-button");
const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".close-modal-btn");
const allBtn = document.getElementById("all-button");

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
        <p class="card-description">Location: ${item.location}</p>
        <p class="card-rating">Rating: ${item.rating}</p>
        <p class="card-eta">ETA: ${item.ETA}</p>
        <p class="card-tags">Tags: ${item.Tags.join(", ")}</p>
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
    cards.innerHTML = "Ni nobene restavracije za prikaz...";
    return;
  }

  restMap.forEach((card) => {
    cards.appendChild(card);
  });
}

// Remove from favorites
function removeFromFav(id) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const updatedFavorites = favorites.filter(
    (restaurant) => restaurant.id !== id
  );
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  const card = document.querySelector(`[data-id="${id}"]`);
  card.textContent = "Dodaj med priljubljene";

  renderingCards(updatedFavorites);
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
  let retrievedObject = localStorage.getItem("favorites");
  let parse = JSON.parse(retrievedObject);
  renderingCards(parse);
}

// Show all
function showAll() {
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
