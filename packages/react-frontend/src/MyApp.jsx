//  src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";


function MyApp() {
  const [characters, setCharacters] = useState([]);

  function fetchUsers() { 
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function removeOneCharacter(index) {
    const id = characters[index]._id;
    fetch(`http://localhost:8000/users/${id}`, 
    {
      method: "DELETE"
    })
      .then((response) => {
        if (response.status === 204) {
          const updatedList = characters.filter((character, i) => i !== index);
          setCharacters(updatedList);
        }
        else
        {
          console.log("User not found");
        }
    })
      .catch(() => {console.log("Could not delete user");});
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json))
      .catch((error) => { console.log(error); });
  }, [] );

  function postUser(person) 
  {
    const promise = fetch("http://localhost:8000/users", 
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
      }
    );

      return promise;
  }
// why isnt it pushing to git
  function updateList(person) 
  {
    postUser(person)
      .then((res) => {if (res.status == 201) return res.json()})
      .then((json) => {if (json) setCharacters([...characters, json])})
      .catch((error) => { console.log(error); }
      )
  }


  return (
    <div className="container">
      <Table 
      characterData={characters} 
      removeCharacter={removeOneCharacter}/>
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
