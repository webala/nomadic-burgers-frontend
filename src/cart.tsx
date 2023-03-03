/** @format */

export function getCookie(name: string) {
   let cookieValue = null;

   if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
         const cookie = cookies[i].trim();

         if (cookie.substring(0, name.length + 1) === name + "=") {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
         }
      }
   }

   return cookieValue;
}

let cart = JSON.parse(getCookie("nomadic_burgers_cart") as string);

let expires = new Date();
expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000);

if (cart == undefined) {
   cart = {};
   document.cookie =
      "nomadic_burgers_cart=" +
      JSON.stringify(cart) +
      `;expires=${expires};domain=;path=/`;
}

function deleteCartCookies() {
   cart = {};
   document.cookie =
      "nomadic_burgers_cart=" +
      JSON.stringify(cart) +
      `;expires=${expires};domain=;path=/`;
   console.log("cart: ", cart);
}

export const modifyCartCookie = (action: string, productId: number) => {
   // Modifies the cart cookie and updates the value of cart in document.cookie

   if (action === "add") {
      if (cart[productId] == undefined) {
         cart[productId] = { quantity: 1 };
      } else {
         cart[productId]["quantity"] += 1;
         console.log('added:', cart[productId])
      }
   } else if (action === "remove") {
      cart[productId]["quantity"] -= 1;

      if (cart[productId]["quantity"] <= 0) {
         delete cart[productId];
      }
   } else if (action === "delete") {
      delete cart[productId];
   }

   document.cookie =
      "nomadic_burgers_cart=" +
      JSON.stringify(cart) +
      `;expires=${expires};domain=;path=/`;
};
