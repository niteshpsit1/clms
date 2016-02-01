# Version history

## Version 0.0.3 - 10/15/2015

- Using now Sequelize as ORM for PostgreSQL.
- Updating Mocha tests for model "Users" to reflect API return value as 'status: 200 OK, {error: boolean, message: string, result: [{json}] }'
- Creating data models "Entity" and "Loan".

## Version 0.0.2 - 10/14/2015

- Removed GRUNT.
- Using nodemon for monitoring server-side code (just run `$ npm start` as usually).
- Changed project folders structure (no more build/src ramification).
- Updated documentation (`README.md`).
- All configuration files moved to `./config/` folder. In particular, for the backend we have: `./config/backend.config.js` whilst for the fronted we have `./config/frontend.config.js`.
- In router.js: each route is now separated from each other and written in a more clean, uniform way.  
- Non-relevant log messages suppressed by default (see `./config/backend.config.js`)