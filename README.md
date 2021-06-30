# MONSTER_API
Project for WSB 

by Marianna Jedruch 46373

## Routes

### User Routes

| Route           | Methods | Description                         |
| :-------------- | :------ | :---------------------------------- |
| /users/register | POST    | Registers user                      |
| /users/login    | POST    | Logins user and generates token     |

### Monster Routes

| Route                                  | Methods     | Description                                                                      |
| :------------------------------------- | :---------- | :------------------------------------------------------------------------------- |
| /taste                            | POST   | - POST - Adds Monster taste         |
| /taste/:tasteId               | GET, DELETE         | - GET - fetches specified moster taste by id </br> - DELETE - removes moster taste by id                                      |
| /taste/:tasteId/rating | GET, DELETE, POST | - GET - fetches rating for chosen monster taste </br> - DELETE - removes chosen rating </br> - POST - adds rating for monster taste |

