import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import Users from "./Users";
import TransferFunds from "./TransferFunds";
import { Typography } from "antd";
const { Title } = Typography;

const Dashbord = () => {
	const [users, setUsers] = useState([]);
	const [connectUser, setConnectUser] = useState({});

	useEffect(() => {
		getUsers();
	}, []);

	const getUsers = async () => {
		let res = await fetch("http://localhost:3001/api/get/users", {
			method: "GET",
		}).catch((e) => console.log(e, "e"));
		let usersArray = await res.json();
		setUsers(usersArray);
		setConnectUser(usersArray[0]);
	};

	const onChange = (key) => {
		console.log(key);
	};

	const items = [
		{
			key: "1",
			label: `List of users`,
			children: (
				<Users
					users={users}
					connectUser={connectUser}
					setConnectUser={setConnectUser}
				/>
			),
		},
		{
			key: "2",
			label: `Transfer funds`,
			children: <TransferFunds connectUser={connectUser} users={users} />,
		},
	];

	return (
		<div className="flex min-h-screen flex-col">
			<Title
				level={1}
				style={{ textAlign: "center", paddingTop: "20px" }}
			>
				Bank System
			</Title>
			<Title level={2} className="user_data">
				Connected User : {connectUser?.name}
			</Title>
			<div className="items-center">
				<Tabs
					className="dashboard_tab"
					defaultActiveKey="1"
					items={items}
					onChange={onChange}
					centered
				/>
			</div>
		</div>
	);
};

export default Dashbord;
