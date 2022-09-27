import express from 'express';

const app = express();
const port = 3001;

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

const findUserByName = (name: string) => {
  return users.users_list.filter((user) => {
    return user.name === name;
  });
}

const findUserById = (id: string) => {
  return users.users_list.filter((user) => {
    return user.id === id;
  });
}

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', (req, res) =>{
  const name = req.query.name as string;
  if (name != undefined) {
    const resultFromName = findUserByName(name);
    const results = {users_list: resultFromName};
    res.send(results);
  } else {
    res.send(users);
  }
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
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});      