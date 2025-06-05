import { getOrder } from "../data/orders.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { getProduct } from "../../data/products.js";
import { loadProductsFetch } from "../data/products.js";
import { loadCart, cart } from "../data/cart.js";

loadPage();

async function loadPage() {
  await loadCart();
  await loadProductsFetch();

  UpdateCartQuantityUI();

  document.querySelector(".js-order-tracking").innerHTML = GetOrderHTML();
}

function UpdateCartQuantityUI() {
  let totalQuantity = 0;

  cart.forEach((item) => {
    totalQuantity += item.quantity;
  });

  document.querySelector(".js-cart-quantity").innerHTML = totalQuantity;
}

function GetOrderHTML() {
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get("orderId");
  const productId = url.searchParams.get("productId");

  const order = getOrder(orderId);
  const matchingProduct = getProduct(productId);
  let orderProduct;

  order.products.forEach((product) => {
    if (product.productId === matchingProduct.id) orderProduct = product;
  });

  return `
        <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date">Arriving on Monday, June 13</div>

        <div class="product-info">
        ${matchingProduct.name}
        </div>

        <div class="product-info">
        Quantity: ${orderProduct.quantity}
        </div>

        <img
          class="product-image" src="${matchingProduct.image}"/>

        <div class="progress-labels-container">
          <div class="progress-label">Preparing</div>
          <div class="progress-label current-status">Shipped</div>
          <div class="progress-label">Delivered</div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar"></div>
        </div>
  `;
}
