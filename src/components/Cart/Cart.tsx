/** @format */

import "./Cart.scss";
import {
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	useToast,
} from "@chakra-ui/react";
import MenuItem from "../MenuItem/MenuItem";
import { FaRegWindowClose } from "react-icons/fa";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

type CartProps = {
	setCart: Function;
	cart: object;
	isOpen: Function;
	onClose: Function;
};

function Cart({ setCart, cart, isOpen, onClose, btnRef }) {
	const menuItemIds = Object.keys(cart);

	const [name, setName] = useState<string>();
	const [phone, setPhone] = useState<string>();

	const navigate = useNavigate();
	const toast = useToast();

	const createOrderMutation = useMutation(
		async (data) => {
			const response = await fetch("http://localhost:8000/api/order", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error(response.statusText);
			}

			const jsonRes = await response.json();
			return jsonRes;
		},
		{
			onSuccess: (data) => {
				toast({
					title: "Success.",
					description: "Proceeding to payment.",
					status: "success",
					duration: 9000,
					isClosable: true,
					position: "bottom-right",
				});
				navigate("/payment", { state: { order: data } });
			},
		}
	);

	const handleSubmitOrder = (e: React.SyntheticEvent) => {
		e.preventDefault();
		const customer = {
			name,
			phone_number: phone,
		};
		let order_items: { item_id: number; quantity: number }[] = [];

		menuItemIds.map((key) => {
			const orderItem = {
				item_id: parseInt(key),
				quantity: cart[key].quantity as number,
			};
			order_items.push(orderItem);
		});

		const data = {
			order_items,
			customer,
		};

		createOrderMutation.mutate(data);
	};

	return (
		<Drawer
			isOpen={isOpen}
			placement="right"
			onClose={onClose}
			finalFocusRef={btnRef}
			size="sm"
		>
			<DrawerOverlay />
			<DrawerContent bg={`black`} color={`white`}>
				<button className="close-btn" onClick={onClose}>
					<FaRegWindowClose />
				</button>
				<DrawerHeader bg={`black`}>
					<h1>Your order</h1>
				</DrawerHeader>

				<DrawerBody bg={`black`}>
					<div className="cart">
						<div className="menu-items">
							{menuItemIds.map((id: string, index: number) => (
								<MenuItem
									setCart={setCart}
									itemId={id}
									quantity={cart[id].quantity}
									key={index}
								/>
							))}
						</div>
						<div className="order-summary">
							<div className="order-total">
								<p>Order Total</p>
								<p>ksh 6678</p>
							</div>
							<form className="checkout" onSubmit={handleSubmitOrder}>
								<div className="field">
									<label>Your name</label>
									<input
										onChange={(e) => setName(e.target.value)}
										type="text"
										placeholder="John Doe"
										required
									/>
								</div>

								<div className="field">
									<label>Your phone number</label>
									<input
										onChange={(e) => setPhone(e.target.value)}
										type="text"
										placeholder="+2564536738"
										required
									/>
								</div>
								<div className="actions">
									<button className="cancel">Cancel order</button>
									<button type="submit" className="checkout">
										Checkout
									</button>
								</div>
							</form>
						</div>
					</div>
				</DrawerBody>

				<DrawerFooter></DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

export default Cart;
