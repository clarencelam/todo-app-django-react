import React, { Component } from "react";
import Modal from "./components/Modal";
import axios from "axios";

// Sample todo items

// const todoItems = [
//   {
//     id: 1,
//     title: "Go to Market",
//     description: "Buy ingredients to prepare dinner",
//     completed: true,
//   },
//   {
//     id: 2,
//     title: "Study",
//     description: "Do history readings and history assignment",
//     completed: false,
//   },
//   {
//     id: 3,
//     title: "Sammy's books",
//     description: "Go to library to return Sammy's books",
//     completed: true,
//   },
//   {
//     id: 4,
//     title: "Article",
//     description: "Write article on how to use Django with React",
//     completed: false,
//   },
// ];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      todoList: [],

      modal: false,
      activeItem: {
        title: "",
        description: "",
        completed: false,
      },
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  // Function to update Todo list to the most recent list. Use after API request is complete
  refreshList = () => {
    axios
      .get("api/todos/")
      .then((res) => this.setState({ todoList: res.data }))
      .catch((err) => console.log(err));
  };

  // Functions to enable modal functionality

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  // handleSubmit Function to take care of Create and Update operations
  handleSubmit = (item) => {
    this.toggle();

    if (item.id) {
      axios
        .put(`/api/todos/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post("/api/todos/", item)
      .then((res) => this.refreshList());
  };

  handleDelete = (item) => {
    axios
      .delete(`/api/todos/${item.id}`)
      .then((res) => this.refreshList());
  };

  createItem = () => {
    const item = { title: "", description: "", completed: false };

    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  // /end Functions to enable modal functionality

  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }
    return this.setState({ viewCompleted: false });
  };

  // Code to render the to-do category tabs, showing the "To Do" or "Complete" tabs for selection
  renderTabList = () => {
    return (
      <div className="mb-4">
      <button className="btn btn-primary"
          onClick={this.createItem}
        >
          Add task
        </button>

        {/* <button
          className=
          {this.state.viewCompleted ? "btn btn-secondary mx-3" : "btn btn-primary mx-3"}
          onClick=
          {() => this.displayCompleted(false)}
        >
          To Do
        </button> */}
        <button
          className=
          {this.state.viewCompleted ? "btn btn-outline-secondary mx-3" : "btn btn-primary mx-3"}
          onClick=
          {this.state.viewCompleted ?
            () => this.displayCompleted(false) : () => this.displayCompleted(true)
          } 
        >
          View Completed Tasks
        </button>

      </div>
    );
  };

  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter(
      (item) => item.completed === viewCompleted
    );

    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""
            }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button className="btn btn-secondary mr-2"
            onClick={() => this.editItem(item)}
          >
            Edit
          </button>
          <button className="btn btn-danger"
            onClick={() => this.handleDelete(item)}
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

  render() {
    return (
      <main className="container">
        <h1 className="text-dark text-uppercase text-center my-4">Todo App</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">

              {/* <div className="mb-4">
                <button className="btn btn-primary"
                  onClick={this.createItem}
                >
                  Add task
                </button>
              </div> */}

              {this.renderTabList()}
              <ul className="list-group list-group-flush border-top-0">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  }
}

export default App;