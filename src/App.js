import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorate = () => {
	let list = localStorage.getItem("list");
	if (list) {
		return JSON.parse(localStorage.getItem("list"));
	} else return [];
};

function App() {
	const [name, setName] = useState("");
	const [list, setList] = useState(getLocalStorate());
	const [isEditing, setIsediting] = useState(false);
	const [editID, setEditID] = useState(null);
	const [alert, setAlert] = useState({
		show: false,
		msg: "",
		type: "",
	});

	const showAlert = (show = false, type = "", msg = "") => {
		setAlert({ show, type, msg });
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!name) {
			showAlert(true, "danger", "please enter value");
			// setAlert({ show: true, msg: "please enter value", type: "danger" });
		} else if (name && isEditing) {
			//deal with edit
			setList(
				list.map((item) => {
					if (item.id === editID) {
						return { ...item, title: name };
					}
					return item;
				})
			);
			setName("");
			setEditID(null);
			setEditID(false);
			showAlert(true, "success", "edited successfully");
		} else {
			//show alert
			showAlert(true, "success", "item added successfully");
			const newItem = { id: new Date().getTime().toString(), title: name }; // It creates a new object newItem with two properties: id and title. The id is generated using new Date().getTime().toString(), which creates a unique identifier based on the current timestamp. The title is set to the current value of the name state.
			setList([...list, newItem]); //It updates the list state by adding the newItem object to the existing list. It uses the spread operator (...) to create a new array with all the existing items from list and appends the newItem to the end.
			setName("");
		}
	};

	const clearList = () => {
		showAlert(true, "danger", "empty");
		setList([]);
	};

	const removeIndividualItem = (id) => {
		showAlert(true, "danger", "Item has been removed");
		setList(list.filter((item) => item.id != id));
	};

	const editIndividualItem = (id) => {
		const specificItem = list.find((item) => item.id === id); //This line finds the item in the list array that has the specified id. It uses the find method, which returns the first element in the array that satisfies the provided testing function. In this case, the testing function (item) => item.id === id checks if the id of the current item matches the id parameter passed to the editItem function.
		setIsediting(true); //This line sets the isEditing state to true, indicating that the user is currently editing an item.
		setEditID(id); //This line sets the editID state to the id of the item being edited. This editID can be used to identify the item that is being edited in other parts of the code.
		setName(specificItem.title);
	};

	useEffect(() => {
		localStorage.setItem("list", JSON.stringify(list));
	}, [list]);

	return (
		<section className="section-center">
			<form className="grocery-form" onSubmit={handleSubmit}>
				{alert.show && <Alert {...alert} removeAlert={showAlert} />}
				<h3>grocery bud</h3>
				<div className="form-control">
					<input
						type="text"
						className="grocery"
						placeholder="e.g eggs"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<button type="submit" className="submit-btn">
						{isEditing ? "edit" : "submit"}
					</button>
				</div>
			</form>
			{list.length > 0 && (
				<div className="grocery-container">
					<List
						items={list}
						removeItem={removeIndividualItem}
						editItem={editIndividualItem}
					/>
					<button className="clear-btn" onClick={clearList}>
						clear Items
					</button>
				</div>
			)}
		</section>
	);
}

export default App;
