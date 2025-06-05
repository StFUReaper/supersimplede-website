import { cart, removeFromCart, updateDeliveryOption } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { hello } from "https://unpkg.com/supersimpledev@1.0.1/hello.esm.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { formatCurrency } from "../utils/money.js";
import { renderPaymentSummary } from "./paymentSumary.js";

export function renderOrderSummary() {
  let cartSumaryHTML = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    let matchingProduct = getProduct(productId);
    let deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    let deliveryDate = dayjs().add(deliveryOption.deliveryDays, "days");

    cartSumaryHTML += `
    <div class="cart-item-container
        js-cart-item-container
        js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        
      ${deliveryDate.format("dddd, MMMM D")}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            ${matchingProduct.getPrice()}
          </div>
          <div class="product-quantity
          js-product-quantity-${productId}">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary">
              Update
            </span>
            <span class="
            delete-quantity-link 
            link-primary 
            js-delete-link 
            js-delete-link-${matchingProduct.id}"
            data-product-id="${cartItem.productId}">
              Delete
            </span>
          </div>
        </div>
        <div class="delivery-options js-delivery-options">
          ${deliveryOptionsHTML(cartItem)}
        </div>
      </div>
    </div>
  `;
  });

  document.querySelector(".js-order-summary").innerHTML = cartSumaryHTML;

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      console.log("Delete link clicked!");
      const productId = link.dataset.productId;
      removeFromCart(productId);
      document.querySelector(`.js-cart-item-container-${productId}`).remove();
    });
  });

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      console.log("Delivery option clicked!");
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}

function deliveryOptionsHTML(cartItem) {
  const dateToday = dayjs();

  let resultHTML = `          
    <div class="delivery-options-title">
      Choose a delivery option:
    </div>
    `;
  deliveryOptions.forEach((option) => {
    let priceText =
      option.priceCents === 0
        ? "FREE"
        : "$" + formatCurrency(option.priceCents);
    const isChecked = option.id == cartItem.deliveryOptionId;
    resultHTML += `            
    <div class="delivery-option js-delivery-option"
    data-product-id="${cartItem.productId}"
    data-delivery-option-id="${option.id}">
      <input type="radio"
        ${isChecked ? "checked" : ""}
        class="delivery-option-input js-delivery-option-input"
        name="${cartItem.productId}">
      <div>
        <div class="delivery-option-date">
          ${dateToday.add(option.deliveryDays, "days").format("dddd, MMMM D")}
        </div>
        <div class="delivery-option-price">
        ${priceText} - Shipping
        </div>
      </div>
    </div>
    `;
  });

  return resultHTML;
}
