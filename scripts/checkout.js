import { renderOrderSummary } from "./checkout/orderSumary.js";
import { renderPaymentSummary } from "./checkout/paymentSumary.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { loadCart, cart } from "../data/cart.js";

async function loadPage() {
  console.log("load page");

  try {
    await loadProductsFetch();

    new Promise((resolve) => {
      loadCart(() => {
        resolve();
      });
    });
  } catch (error) {
    console.log("Unexpected error. Please try again later.");
  }

  document.querySelector(
    ".js-checkout-header-middle-section"
  ).innerHTML = `Checkout (<a class="return-to-home-link" href="amazon.html">${cart.length} items</a>)`;

  renderOrderSummary();
  renderPaymentSummary();
}

loadPage();
