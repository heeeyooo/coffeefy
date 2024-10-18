import { wishList } from "../data/wishList.js";

let wishHTML = "";

wishList.forEach((wish) => {
    wishHTML += `
    <div class="wish-product-container">
        <img src="${wish.image}" alt="">
        <p>${wish.name}</p>
        <p>${(wish.priceCents / 100).toFixed(2)}</p>
    </div>
    `;
});
document.querySelector(".wish-list-container").innerHTML = wishHTML;
