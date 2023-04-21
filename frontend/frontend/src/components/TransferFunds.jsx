import React, { memo, useState } from "react";
import { Button, Form, Input, message, notification } from "antd";

const TransferFunds = ({ connectUser, users }) => {
	const [accountNo, setAccountNo] = useState("");
	const [amount, setAmount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [messageApi, contextHolder] = message.useMessage();

	const onFinish = async (values) => {
		if (isNaN(amount)) {
			message.open({
				type: "error",
				content: "Invalid amount",
			});
			return;
		}

		let amountToDeduct =
			parseFloat(connectUser.balance) - parseFloat(amount);
		if (amountToDeduct < 0) {
			notification.open({
				type: "error",
				message: "Insufficient balance",
				description: `You don't have sufficeint balance`,
			});
			return;
		}
		setLoading(true);
		let u = users.filter((a) => a._id === accountNo);
		let amountToSend = parseFloat(amount) + parseFloat(u[0].balance || "0");
		console.log("amountToSend", amountToSend);

		try {
			await fetch(
				`http://localhost:3001/api/transfer-money?id=${connectUser._id}`,
				{
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						balance: amountToDeduct.toString(),
					}),
				}
			).catch((err) => {
				console.log("err", err);
				notification.open({
					type: "error",
					message: "Transaction failed",
					description: `Oops something went wrong!`,
				});
			});

			let res = await fetch(
				`http://localhost:3001/api/transfer-money?id=${accountNo}`,
				{
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ balance: amountToSend }),
				}
			).catch((err) => {
				console.log("err", err);
				notification.open({
					type: "error",
					message: "Transaction failed",
					description: `Oops something went wrong!`,
				});
			});

			console.log("res.status ", res.status);
			if (res.status === 200) {
				notification.open({
					type: "success",
					message: "Transaction successfull",
					description: `${amount} successfully tranfered to account address ${accountNo}`,
				});
				setLoading(false);
			}
		} catch (error) {
			console.log("error", error);
			notification.open({
				type: "error",
				message: "Transaction failed",
				description: `Oops something went wrong!`,
			});
		}
	};
	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<div className="flex justify-center">
			<Form
				name="basic"
				labelCol={{
					span: 10,
				}}
				wrapperCol={{
					span: 16,
				}}
				style={{
					maxWidth: 600,
				}}
				initialValues={{
					remember: true,
				}}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
			>
				<Form.Item label="Transfer from" name="transferFrom">
					<Input placeholder={connectUser?._id} disabled />
				</Form.Item>

				<Form.Item
					label="Account number"
					name="accountNo"
					rules={[
						{
							required: true,
							message: "Please enter account number",
						},
					]}
				>
					<Input
						value={accountNo}
						onChange={(e) => setAccountNo(e.target.value)}
					/>
				</Form.Item>

				<Form.Item
					label="Amount to send"
					name="amount"
					rules={[
						{
							required: true,
							message: "Please input your password!",
						},
					]}
				>
					<Input
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
					/>
				</Form.Item>

				<Form.Item
					wrapperCol={{
						offset: 8,
						span: 16,
					}}
				>
					<Button loading={loading} htmlType="submit">
						Transfer
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default memo(TransferFunds);
