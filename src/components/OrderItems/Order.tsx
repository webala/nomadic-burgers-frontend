import axios from "axios";
import React from "react";
import { useQuery, useMutation } from "react-query";
import "./Order.scss";
import { Spinner, Switch } from "@chakra-ui/react";

function Order({ order }) {
	const fetchOrderItems = async () => {
		const response = await axios.get(
			`http://localhost:8000/api/orderitems/${order.id}`
		);
		return response.data;
	};

  const setOrderComplete = useMutation(async () => {
    
  })

	const { data, isLoading, isError, error, isSuccess } = useQuery(
		["order-items", order.id],
		fetchOrderItems
	);

	if (isSuccess) {
		console.log("data: ", data);
	}

	return (
		<div>
			<div>
				<h1>Order #{order.id}</h1>
        <Switch />
			</div>

			<div>
				<div className="order_items">
					<h2>Order items</h2>
					<div>
						{isLoading ? (
							<Spinner color="red" />
						) : (
							<div>
								{data.map((item, index: number) => (
									<p key={index}>
										{item.menu_item.name} x {item.quantity}
									</p>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Order;
