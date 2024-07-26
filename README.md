![Sign up](https://i.postimg.cc/5yqdTGtW/Pic-1.png](https://i.postimg.cc/c19dsbFZ/Chat-Logo.png)
# ChatWave

ChatWave is a real-time chat application that allows users to communicate instantly. The project is built with a modern tech stack to ensure a responsive and interactive user experience.

## Demo

https://chat-wave-online.onrender.com/


## Screenshots

![Sign up](https://i.postimg.cc/5yqdTGtW/Pic-1.png)
![Sign in](https://i.postimg.cc/DfqTSWPp/Pic-2.png)
![Chat](https://i.postimg.cc/28rfhzHk/Pic-3.png)

## Tech Stack

- **Frontend**: React, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **WebSockets**: Socket.io

## Installation

**Clone the repository**
```bash
  git clone https://github.com/mujtabamohamed/chat-wave.git
  cd chat-wave
```

**Install dependencies**
- **For the server:**
```bash
  cd server
  npm install

```
- **For the client:**
```bash
  cd client
  npm install
```

## Set up environment variables:

- **Create a .env file in the server directory and add your configuration.**
```bash
  REACT_APP_API_URL=
  REACT_APP_SOCKET_URL=
```

- **Create a .env file in the client directory and add your configuration.**
```bash
  PORT=
  JWT_SECRET_KEY=
  REACT_APP_CORS_URL=
  DB_USERNAME=
  DB_PASSWORD=
```

## Run the application

- **Start the server:**
```bash
  cd server
  npm start
```

- **Start the client:**
```bash
  cd client
  npm start
```
