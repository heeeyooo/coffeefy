import { cart, removeFromCart } from "../data/cart.js";
import { products } from "../data/products.js";
import { deliveryOptions } from "../data/deliveryOptions.js";
import dayjs from "https://unpkg.com/dayjs@1.11.13/esm/index.js";

let orderSummaryHtml = "";
cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProduct;

    products.forEach((product) => {
        if (product.id === productId) {
            matchingProduct = product;
        }
    });

    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption;

    deliveryOptions.forEach((option) => {
        if (option.id === deliveryOptionId) {
            deliveryOption = option;
        }
    });
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    orderSummaryHtml += `
      <div class="cart-item-container js-cart-item-container-${
          matchingProduct.id
      }">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src=${matchingProduct.image}>

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${(matchingProduct.priceCents / 100).toFixed(2)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${
                        cartItem.quantity
                    }</span>
                  </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id="${
                      matchingProduct.id
                  }">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
${renderDeliveryOptions(matchingProduct, cartItem)}             
              </div>
            </div>
          </div>
    `;
});

document.querySelector(".js-order-summary").innerHTML = orderSummaryHtml;

const deleteBtn = document.querySelectorAll(".js-delete-quantity-link");

deleteBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        const productId = btn.dataset.productId;
        removeFromCart(productId);
        const itemContainer = document.querySelector(
            `.js-cart-item-container-${productId}`
        );
        itemContainer.remove();
    });
});

function renderDeliveryOptions(matchingProduct, cartItem) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
        const dateString = deliveryDate.format("dddd, MMMM D");
        const priceString =
            deliveryOption.priceCents === 0
                ? "FREE"
                : `$${(deliveryOption.priceCents / 100).toFixed(2)} -`;
        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
        html += `
  <div class="delivery-option js-delivery-option" data-product-id="${
      matchingProduct.id
  }" data-delivery-option-id="${deliveryOption.id}">
                  <input type="radio" ${isChecked ? "checked" : ""}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      ${dateString}
                    </div>
                    <div class="delivery-option-price">
                      ${priceString} Shipping
                    </div>
                  </div>
                </div>
    `;
    });
    return html;
}

document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
        const { productId, deliveryOptionId } = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
    });
});

function updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;

    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) matchingItem = cartItem;
    });

    matchingItem.deliveryOptionId = deliveryOptionId;
    localStorage.setItem("cart", JSON.stringify(cart));
}

let totalPriceCents = 0;
let totalQuantity = 0;
cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProduct;
    products.forEach((product) => {
        if (product.id === productId) {
            matchingProduct = product;
        }
    });
    totalPriceCents += matchingProduct.priceCents * cartItem.quantity;
    totalQuantity += cartItem.quantity;
});

const paymentSummaryHTML = `
   <div class="payment-summary-title">
          Order Summary
        </div>

        <div class="payment-summary-row">
          <div>Items (${totalQuantity}):</div>
          <div class="payment-summary-money">$${(totalPriceCents / 100).toFixed(
              2
          )}</div>
        </div>

        <div class="payment-summary-row">
          <div>Shipping &amp; handling:</div>
          <div class="payment-summary-money">$4.99</div>
        </div>

        <div class="payment-summary-row subtotal-row">
          <div>Total before tax:</div>
          <div class="payment-summary-money">$47.74</div>
        </div>

        <div class="payment-summary-row">
          <div>Estimated tax (10%):</div>
          <div class="payment-summary-money">$4.77</div>
        </div>

        <div class="payment-summary-row total-row">
          <div>Order total:</div>
          <div class="payment-summary-money">$52.51</div>
        </div>

        <button class="place-order-button button-primary">
          Place your order
        </button>
  `;

document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;
