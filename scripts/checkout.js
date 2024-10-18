import {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    inactiveBtn,
    emptyCart,
} from "../data/cart.js";
import { products, getProduct } from "../data/products.js";
import { deliveryOptions, getDeliveryOption } from "../data/deliveryOptions.js";
import dayjs from "https://unpkg.com/dayjs@1.11.13/esm/index.js";

function renderOrderSummary() {
    let orderSummaryHtml = "";
    cart.forEach((cartItem) => {
        const productId = cartItem.productId;

        const matchingProduct = getProduct(productId);

        const deliveryOptionId = cartItem.deliveryOptionId;

        const deliveryOption = getDeliveryOption(deliveryOptionId);

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
                    <button class="decrease-qty-btn" data-product-id="${
                        matchingProduct.id
                    }">-</button>
                    <button class="increase-qty-btn" data-product-id="${
                        matchingProduct.id
                    }">+</button>
                  <span>
                    Quantity: <span class="quantity-label">
                    ${cartItem.quantity}</span>
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
                    ${renderDeliveryOptions(
                        matchingProduct,
                        cartItem
                    )}             
              </div>
            </div>
          </div>
    `;
    });

    document.querySelector(".js-order-summary").innerHTML = orderSummaryHtml;

    const increaseQtyBtn = document.querySelectorAll(".increase-qty-btn");

    increaseQtyBtn.forEach((btn) => {
        btn.addEventListener("click", () => {
            const productId = btn.dataset.productId;
            // console.log(productId);
            increaseQty(productId);

            renderOrderSummary();

            renderPaymentSummary();
        });
    });

    const decreaseQtyBtn = document.querySelectorAll(".decrease-qty-btn");

    decreaseQtyBtn.forEach((btn) => {
        btn.addEventListener("click", () => {
            const productId = btn.dataset.productId;
            decreaseQty(productId);
            renderOrderSummary();
            renderPaymentSummary();
        });
    });

    document.querySelectorAll(".decrease-qty-btn").forEach((btn) => {
        const productId = btn.dataset.productId;
        inactiveBtn(productId, btn);
    });

    const deleteBtn = document.querySelectorAll(".js-delete-quantity-link");

    deleteBtn.forEach((btn) => {
        btn.addEventListener("click", () => {
            const productId = btn.dataset.productId;
            removeFromCart(productId);
            const itemContainer = document.querySelector(
                `.js-cart-item-container-${productId}`
            );
            itemContainer.remove();
            renderPaymentSummary();
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
            renderOrderSummary();
            renderPaymentSummary();
        });
    });
}

renderOrderSummary();

function updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;

    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) matchingItem = cartItem;
    });

    matchingItem.deliveryOptionId = deliveryOptionId;
    localStorage.setItem("cart", JSON.stringify(cart));
}

function renderPaymentSummary() {
    let totalPriceCents = 0;
    let totalQuantity = 0;
    let totalShipPriceCents = 0;
    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        totalQuantity += cartItem.quantity;
        totalPriceCents += product.priceCents * cartItem.quantity;
        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        totalShipPriceCents += deliveryOption.priceCents;
    });
    const totalBeforeTax = totalPriceCents + totalShipPriceCents;
    const totalAfterTax = totalBeforeTax * 0.1;
    const totalCents = totalBeforeTax + totalAfterTax;
    document.querySelector(".return-to-home-link").innerHTML =
        totalQuantity + " items";

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
          <div class="payment-summary-money">$${(
              totalShipPriceCents / 100
          ).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
          <div>Total before tax:</div>
          <div class="payment-summary-money">$${(totalBeforeTax / 100).toFixed(
              2
          )}</div>
        </div>

        <div class="payment-summary-row">
          <div>Estimated tax (10%):</div>
          <div class="payment-summary-money">$${(totalAfterTax / 100).toFixed(
              2
          )}</div>
        </div>

        <div class="payment-summary-row total-row">
          <div>Order total:</div>
          <div class="payment-summary-money">$${(totalCents / 100).toFixed(
              2
          )}</div>
        </div>

        <button class="place-order-button button-primary">
          Place your order
        </button>
  `;

    document.querySelector(".js-payment-summary").innerHTML =
        paymentSummaryHTML;
}

renderPaymentSummary();

document.querySelector(".delete-all-btn").addEventListener("click", () => {
    // localStorage.removeItem("cart");
    emptyCart();
    renderPaymentSummary();
    renderOrderSummary();
});
