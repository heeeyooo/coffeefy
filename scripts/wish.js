import { wishList } from "../data/wishList.js";
import { getProduct } from "../data/products.js";
import { updateQuantity } from "../data/cart.js";

let wishHTML = "";

wishList.forEach((wish) => {
    const productId = wish.id;

    const matchingItem = getProduct(productId);
    wishHTML += `
    <div class="wish-product-container">
        <img src="${matchingItem.image}" alt="">
        <p>${matchingItem.name}</p>
        <p>${(matchingItem.priceCents / 100).toFixed(2)}</p>
    </div>
    `;
});
document.querySelector(".wish-list-container").innerHTML = wishHTML;

updateQuantity();

document.querySelector(".burger-btn").addEventListener("click", () => {
    document
        .querySelector(".burger-btn")
        .classList.toggle("burger-btn--active");
});
