import React, {useState, useEffect} from 'react'
import Table from './Table';
import Form from "./Form";
import axios from 'axios';

async function fetchAll () {
  try {
    const response = await axios.get('http://localhost:3001/users');
    return response.data.users_list;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// MyApp component
function MyApp() { 

  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetchAll().then( result => {
      if (result) {
        setCharacters(result);
      }
    });
  }, []);

  
  function removeOneCharacter (index) {
    // Get id for user at index
    const idToRemove = characters[index].id;

    makeDeleteCall(idToRemove).then( result => {
      if (result && result.status === 204) {
        characters.splice(index, 1);
        setCharacters([...characters]);
      }
    });
  }

  function updateList (person) {
    makePostCall(person).then(result => {
      if (result && result.status === 201) {
        const addedUser = result.data;
        setCharacters([...characters, addedUser]);
      }
    });
  }

  async function makePostCall (person) {
    try {
      const response = await axios.post('http://localhost:3001/users', person);
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function makeDeleteCall (id) {
    try {
      const response = await axios.delete(`http://localhost:3001/users/${id}`);
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}   

export default MyApp;