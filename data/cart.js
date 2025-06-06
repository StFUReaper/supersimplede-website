import { deliveryOptions } from "./deliveryOptions.js";

export let cart;

loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem("cart"));

  if (!cart) {
    cart = [
      /* {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptionId: "1",
      },
      {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 1,
        deliveryOptionId: "2",
      },*/
    ];
  }
}

export function addToCart(productId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity++;
  } else {
    cart.push({
      productId: productId,
      quantity: 1,
      deliveryOptionId: "1",
    });
  }

  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;
  saveToStorage();
}

export function clearCart() {
  cart = [];
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      cartItem.deliveryOptionId = deliveryOptionId;
    }
  });

  saveToStorage();
}

export function loadCart(fun) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", () => {
    if (fun) fun();
  });

  xhr.open("GET", "https://supersimplebackend.dev/cart");
  xhr.send();
}
