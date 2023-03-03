/** @format */

import { IoMdAddCircleOutline } from "react-icons/io";
import { MdRemoveCircleOutline } from "react-icons/md";
import { useQuery } from "react-query";
import burger from "../../assets/burger.jpeg";
import { modifyCartCookie } from "../../cart";
import { getCookie } from "../../cart";
import "./MenuItem.scss";
type MenuItemProps = {
   itemId: string;
   quantity: number;
   setCart: Function;
};

function MenuItem({ setCart, itemId, quantity }: MenuItemProps) {
   console.log("item id: ", itemId, "quantity: ", quantity);

   const fetchMenuItem = async (itemId: number) => {
      const response = await fetch(
         `http://localhost:8000/api/menuitem/${itemId}`
      );

      if (!response.ok) {
         throw new Error(response.statusText);
      }

      const jsonRes = await response.json();
      return jsonRes;
   };

   const {
      data: menuItem,
      isLoading,
      isSuccess,
      isError,
      error,
   } = useQuery(["menu-item", itemId], () => fetchMenuItem(parseInt(itemId)));

   if (isLoading) {
      return <div>Fetching food item</div>;
   }

   if (isError) {
      return <div>Error</div>;
   }

   console.log("menu item ", menuItem);
   const totalPrice = menuItem.price * quantity;

   const modifyCartItem = (action: string) => {
      modifyCartCookie(action, menuItem.id);
      setCart(JSON.parse(getCookie("nomadic_burgers_cart") as string));
   };

   return (
      <div className="menu-item">
         <div className="info">
            <img src={burger} alt={`${menuItem.name}`} />
            <h1>{menuItem.name}</h1>
            <p>@{menuItem.price}</p>
         </div>
         <div className="actions">
            <p className="action" onClick={() => modifyCartItem("add")}>
               <IoMdAddCircleOutline />
            </p>
            <p className="price">{quantity}</p>
            <p className="action" onClick={() => modifyCartItem("remove")}>
               <MdRemoveCircleOutline />
            </p>
         </div>
      </div>
   );
}

export default MenuItem;
