
# Business Directory


## Installation

Clone the project

```bash
  git clone https://github.com/Thor0lf/react-mysql-business-directory.git
```

Go to the project directory

```bash
  cd react-mysql-business-directory
```

Go to the client directory

```bash
  cd client
```

Install dependencies

```bash
  npm install
```

( // You can create a .env file in the client directory :

```bash
  PORT = 3003 (for example, 3000 by default)
```
// )

Start the server

```bash
  npm run start
```

From the root directory, go to the server directory

```bash
  cd client
```

Install dependencies

```bash
  npm install
```

Create a .env file in the server directory : 

```bash
  PORT = 8008 (for example or delete it if you use the default port (8000))
  CLIENT_PORT = 3003 (or the same than in the client .env file 
                or delete it if you use the default port)
  HOST = 'localhost' (for example)
  USER = 'root' (for example)
  PASSWORD = ''
  DATABASE = 'your_database_name' (for example)
  SECRET = 'your_secret_jwt_token' (for example)
```

Start the server

```bash
  npm run start
```

Populating the database with 'random' data

```bash
  node .\commands\seed.js 
```

Add an administrator (login: admin@admin.fr / password: admin)

```bash
  node .\commands\admin.js 
```

In your browser, go to : 

```bash
  http://localhost:3003/ (or your choice or 3000 by default)
```

Enjoy !

