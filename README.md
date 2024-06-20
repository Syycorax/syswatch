# syswatch
![syswatch](https://github.com/Syycorax/syswatch/assets/54723548/60687ef3-864a-44eb-b970-78f08fa53e94)
## Presentation
Syswatch is my personal system monitoring tool. It is work in progress and is not ready for production use. 
It uses sqlite3 for the database, flask for the server and vanilla javascript for the interface.
>[!WARNING]
> This project is still in development and is not ready for production use. It is subject to change at any time.

## Content
- `/agent` : contains the agent code
    - `app.py` : the agent code that sends data periodically to the server
- `/imgs` : contains images used in the interface
- `server directory` : contains the server code
    - `main.py` : the server code that receives data from the agent and displays it in the interface
    - `data.db` : the database file (only created when the server is run)
- `/public` : contains the interface code
    - `index.html` : the main interface file
    - `normalize.css` : normalize how the interface looks on different browsers
    - `style.css` : the css file for the interface
    - `script.js` : the javascript file for the interface
