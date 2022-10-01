import express from 'express';
import cors from 'cors';
import e from 'express';

const app = express();
const port = 3001;

//================================User data====================================

// The type for a user and their information
type User = {
  id: string, 
  name: string, 
  job: string
}

// Storage for list of all users
const users = { 
  users_list :
  [
    { 
      id : 'xyz789',
      name : 'Charlie',
      job: 'Janitor',
    },
    {
      id : 'abc123', 
      name: 'Mac',
      job: 'Bouncer',
    },
    {
      id : 'ppp222', 
      name: 'Mac',
      job: 'Professor',
    }, 
    {
      id: 'yat999', 
      name: 'Dee',
      job: 'Aspring actress',
    },
    {
      id: 'zap555', 
      name: 'Dennis',
      job: 'Bartender',
    }
  ]
}

//============================Getters and setters==============================

function findUserByName (name: string): User[] {
  return users.users_list.filter((user: User) => {
    return user.name === name;
  });
}

function findUserById (id: string): User[] {
  return users.users_list.filter((user: User) => {
    return user.id === id;
  });
}

const findUserByNameAndId = (name: string, job: string): User[] => {
  return users.users_list.filter((user: User) => {
    return user.job === job && user.name === name;
  });
}

function addUser(user: User): void {
  users.users_list.push(user);
}

function removeUser(id: string): boolean {
  const userIndexToRemove = users.users_list.findIndex(user => user.id === id);
  if (userIndexToRemove === -1) {
    return false;
  } 
  users.users_list.splice(userIndexToRemove, 1);
  return true;
}

// This function is used to generate a new, random id
// for a new user. 
function generateId(): string {
  return (Math.random() + 1).toString(36).substring(6);
}

//============================Server functionality=============================

app.use(cors()); // Used so other servers can access the api server
app.use(express.json());

// Default home page
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Used to query all of the users in the user list
app.get('/users', (req, res) =>{

  // Get query params from request
  const name = req.query.name as string;
  const job = req.query.job as string;

  let results: {users_list: User[]};

  if (name != undefined && job != undefined) { // name and job param given

    const resultsFromNameAndId = findUserByNameAndId(name, job);
    results = {users_list: resultsFromNameAndId};

  } else if (name != undefined) { // only name param was given

    const resultsFromName = findUserByName(name);
    results = {users_list: resultsFromName};

  } else { // no name or job param given

    results = users;
  
  }

  res.status(200).send(results);
})

// Query user by specific id
app.get('/users/:id', (req, res) => {

  // Retireve id from request param and search user with id
  const id = req.params.id;
  let resultsFromId = findUserById(id);

  if (resultsFromId === undefined || resultsFromId.length == 0) { // id does not belong to any users

    res.status(404).send('Resource not found.');

  } else { // id correlates to an existing user

    const results = {users_list: resultsFromId};
    res.status(200).send(results);
  
  }
});

// Used to add new user to user list
app.post('/users', (req, res) => {

  // Retrieve new user name and job from request
  const newUserInfo = req.body as {name: string, job: string};

  // Generate random id
  const newId = generateId();

  // Add user to user list
  const userToAdd = {
    id: newId,
    name: newUserInfo.name, 
    job: newUserInfo.job
  }
  addUser(userToAdd);
  res.status(201).send(userToAdd).end();
});

// Used to remove a user from the user list
app.delete('/users/:id', (req, res) => {

  // Retrieve id param from request
  const id = req.params.id;

  // Try to remove user with corresponding id
  const didFindAndRemovedUser = removeUser(id);

  if (didFindAndRemovedUser) { // User was successfully removed
    res.status(204).end();
  } else { // No user with id was found
    res.status(404).end();
  }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});      