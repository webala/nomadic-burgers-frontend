import React from "react";
import "./Dashboard.scss";
import { useQuery } from "react-query";
import axios from "axios";
import Order from "../../components/OrderItems/Order";

function Dashboard() {
	const fetchOrders = async () => {
		const response = await axios.get("http://localhost:8000/api/orders");
		return response.data;
	};

	const {
		data: orders,
		isLoading: isOrdersLoading,
		isError: isOrdersError,
		error: ordersError,
	} = useQuery("orders", fetchOrders);

	if (isOrdersLoading) {
		return <div>Loaing ...</div>;
	}

	console.log("orders: ", orders);

	return (
		<div className="dashboard">
			<h1>Chef's panel</h1>
			<div className="orders">
				{orders.map((order, index) => (
					<Order order={order} key={index} />
				))}
			</div>
		</div>
	);
}

export default Dashboard;
