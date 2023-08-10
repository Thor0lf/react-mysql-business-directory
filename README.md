
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

Go to the server directory

```bash
  cd server
```

Install dependencies

```bash
  npm install
```

Create a .env file in the server directory : 

```bash
  PORT = your_own_server_port (or delete it if you use the default server port (8000))
  CLIENT_PORT = your_own_client_port (or delete it if you use the default client port)
  HOST = 'localhost' (for example)
  USER = 'root' (for example)
  PASSWORD = ''
  DATABASE = 'your_database_name' (for example)
  SECRET = 'your_secret_jwt_token' (for example)
```

Start the server

```bash
  npm start
```

Populating the database with 'random' data,
from the root server directory

```bash
  node .\commands\seed.js 
```

Add an administrator (login: admin@admin.fr / password: admin),
from the root server directory

```bash
  node .\commands\admin.js 
```

From the root directory, go to the client directory

```bash
  cd client
```

Install dependencies

```bash
  npm install
```

If necessary, you can create a .env file in the client directory :

```bash
  PORT = your_own_client_port_number (3000 by default)
```

If necessary, in the reportory 'src', modify the file 'http-common.js' :

```bash
  const SERVER_PORT = 8000; (by default, or use your own server port)
```

Start the server

```bash
  npm start
```

In your browser, go to : 

```bash
  http://localhost:3000/ (or your own client port)
```

Enjoy !

