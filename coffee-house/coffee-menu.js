import products from "./products.json" assert { type: "json" };
console.log(products);

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

function getCardHTML({ id, name, description, price, category }) {
    const menuItemHTML = `
        <div class="card-wrapper" data-id="${id}" data-category="${category}">
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

function updateMenu(full = false) {
    grid.innerHTML = displayCards(productsList, activeTab, full);
}

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

function menuItemClickHandle(item) {
    showModal(productsList, item.dataset.id);
}

function interactionWithMenuArrow() {
    updateMenu((full = true));
    menuArrow.style.display = "none";
}

function updateMenuByResizeWindow() {
    windowWidth = window.innerWidth;
    updateMenu();
}
  
// Event listeners
tabs.forEach((tab) => tab.classList.remove("--selected"));
for (let tab of tabs) {
    tab.addEventListener("click", updateSelectedTab, { passive: true });
}
menuArrow.addEventListener("click", interactionWithMenuArrow);
window.addEventListener("resize", updateMenuByResizeWindow);
  
tabs[activeTab - 1].classList.toggle("--selected");
getProductData("./products.json");

menuArrow.addEventListener("click", () => console.log('arrow'));