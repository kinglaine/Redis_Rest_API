# CISC3140_MW2_Lab_3

Group project / Lab 3 for CISC3140

Author: 
    Yuzhuang Chen, Mohamed Ismail, Woodley Gelin, Brian Tyutyunik, Hang Chen, Steven Henry

<br>
<hr>
<br>

## Purpose

- Create an end point API to provide services to the front end
- When the API receives the request, it extracts the corresponding data from the database and send the data to the requester.

<br>
<hr>
<br>

## Project Dir Structure

```text
    .
    ├── README.md
    ├── base.xlsx
    ├── database_record_structure.txt
    ├── demo.js
    ├── environment_setup_and_install.sh
    ├── package-lock.json
    ├── package.json
    └── redis_note.txt
```

- demo.js is the main program for run the API
- database_record_structure.txt is describe the structure of the data stored in the database
- environment_setup_and_install.sh is a script that for automatically install the tools and frameworks needed for setup this project
- redis_note.txt is redis notes
- base.xlsx stored the data that is used to test this API

<br>
<hr>
<br>

## Guide(setup and run instructions)

1. Create a folder and download the required dependencies, or run environment_setup_and_install.sh for automatic installation of dependencies.

2. Clone of the API from our github (link) and move that to the folder.

3. Using a terminal, cd into your folder and use node demo.js to run the API

4. Open up your redis database. Alternatively you could open up another terminal and run redis-cli.

5. Now that you have a redis database running and the API, you can use hset to insert data. You could use the file database_record_structure.txt from our github to help you.

6. Use a bowser (http://127.0.0.1:8081/ or http://localhost:8081/)  or any other API testing tool to test out our API.

<br>
<hr>
<br>

## Dependencies download Links

1. redis database : https://redis.io
2. nodejs : https://nodejs.org
3. npm : https://www.npmjs.com/package/npm
4. express : https://expressjs.com

npm package:

5. ioredis : https://www.npmjs.com/package/ioredis
6. nodemon : https://www.npmjs.com/package/nodemon
7. xlsx : https://www.npmjs.com/package/xlsx

<br>
<hr>
<br>