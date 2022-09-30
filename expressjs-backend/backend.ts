import express from 'express';
import cors from 'cors';
import e from 'express';

const app = express();
const port = 3001;

//================================User data====================================

type User = {
  id: string, 
  name: string, 
  job: string
}

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

const findUserByName = (name: string) => {
  return users.users_list.filter((user: User) => {
    return user.name === name;
  });
}

const findUserById = (id: string) => {
  return users.users_list.filter((user: User) => {
    return user.id === id;
  });
}

const findUserByNameAndId = (name: string, job: string) => {
  return users.users_list.filter((user: User) => {
    return user.job === job && user.name === name;
  });
}

function addUser(user: User){
  users.users_list.push(user);
}

function removeUser(id: string) {
  const userIndexToRemove = users.users_list.findIndex(user => user.id === id);
  if (userIndexToRemove === -1) {
    return false;
  } 
  users.users_list.splice(userIndexToRemove, 1);
  return true;
}

function generateId(): string {
  return (Math.random() + 1).toString(36).substring(6);
}

//============================Server functionality=============================

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', (req, res) =>{
  const name = req.query.name as string;
  const job = req.query.job as string;

  let results: {users_list: User[]};
  if (name != undefined && job != undefined) {
    const resultsFromNameAndId = findUserByNameAndId(name, job);
    results = {users_list: resultsFromNameAndId};
  } else if (name != undefined) {
    const resultsFromName = findUserByName(name);
    results = {users_list: resultsFromName};
  } else {
    results = users;
  }

  res.send(results);
})

app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  let resultsFromId = findUserById(id);
  if (resultsFromId === undefined || resultsFromId.length == 0) {
    res.status(404).send('Resource not found.');
  } else {
    const results = {users_list: resultsFromId};
    res.send(results);
  }
});

app.post('/users', (req, res) => {
  const newUserInfo = req.body as {name: string, job: string};
  const newId = generateId();
  const userToAdd = {
    id: newId,
    name: newUserInfo.name, 
    job: newUserInfo.job
  }
  addUser(userToAdd);
  res.status(201).send(userToAdd).end();
});

app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  const didFind = removeUser(id);
  if (didFind) {
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});      