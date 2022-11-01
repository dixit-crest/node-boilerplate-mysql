# Getting Started with boilerplate

## How to run ?
- refer to `.env.example` file, create `.env` in the root file assign required variables.
- run `npm install` to install dependencies
- run `npx sequelize-cli db:migrate` to create tables ( db mentioned in .env will be used to create tables, Optionally you could run seeders as well )
- run `npm run dev`
- Hit [http://localhost:3001](http://localhost:3001) in postman.

## Folder structure of the project
This project has been initiated with the concept of `modules`, pages, components and every other type of code is stored in single folder and then has been separated into folders module wise.

Example: 
- `routes/auth/ROUTES_FOR_AUTH_MODULE`
- `controllers/auth/CONTROLLERS_FOR_AUTH_MODULE`

Examples for 

utitlity functions & variables are available in `/utils` folder
- All the general setttings for setting up a server is available in `/utils/app.js` to free the clutter in root index file.
- `constants.js` : to store constants used throughout the project 
- `helper.js` : to contains helper functions ( i.e roundOff function )
- all the file will be exported from `/utils` ( index.js )
