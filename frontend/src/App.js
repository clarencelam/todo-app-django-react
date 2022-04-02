import React, { Component } from "react";
import Modal from "./components/Modal";
import axios from "axios";


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
        done: false,
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
    const item = { title: "", description: "", completed: false, done: false };

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

        <button
          className=
          {this.state.viewCompleted ? "btn btn-outline-secondary mx-3" : "btn btn-outline-secondary mx-3"}
          onClick=
          {this.state.viewCompleted ?
            () => this.displayCompleted(false) : () => this.displayCompleted(true)
          } 
        >
          {this.state.viewCompleted ? "View Current Tasks" : "View Archived Tasks"}
        </button>

      </div>
    );
  };

  renderItems = () => {
    const { viewCompleted } = this.state; // viewCompleted will = true or false
    const newItems = this.state.todoList.filter(
      (item) => (item.completed === viewCompleted && item.done === false)
    ); 
    // newItems = todo items where 'completed = true' or 'completed = false' depending on the current state
    // AND 'item.done === false'

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

  renderDoneOnly = () => {
    const allItems = this.state.todoList
    const notDoneItems = this.state.todoList.filter(
      (item) => item.done === true
    )


    return notDoneItems.map(filtereditem => (
      <li
        key={filtereditem.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""
            }`}
          title={filtereditem.description}
        >
          <del>{filtereditem.title}</del>
        </span>
        <span>
          <button className="btn btn-secondary mr-2"
            onClick={() => this.editItem(filtereditem)}
          >
            Edit
          </button>
          <button className="btn btn-danger"
            onClick={() => this.handleDelete(filtereditem)}
          >
            Delete
          </button>
        </span>

      </li>
    ))
  }


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
                {this.renderDoneOnly()}
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