// src/MyApp.jsx
import React, {useState, useEffect} from "react";
import Table from "./Table"
import Form from "./Form";

function MyApp() {

  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(id) {
    fetch(`http://localhost:8000/users/${id}`, {
    method: "DELETE",
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to delete user.");
      }
      return fetch("http://localhost:8000/users");
    })
    .then((res) => res.json())
    .then((json) => setCharacters(json["users_list"]))
    .catch((error) => {
      console.error("Error deleting user:", error);
    });
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  useEffect(() => {
    fetch("http://localhost:8000/users")
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setCharacters(json["users_list"]);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise.then((res) => {
      if (res.status === 201) {
        return res.json(); // Return the JSON data if status is 201
      } else {
        throw new Error("Failed to add user.");
      }
    });
  }

  function updateList(person) { 
    postUser(person)
      .then(() => {
      fetchUsers()
        .then((res) => res.json())
        .then((json) => setCharacters(json["users_list"]))
        .catch((error) => {
          console.error("Error fetching users after adding:", error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  function addUser(person) {
    fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add user.");
        }
      return fetch("http://localhost:8000/users");
    })
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.error("Error adding user:", error);
      });
    }

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );
}
// makes the componenet availible to be imported into other components
export default MyApp;
