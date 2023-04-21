import React, { memo } from "react";
import { Button, Space, Table, Tag } from "antd";

const Users = ({ users, connectUser, setConnectUser }) => {
	const columns = [
		{
			title: "Account number",
			dataIndex: "_id",
			key: "_id",
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "Balance",
			dataIndex: "balance",
			key: "balance",
		},
		{
			title: "Login",
			key: "login",
			render: (data) => (
				<Button
					onClick={() => {
						setConnectUser(data);
					}}
				>
					{connectUser?._id === data?._id ? "Connected" : "Connect"}
				</Button>
			),
		},
	];

	return (
		<div>
			<Table columns={columns} dataSource={users} />
		</div>
	);
};

export default memo(Users);
