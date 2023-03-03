/** @format */

import { useState, useRef } from "react";
import reactLogo from "./assets/react.svg";
import "./App.scss";
import { useQuery } from "react-query";
import burger from "./assets/burger.jpeg";
import { BsFillCartPlusFill } from "react-icons/bs";
import { useDisclosure } from "@chakra-ui/react";
import Cart from "./components/Cart/Cart";
import { modifyCartCookie } from "./cart";
import { useToast } from "@chakra-ui/react";
import Navbar from "./components/Navbar/Navbar";
import { getCookie } from "./cart";

function App() {
   const { isOpen, onOpen, onClose } = useDisclosure();
   const btnRef = useRef();

   const [cart, setCart] = useState(
      JSON.parse(getCookie("nomadic_burgers_cart") as string)
   );

   const toast = useToast();

   const fetchMenuItems = async () => {
      const response = await fetch("http://localhost:8000/api/menuitems");

      if (!response.ok) {
         throw Error(response.statusText);
      }

      const jsonRes = await response.json();
      return jsonRes;
   };

   const { data, isLoading, error, isError } = useQuery(
      "menuitems",
      fetchMenuItems
   );

   if (isError) {
      return <div>Something went wrong: {error.message}</div>;
   }

   if (isLoading) {
      return <div>Loading ...</div>;
   }

   interface iData {
      name: string;
      price: string;
      available: boolean;
      menu: number;
      id: number;
   }

   console.log("data: ", data);
   const handleAddToCart = (item: iData) => {
      console.log("handle add to cart");
      modifyCartCookie("add", item.id);
      setCart(JSON.parse(getCookie("nomadic_burgers_cart") as string));
      toast({
         title: "Success",
         description: `${item.name} added to cart`,
         status: "success",
         duration: 9000,
         isClosable: true,
         position: `bottom`,
      });
   };
   return (
      <div className="App">
         <Navbar onOpen={onOpen} />
         <h1>Hello</h1>
         <div className="items">
            {data.map((item: iData, index: number) => {
               return (
                  <div className="item" key={index}>
                     <img src={burger} alt="burger" className="image" />
                     <div className="details">
                        <p>{item.name}</p>
                        <p>{item.price}</p>
                     </div>
                     <button
                        onClick={() => handleAddToCart(item)}
                        className="add-to-cart"
                     >
                        <BsFillCartPlusFill />
                     </button>
                  </div>
               );
            })}
         </div>

         <Cart setCart={setCart} cart={cart} isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
      </div>
   );
}

export default App;
