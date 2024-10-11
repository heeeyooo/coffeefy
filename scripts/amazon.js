import { products } from "../data/products.js";
import { cart } from "../data/cart.js";

let productsHtml = "";

products.forEach((product) => {
    productsHtml += `
         <div class="product-container">
        <div class="product-image-container">
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
            });
        }

        let cartQuantity = 0;

        cart.forEach((item) => {
            cartQuantity += item.quantity;
        });
        document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;

        console.log(cart);
    });
});
