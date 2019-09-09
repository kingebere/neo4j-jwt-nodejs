# Start NodeJs server using Neo4j & JWT

This project is the first step preparation to build your **Nodejs** server using **express** and **Neo4j** graph database (**EXTRA**: JWT, password security, register, login, express router, verification token).

## Perquisite

- [NEO4J](https://neo4j.com/) graph database.
- Nodejs (NPM)

## Getting Started

- Fork this repo.
- Clone the forked repo.
- Make a copy of **.example.env** & change the name to **.env**.
- Change the variables in **.env** to your own.
- Run:
  
    ```bash
  npm install
  npm start
  ```
  
- Let's build your APIs.

## Files map

- assets
  - user.js ``` routed from app.js (/api/user/) user register, login ```
  - verifytoken.js ``` import the file then use it in the API to verify the requested token ```
- .env ``` the copy of .example.env - change the variable ```
- app.js ``` the main file server ```

## Next step

After testing the APIs with the DB and tokens, start build your own APIs to your project requirements.

Use express routers, send the token, verify the token and encrypt users password.

Please make sure to update tests as appropriate and I'm waiting for your issues and marge requests.

**NOTE:** for better testing I'm using [Postman](https://www.getpostman.com/)

## License
[MIT](https://choosealicense.com/licenses/mit/)

Fadi Mabsaleh [LinkedIn](https://www.linkedin.com/in/fadi-mabsaleh/) [gitlab](https://gitlab.com/fadimoubassaleh)