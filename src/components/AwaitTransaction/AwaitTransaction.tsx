import React from "react";
import { useQuery } from "react-query";

function AwaitTransaction({ transactionId }: { transactionId: string }) {
    console.log('transaction id: ', transactionId)
	const fetchTransaction = async () => {
		const response = await fetch(
			`http://localhost:8000/api/transaction/${transactionId}`
		);
		if (!response.ok) {
			throw Error("Something went wrong");
		}
		const transaction = await response.json();
		return transaction;
	};

	const { data, error, isError, isLoading } = useQuery(
		["transaction", transactionId],
		fetchTransaction,
		{
			refetchInterval: 6000,
		}
	);

	console.log("trasaction data:", data);

	if (isLoading) {
		return <p>Loading ...</p>;
	}

	if (isError) {
		return <p>Something went wrong: {error.message}</p>;
	}
	return (
		<div>
			<p>Request id: {data.request_id}</p>
		</div>
	);
}

export default AwaitTransaction;
