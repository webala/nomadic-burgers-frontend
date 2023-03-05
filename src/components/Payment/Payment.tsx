import { Spinner } from "@chakra-ui/react";
import React, { useState, SyntheticEvent } from "react";
import { useMutation } from "react-query";
import { useLocation } from "react-router-dom";
import AwaitTransaction from "../AwaitTransaction/AwaitTransaction";

function Payment() {
	const [transactionId, setTransactionId] = useState();
	const { state } = useLocation();
	const order = state.order;
	const [phoneNumber, setPhoneNumber] = useState(order.customer.phone_number);

	const addMpesaTransactionMutation = useMutation(
		async (data) => {
			const response = await fetch("http://localhost:8000/api/payment", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw Error(response.statusText);
			}

			const jsonRes = await response.json();
			return jsonRes;
		},
		{
			onSuccess: (data) => {
				console.log("mpesa success data: ", data);
				setTransactionId(data.request_id);
			},
		}
	);

	const handleMpesaPayment = (e: SyntheticEvent) => {
		e.preventDefault();
		const data = {
			phone_number: phoneNumber,
			order_id: order.id,
		};

		addMpesaTransactionMutation.mutate(data);
	};
	return (
		<div className="payment">
			<div className="order-summary">
				<h1>Payment for order #{order.id}</h1>

				<h2>Your details</h2>
				<p>Name: {order.customer.name}</p>
				<p>Phone number: {order.customer.phone_number}</p>
			</div>

			<div className="process-payment">
				<h1>Pay for you order via M-pesa</h1>

				<p>Please confirm your mpesa number below</p>
				{addMpesaTransactionMutation.isError ? <p className="error">{addMpesaTransactionMutation.error.message}</p> : null}

				<form onSubmit={handleMpesaPayment}>
					<div className="field">
						<input
							type="text"
							value={order.customer.phone_number}
							onChange={(e) => setPhoneNumber(e.target.value)}
						/>
					</div>
					<div className="submit">
						<button type="submit">Pay</button>
						{addMpesaTransactionMutation.isLoading ? (
							<div className="loader">
								{" "}
								<Spinner color="green.500" /> <p>Initiating transaction</p>
							</div>
						) : null}
					</div>
				</form>

				{transactionId ? (
					<AwaitTransaction transactionId={transactionId} />
				) : null}
			</div>
		</div>
	);
}

export default Payment;
