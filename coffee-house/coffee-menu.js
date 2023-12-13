import products from "./products.json" assert { type: "json" };
console.log(products);

// Cards with products at menu
const grid = document.querySelector(".grid");
const tabs = document.querySelectorAll(".tab");
const menuArrow = document.getElementById("menu-arrow");

let activeTab = 1;
let productsList = [];
let windowWidth = window.innerWidth;
let full;

async function getProductData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error();
    }
  
    const data = await response.json();
    productsList = [...data];
  
    updateMenu();
  } catch (error) {
    console.log(error);
  }
}
getProductData("./products.json");

function getCardHTML({ id, name, description, price, category }) {
  const menuItemHTML = `
    <div onclick="showModalByClickOnCard(this)" class="card-wrapper" data-id="${id}" data-category="${category}">
      <div class="product-photo" id="${category}-photo-${id}"></div>
      <div class="card-description">
        <div class="card-title">
          <h3>${name}</h3>
          <p>${description}</p>
        </div>
        <p class="product-price">${price}</p>
      </div>
    </div>
  `;
  
  return menuItemHTML;
}

function displayCards(products, activeTab, full) {
  const cardsHTML = [];
  const category =
    activeTab == 1
      ? "coffee"
      : activeTab == 2
      ? "tea"
      : activeTab == 3
      ? "dessert"
      : "";
  
  const filterProducts = products.filter(
    (product) => product.category === category
  );

  for (let filteredProduct of filterProducts) {
    cardsHTML.push(getCardHTML(filteredProduct));
  }

  if (filterProducts.length > 4) {
    menuArrow.style.display = "flex";
  } else {
    menuArrow.style.display = "none";
  }
  
  if (!full && windowWidth <= 768) {
    return cardsHTML.slice(0, 4).join("");
  }
    
  if (windowWidth > 768) {
    menuArrow.style.display = "none";
  }
  
  return cardsHTML.join("");
}

function showModalByClickOnCard(item) {
  showModal(productsList, item.dataset.category, item.dataset.id);
}
window.showModalByClickOnCard = showModalByClickOnCard;

function updateMenu(full = false) {
  grid.innerHTML = displayCards(productsList, activeTab, full);
}
  
// Tabs
function updateSelectedTab() {
  if (this.dataset.index === activeTab) {
    return;
  }

  tabs[activeTab - 1].classList.toggle("--selected");
  activeTab = this.dataset.index;
  tabs[activeTab - 1].classList.toggle("--selected");

  grid.style.opacity = "0";
  setTimeout(() => {
    updateMenu();
    grid.style.opacity = "1";
  }, 200);
}

tabs.forEach((tab) => tab.classList.remove("--selected"));

for (let tab of tabs) {
    tab.addEventListener("click", updateSelectedTab, { passive: true });
}
  
tabs[activeTab - 1].classList.toggle("--selected");

// Update menu by refresh arrow and resize window
function interactionWithMenuArrow() {
  updateMenu((full = true));
  menuArrow.style.display = "none";
}

function updateMenuByResizeWindow() {
  windowWidth = window.innerWidth;
  updateMenu();
}

menuArrow.addEventListener("click", interactionWithMenuArrow);
window.addEventListener("resize", updateMenuByResizeWindow);

// Modal
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const HTML = document.querySelector('html');

let currentPrice = 0;
let selectedSize = 1;
let selectedAdditives = [false, false, false];
let isOpenModal = false;

