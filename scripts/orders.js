import { orders, getPrice } from "../data/orders.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { getProduct } from "../../data/products.js";
import { loadProductsFetch } from "../data/products.js";
import { loadCart, cart, addToCart } from "../data/cart.js";

loadPage();

async function loadPage() {
  await loadCart();
  await loadProductsFetch();

  UpdateCartQuantityUI();
  document.querySelector(".orders-grid-js").innerHTML = GetOrdersHTML();

  document.querySelectorAll(".js-buy-again-button").forEach((button) => {
    button.addEventListener("click", () => {
      console.log("Buy again click!");
      console.log(button.dataset);
      console.log(button.dataset.productId);

      const productId = button.dataset.productId;

      addToCart(productId);
      UpdateCartQuantityUI();
    });
  });

  document.querySelectorAll(".js-track-package-button").forEach((button) => {
    button.addEventListener("click", () => {
      console.log("Track package click!");
      const productId = button.dataset;
    });
  });
}

function UpdateCartQuantityUI() {
  let totalQuantity = 0;
  cart.forEach((item) => {
    totalQuantity += item.quantity;
  });

  document.querySelector(".js-cart-quantity").innerHTML = totalQuantity;
}

function GetOrdersHTML() {
  let ordersHTML = "";

  orders.forEach((order) => {
    let deliveryDate = dayjs(order.orderTime);

    ordersHTML += `  <div class="order-container">
    <div class="order-header">
      <div class="order-header-left-section">
        <div class="order-date">
          <div class="order-header-label">Order Placed:</div>
          <div>      
            ${deliveryDate.format("MMMM D")}    
          </div>
        </div>
        <div class="order-total">
          <div class="order-header-label">Total:</div>
          <div>
            ${getPrice(order)} 
          </div>
        </div>
      </div>

      <div class="order-header-right-section">
        <div class="order-header-label">Order ID:</div>
        <div>
          ${order.id} 
        </div>
      </div>
    </div>

    <div class="order-details-grid">
      ${GetProductsInOrderHTML(order)}
    </div>
  </div>
  `;
  });

  return ordersHTML;
}

function GetProductsInOrderHTML(order) {
  let detailHtml = "";

  order.products.forEach((product) => {
    let matchingProduct = getProduct(product.productId);
    let estimatedDeliveryTime = dayjs(product.estimatedDeliveryTime);

    detailHtml += `     
     <div class="product-image-container">
          <img src="${matchingProduct.image}" />
        </div>
  
        <div class="product-details">
          <div class="product-name">
          ${matchingProduct.name}
          </div>
          <div class="product-delivery-date">
          Arriving on: ${estimatedDeliveryTime.format("D. MMMM")}
          </div>
          <div class="product-quantity">
          Quantity: ${product.quantity}
          </div>
          <button class="
          buy-again-button 
          button-primary 
          js-buy-again-button"
          data-product-id="${product.productId}"
          ">
            <img class="buy-again-icon" src="images/icons/buy-again.png" />
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>
  
        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${
      product.productId
    }">
            <button class="
            track-package-button 
            button-secondary 
            js-track-package-button
            ">
              Track package
            </button>
          </a>
        </div>
        `;
  });

  return detailHtml;
}
