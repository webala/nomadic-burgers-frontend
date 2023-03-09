import axios from "axios";
import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import "./Order.scss";
import { Spinner, Switch, useToast } from "@chakra-ui/react";

function Order({ order }) {
	const queryClient = useQueryClient();
	const toast = useToast();

	const fetchOrderItems = async () => {
		const response = await axios.get(
			`http://localhost:8000/api/orderitems/${order.id}`
		);
		return response.data;
	};

	const setOrderCompleteMutation = useMutation(
		async () => {
			const data = {
				id: order.id,
				complete: !order.complete,
			};

			const response = await axios.put(
				"http://localhost:8000/api/ordercomplete",
				data,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			return response;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries("orders");
				toast({
					title: "Success.",
					description: "Order status changed.",
					status: "success",
					duration: 9000,
					isClosable: true,
				});
			},
		}
	);

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
				<Switch
					defaultChecked={order.complete}
					onChange={() => setOrderCompleteMutation.mutate()}
				/>
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
