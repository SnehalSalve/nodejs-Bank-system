const express = require("express");
const mongodb = require("mongodb");
const dotenv = require("dotenv");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const uri = process.env.MONGODB_URI;

mongodb.MongoClient.connect(uri, { useUnifiedTopology: true })
	.then((client) => {
		console.log("Connected to MongoDB Atlas");

		const db = client.db("bank-system");
		const collection = db.collection("users");

		app.use(express.json());

		app.use(cors());
		app.get("/api/get/users", async (req, res) => {
			const data = await collection.find({}).toArray();
			res.send(data);
		});

		app.use(cors());
		app.post("/api/transfer-money", async (req, res) => {
			const { id } = req.query;

			console.log("id", id);
			console.log("body", req.body);
			let a = await collection.updateOne(
				{ _id: new ObjectId(id) },
				{ $set: req.body }
			);
			console.log("a", a);
			res.send("Data updated successfully");
		});

		app.use(cors());
		app.post("/api/create/user", async (req, res) => {
			const { body } = req;
			await collection.insertOne(body);
			res.send("Data inserted successfully");
		});

		app.listen(port, () => {
			console.log(`Server running at http://localhost:${port}`);
		});
	})
	.catch((error) => console.error(error));
