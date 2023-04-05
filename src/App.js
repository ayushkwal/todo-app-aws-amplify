import React, { useState, useEffect } from 'react';
import './App.css';
import { Amplify, API } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import "@aws-amplify/ui-react/styles.css"

Amplify.configure(awsconfig);

const myApi = "apid1fc0ab1"
const path = '/crud'

const App = () => {
  const [data, setData] = useState([]);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editAddress, setEditAddress] = useState('');
  //Get Todo
  useEffect(() => {
    async function fetchData() {
      const result = await API.get(myApi, "/crud");
      console.log(result)
      setData(result);
    }
    fetchData();
  }, []);
  //Post Todo
  const addTodo = async () => {
    const newTodo = { id, name, age, address };
    const result = await API.post(myApi, "/crud", {
      body: { id, name, age, address },

    });
    if (!result) return;
    console.log(result);
    setData([...data, newTodo]);
    setId('');
    setName('');
    setAge('');
    setAddress('');
  };
  //Delete Todo
  const deleteTodo = async (todoId) => {
    const deletedData = await API.del(myApi, `/crud/${todoId}`)
    console.log(deletedData);
    const updatedTodos = data.filter((todo) => todo.id !== todoId);
    setData(updatedTodos);
  };
  //Update Todo
  const editTodo = (todoId) => {
    const todoToEdit = data.find((todo) => todo.id === todoId);
    setEditId(todoToEdit.id);
    setEditName(todoToEdit.name);
    setEditAge(todoToEdit.age);
    setEditAddress(todoToEdit.address);
  };

  const saveEditTodo = async () => {
    const updatedData = await API.put(myApi, `/crud/${editId}`, {
      body: {
        id: editId,
        name: editName,
        age: editAge,
        address: editAddress,
      }
    })
    const updatedTodos = data.map((todo) => {
      if (todo.id === editId) {
        return {
          id: editId,
          name: editName,
          age: editAge,
          address: editAddress,
        };
      } else {
        return todo;
      }
    });
    setData(updatedTodos);
    setEditId('');
    setEditName('');
    setEditAge('');
    setEditAddress('');
  };




  return (
    <>
      {/* <div className="App">
        <header className="App-header">
          <h2>App Content</h2>
        </header>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td>{item.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
      <div className="App">
        <h1>User List</h1>
        <div>
          <label>ID:</label>
          <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
        </div>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Age:</label>
          <input type="text" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div>
          <label>Address:</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <button onClick={addTodo}>Add User</button>
        <ul>
          {data.length > 0 ? data.map((todo) => (
            <li key={todo.id}>
              {todo.name}, {todo.age}, {todo.address}
              <div>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                <button onClick={() => editTodo(todo.id)}>Edit</button>
              </div>
            </li>
          )) : null}
        </ul>
        {editId !== '' && (
          <div>
            <h2>Edit Todo</h2>
            <div>
              <label>ID:</label>
              <input type="text" value={editId} disabled />
            </div>
            <div>
              <label>Name:</label>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div>
              <label>Age:</label>
              <input type="text" value={editAge} onChange={(e) => setEditAge(e.target.value)} />
            </div>
            <div>
              <label>Address:</label>
              <input type="text" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} />
            </div>
            <button onClick={saveEditTodo}>Save</button>
          </div>
        )}
      </div>
    </>
  );
}

export default withAuthenticator(App);
