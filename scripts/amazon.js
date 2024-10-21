import { products } from "../data/products.js";
import { cart } from "../data/cart.js";
import { wishList, removeFromWish } from "../data/wishList.js";
import { updateQuantity } from "../data/cart.js";

addEventListener("touchstart", function () {}, true);

// document.querySelector(".wrapper").style.display = "none";

// setTimeout(() => {
//     document.querySelector(".wrapper").style.display = "initial";
// }, 2000);

// setTimeout(() => {
//     document.querySelector(".loading").style.display = "none";
// }, 3000);

let productsHtml = "";

products.forEach((product) => {
    productsHtml += `
         <div class="product-container">
        <div class="product-image-container">
        <span class="product-wish js-product-wish" data-product-id=${
            product.id
        }><i class="fa-solid fa-heart"></i></span>
          <img class="product-image" src=${product.image}>
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars" src="images/ratings/rating-${
              product.rating.stars * 10
          }.png">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          $${(product.priceCents / 100).toFixed(2)}
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button js-add-to-cart-btn button-primary" data-product-id=${
            product.id
        }>
          Add to Cart
        </button>
      </div>
        `;
});
document.querySelector(".js-products-grid").innerHTML = productsHtml;

document.querySelectorAll(".js-product-wish").forEach((wishBtn) => {
    wishBtn.addEventListener("click", () => {
        if (wishBtn.style.color === "red") {
            wishBtn.style.color = "black";
        }
        const productId = wishBtn.dataset.productId;

        let matchingWish;

        wishList.forEach((wish) => {
            if (wish.id === productId) {
                matchingWish = wish;
            }
        });

        if (matchingWish) {
            removeFromWish(productId);
        } else {
            wishList.push({
                id: productId,
                isWish: true,
            });
            localStorage.setItem("wishList", JSON.stringify(wishList));

            let matchingWish;

            wishList.forEach((wish) => {
                if (wish.id === productId) {
                    matchingWish = wish;
                    console.log(matchingWish.isWish);
                    if (matchingWish.isWish === true) {
                        wishBtn.style.color = "red";
                    } else {
                        wishBtn.style.color = "black";
                    }
                }
            });
        }
    });

    const productId = wishBtn.dataset.productId;
    let matchingWish;

    wishList.forEach((wish) => {
        if (wish.id === productId) {
            matchingWish = wish;
            // console.log(matchingWish.isWish);
            if (matchingWish.isWish === true) {
                wishBtn.style.color = "red";
            } else {
                wishBtn.style.color = "black";
            }
        }
    });
});

document.querySelectorAll(".js-add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
        // Add visible class to show cart icon
        const addedToCart = event.target
            .closest("div")
            .querySelector(".js-added-to-cart");

        addedToCart.classList.add("js-added-to-cart-visible");
        setTimeout(() => {
            addedToCart.classList.remove("js-added-to-cart-visible");
        }, 2000);

        // Add products to the cart
        const productId = btn.dataset.productId;

        let matchingItem;

        cart.forEach((item) => {
            if (productId === item.productId) {
                matchingItem = item;
            }
        });
        if (matchingItem) {
            matchingItem.quantity += 1;
        } else {
            cart.push({
                productId: productId,
                quantity: 1,
                deliveryOptionId: "1",
            });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateQuantity();
    });
});

updateQuantity();

document.querySelector(".burger-btn").addEventListener("click", () => {
    document
        .querySelector(".burger-btn")
        .classList.toggle("burger-btn--active");
});

document.querySelectorAll(".search-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        document
            .querySelector(".search-section")
            .classList.add("search-section--active");
        document
            .querySelector(".dark-wrapper")
            .classList.add("dark-wrapper--active");
    });
});

document.querySelector(".close-search-btn").addEventListener("click", () => {
    document
        .querySelector(".search-section")
        .classList.remove("search-section--active");
    document
        .querySelector(".dark-wrapper")
        .classList.remove("dark-wrapper--active");
});

document.querySelector(".dark-wrapper").addEventListener("click", () => {
    document
        .querySelector(".dark-wrapper")
        .classList.remove("dark-wrapper--active");
    document
        .querySelector(".search-section")
        .classList.remove("search-section--active");
});

const searchInput = document.getElementById("search-input");
searchInput.addEventListener("focus", () => {});

searchInput.addEventListener("focusout", () => {});

searchInput.addEventListener("input", (e) => {
    const search = e.target.value;
    console.log(search);
    let searchHTML = "";

    products
        .filter((product) => {
            return search.toLowerCase().trim() === ""
                ? (searchHTML = "")
                : product.name
                      .toLowerCase()
                      .startsWith(search.toLowerCase().trim());
        })
        .forEach((product) => {
            searchHTML += `
         <div class="wish-product-container">
        <img src="${product.image}" alt="">
        <p>${product.name}</p>
        <p>${(product.priceCents / 100).toFixed(2)}</p>
    </div>
        `;
        });
    document.querySelector(".search-list").innerHTML = searchHTML;
});

document.querySelector(".search-btn-mobile").addEventListener("click", () => {
    document.querySelector(".search-list-mobile").style.width = "100%";
});