function getModalHTML({ id, name, description, price, category, sizes, additives }) {
  currentPrice = parseFloat(price);
  selectedSize = 1;
  selectedAdditives = [false, false, false];
  const modalHTML = `
  <div class="preview">
    <div class="product-photo" id="${category}-photo-${id}"></div>
  </div>
  <div class="modal-card-description">
    <div class="card-title">
        <h3>${name}</h3>
        <p>${description}</p>
    </div>
    <div class="modal-block size">
        <p>Size</p>
        <div class="modal-tabs">
            <button onclick="tabFeatures(this)" class="tab tab-modal --selected" data-tabindex="1" data-tabfeat="sizes">
                <span class="tab-ico">S</span>
                <span class="tab-text">${sizes.s.size}</span>
            </button>
            <button onclick="tabFeatures(this)" class="tab tab-modal" data-tabindex="2" data-tabfeat="sizes">
                <span class="tab-ico">M</span>
                <span class="tab-text">${sizes.m.size}</span>
            </button>
            <button onclick="tabFeatures(this)" class="tab tab-modal" data-tabindex="3" data-tabfeat="sizes">
                <span class="tab-ico">L</span>
                <span class="tab-text">${sizes.l.size}</span>
            </button>
        </div>
    </div>
    <div class="modal-block additives">
        <p>Additives</p>
        <div class="modal-tabs">
            <button onclick="tabFeatures(this)" class="tab tab-modal" data-tabindex="1" data-tabfeat="additives">
                <span class="tab-ico">1</span>
                <span class="tab-text">${additives[0].name}</span>
            </button>
            <button onclick="tabFeatures(this)" class="tab tab-modal" data-tabindex="2" data-tabfeat="additives">
                <span class="tab-ico">2</span>
                <span class="tab-text">${additives[1].name}</span>
            </button>
            <button onclick="tabFeatures(this)" class="tab tab-modal" data-tabindex="3" data-tabfeat="additives">
                <span class="tab-ico">3</span>
                <span class="tab-text">${additives[2].name}</span>
            </button>
        </div>
    </div>
    <div class="total">
        <h3>Total:</h3>
        <p class="product-price" id="total-price">$${price}</p>
    </div>
    <div class="alert">
        <img class="info-ico" src="./assets/icons/info-empty.svg" alt="info">
        <p class="alert-text">The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.</p>
    </div>
    <button class="big-button button-icon-dark close" id="close-button">
        <span class="button-text">Close</span>
    </button>
  </div>
  `;

  return modalHTML;
}

function showModal(productsList, category, id) {
  isOpenModal = true;
  for (let productData of productsList) {
    if (productData.category === category && productData.id === id) {
      modal.innerHTML = getModalHTML(productData);
    }
  }

  modal.style.display = "flex";
  overlay.style.display = "flex";
  setTimeout(() => {
    modal.style.opacity = 1;
  }, 0);

  HTML.style.overflow = "hidden";
}

function closeModal() {
  modal.style.opacity = 0;
  setTimeout(() => {
    overlay.style.display = "none";
    modal.style.display = "none";
    isOpenModal = false;
  }, 0);

  HTML.style.overflow = "";
}

window.addEventListener(
  "click",
  (e) => {
    if ( isOpenModal &&
      (e.target.id === "overlay" || e.target.id === "close-button" || e.target.parentNode.id === "close-button")) {
      closeModal();
      return;
    }
  }, true
);

// Modal tabs
function tabFeatures(tab) {
  if (tab.dataset.tabfeat === "sizes") {
    if (selectedSize == tab.dataset.tabindex) {
      return;
    }

    document.getElementsByClassName("tab-modal")[selectedSize - 1].classList.remove("--selected");

    tab.classList.add("--selected");

    selectedSize = tab.dataset.tabindex;
  } else {
    if (selectedAdditives[tab.dataset.tabindex - 1]) {
      tab.classList.remove("--selected");
      selectedAdditives[tab.dataset.tabindex - 1] = false;
    } else {
      tab.classList.add("--selected");
      selectedAdditives[tab.dataset.tabindex - 1] = true;
    }
  }

  updateTotalPrice();
}
window.tabFeatures = tabFeatures;

function updateTotalPrice() {
  const sizeAddPrice = 0.5 * (selectedSize - 1);
  const additiveAddPrice = 0.5 * selectedAdditives.filter((el) => el).length;

  document.getElementById("total-price").innerHTML = `
  $${(currentPrice + sizeAddPrice + additiveAddPrice).toFixed(2)}`;
}