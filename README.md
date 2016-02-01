﻿# cj-lms

Clean and good-looking code following RESTful best practices. These are the rules and documentation.


## Configuration

    Application settings are located in: `backend/config/env`.
    Here you can edit database connection parameters, frontend settings, verbose logging and API names etc.
    There are four files `all.js`, `local.js`, `production.js`, `development.js`
    `production.js`, `development.js` are used for server side. Don't change these setting.
    `all.js` is used for common setting in all environment.
    Default environment is `local` which is defined in `local.js`. Only change this file to change setting locally.
    It is recommended to add copy of file `local.js` and add your it your with your name, such as `arsalan.js` and then run application by setting `NODE_ENV=arsalan`
    If any change occur or need to set up any environment variable, set it accordingly in all environment files.


## Install and Run

    $ npm install -g nodemon gulp
    $ npm install
    $ npm start

    If you change something in frontend, you should recompile it using:
    $ gulp build

    To recompile on file change, use:
    $ gulp watch

You can now point your browser to `http://localhost:3000/`. Ensure PostgreSQL and Redis is up and running and all the configuration is correctly set up.


## Tests

Ensure PostgreSQL and Redis is up and running.
Start the backend with:

    $ npm start

Then, in another console, run:

    $ npm test


## Realtime Notifications
We are using WebSocket implementation of realtime notifications. To notify the dashboard about any event, you need to:

1. Require `/backend/emitter.js` in your module
2. Use `emitter.notification({title: "Sample title", message: "Sample message"});`

``` javascript
var emitter = require("../emitter");
//Your code here...
emitter.notification({title: "Entity added!", message: "Successfully added entity with id " + entity.id + "!"});
```

## General Routes

- `POST /signup`:

  Insert a new user entry into the database:

        @param:    name: string,
                   age: int,
                   email: string,
                   password: string

        @return:   { error: boolean, message: string, results: [] }


- `POST /login`:

  query a user entry into the user table to login and create session and get token in result (save this for future use):

            @param:        email: string,
                           password: string

            @return:   { error: boolean, message: string, results: [] }


- `POST /entity/login`:

  query a user entry into the entity table to login and create session and get token in result (save this for future use):

            @param:        email: string,
                           password: string

            @return:   { error: boolean, message: string, results: [] }


- `GET /logout` require `x-access-token` in url `header`

  logout a user and clear the session from db:

        @return:   { error: boolean, message: string, results: [] }


- `GET /entity/logout` require `x-access-token` in url `header`

  logout an entity and clear the session from db:

        @return:   { error: boolean, message: string, results: [] }


## Implemented APIs

These subsequent requests will use access-token in header send as `x-access-token`

### /api/users

An user data model is defined as following:

    user: {
        id:         <integer>,
        name:       <string>,
        email:      <string>,
        age:        <integer>,
        data:       <json>,
        tsc:        <date>,
        tsm:        <date>
    }

- `GET /api/users`:

          @param:    none.
          @return:   {
                 error: boolean,
                 message: string,
                 result: [
                     {
                         id: int,
                         name: string,
                         age: int,
                         email: string,
                         data: json,
                         tsc: date,
                         tsm: date
                     }
                  ]
              }


  If an id is provided as query parameter, eg. `http://<hostname>:<port>/users/12345`, then the result is the following:

          @param:    id: int
          @return:   {
                 error: boolean,
                 message: string,
                 result: {
                     id: int,
                     name: string,
                     age: int,
                     email: string,
                     data: json,
                     tsc: date,
                     tsm: date
                 }
             }

- `POST /api/users`:

  Insert a new user entry into the database:

        @param:    user: {
                       name: string,
                       age: int,
                       email: string,
                       password: string
                   }
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }

- `PUT /api/users`:

  Update an user entry:

        @param:    user: {
                       id: int,
                       name: string,
                       age: int,
                       email: string,
                       password: string
                   }
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


- `DELETE /api/users`:

  Delete an user entry from the database:

        @param:    id: int,
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


### /api/entities

An entity data model is defined as following:

    entity: {
        id:         <integer>,
        idnumber:   <string>,
        name:       <string>,
        dba:        <string>,
        individual: <boolean>,
        data:       <json>,
        tsc:        <date>,
        tsm:        <date>,
        uc:         <date>,
        um:         <date>
    }


- `GET /api/entities`:

  Returns an array of entities.

        @param:    none.
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                          {
                              id: integer,
                              idnumber: string,
                              name: string,
                              dba: string,
                              individual: boolean,
                              data: json,
                              tsc: date,
                              tsm: date,
                              uc: string,
                              um: string
                           }
                        ]
                    }


  If the id is provided as query parameter, eg. `http://<hostname>:<port>/entities/12345`, then a single entity is returned (JSON) and the result is the following:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: {
                           id: integer,
                           idnumber: string,
                           name: string,
                           dba: string,
                           individual: boolean,
                           data: json,
                           tsc: date,
                           tsm: date,
                           uc: string,
                           um: string
                       }
                   }

- `POST /api/entities`:

  Insert a new entity entry into the database. All parameters required:

        @param:    idnumber: string, optional
                   name: string,
                   dba: string,
                   individual: boolean,
                   data: json // in data.email and password is optional
        @return:   {
                      error: boolean,
                      message: string,
                      result: []
                   }

- `PUT /api/entities`:

  Update an entity entry. All parameters except id are optional:

        @param:    id: integer,
                   idnumber: string,
                   name: string,
                   dba: string,
                   individual: boolean,
                   data: json
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


- `DELETE /api/entities`:

  Delete an entity entry from the database:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


### /api/loans

A loan data model is defined as following:

    loan: {
        id:           <integer>,
        loan_type_id: <integer>,
        principal:    <money>,
        loanterm:     <integer>,
        interestrate: <string>,
        startingdate: <date>,
        data:         <json>,
        tsc:          <date>,
        tsm:          <date>,
        uc:           <string>,
        um:           <string>
    }

money types are meant as float types.


- `GET /api/loans/for_entity/:entity_id`:

        @param:    entity_id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                            {
                                id: integer,
                                loan_type_id: integer,
                                principal: string,
                                loanterm: integer,
                                interestrate: string,
                                startingdate: dateonly, // 2015-11-14,
                                data: json,
                                uc: string,
                                um: string,
                                tsm: date,
                                tsc: date
                            }
                        ]
                    }

- `GET /api/loans/entity_for_loan/:loan_id`:

        @param:    loan_id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                            {
                              id: integer,
                              idnumber: string,
                              name: string,
                              dba: string,
                              individual: boolean,
                              data: json,
                              tsc: date,
                              tsm: date,
                              uc: string,
                              um: string
                            }
                        ]
                    }

- `GET /api/loans`:

  Returns an array of loans.

        @param:    none
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                           {
                               id: integer,
                               loan_type_id: integer,
                               principal: money,
                               loanterm: integer,
                               interestrate: decimal,
                               startingdate: date
                               tsc: date,
                               tsm: date,
                               uc: string,
                               um: string,
                               LoanEntity: [
                                loan_id: integer,
                                entity_id: integer,
                                role_id: integer,
                                Entity: {
                                    id: integer,
                                    idnumber: string,
                                    name: string,
                                    dba: ACE,
                                    individual: boolen,
                                    data: json,
                                    uc: string,
                                    um: string,
                                    tsm: date,
                                    tsc: date
                                },
                                EntityRole: {
                                    id: integer,
                                    name: string
                                }
                               ]
                           }
                        ]
                    }

  To instead retrieve a single loan you must provide a loan id using `/api/loans/:id` format, eg. `http://<hostname>:<port>/loans/12345`. The result is the following:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result:
                           {
                               id: integer,
                               loan_type_id: integer,
                               principal: money,
                               loanterm: integer,
                               interestrate: decimal,
                               startingdate: date
                               tsc: date,
                               tsm: date,
                               uc: string,
                               um: string,
                               LoanEntity: [
                                loan_id: integer,
                                entity_id: integer,
                                role_id: integer,
                                Entity: {
                                    id: integer,
                                    idnumber: string,
                                    name: string,
                                    dba: ACE,
                                    individual: boolen,
                                    data: json,
                                    uc: string,
                                    um: string,
                                    tsm: date,
                                    tsc: date
                                },
                                EntityRole: {
                                    id: integer,
                                    name: string
                                }
                               ]
                           }
                    }

- `POST /api/loans`:

  Insert a new loan entry into the database.

  Decimal and money types are meant as float types with two point decimal precision; All parameters are required except for startingdate:

        @param:    loan_type_id:   integer,
                   principal:      money,
                   loanterm:       integer,
                   interestrate:   decimal,
                   startingdate:   date, (yyyy-mm-dd only)
                   entity_id:      integer,
                   data            json,
                   role_id:        integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }

- `PUT /api/loans`:

  Update a loan entry.

  Decimal and money types are meant as float types with two point decimal precision;  All parameters required. `startingdate`, `interestrate`,`principal`, `loanterm` are optional:


        @param:    id:             integer, // it is id of loan
                   loan_type_id:   integer, // new or old
                   principal:      money,
                   loanterm:       integer,
                   interestrate:   decimal,
                   startingdate:   date,
                   data            json
                   entity_id:      integer, // new or old
                   role_id:        integer, // new or old

        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


- `DELETE /api/loans`:

  Delete a loan entry from the database:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }

### /api/loan_types

A loan_type data model is defined as following:

      loan_type: {
           id:             <integer>,
           code:           <string>,
           description:     <string>,
           payment_cycle:  <string>,
           loan_system:    <string>,
           data:           <json>,
           um:             <string>
           uc:             <string>
           tsc:            <date>
           tsm:            <date>
      }


- `GET /api/loan_types`:

  Returns an array of loan_types.

        @param:    none.
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                          {
                           id: integer,
                           code: string,
                           descrption: string,
                           payment_cycle: string,
                           loan_system: string,
                           data: json,
                           um: string
                           uc: string
                           tsc: date
                           tsm: date
                           }
                        ]
                    }


  If an id is provided as query parameter, eg. `http://<hostname>:<port>/api/loan_types/12345`, then a single document_type is returned (JSON) and the result is the following:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: {
                           id: integer,
                           code: string,
                           descrption: string,
                           payment_cycle: string,
                           loan_system: string,
                           data: json,
                           um: string
                           uc: string
                           tsc: date
                           tsm: date
                       }
                   }

- `POST /api/loan_types`:

  Insert a new loan type entry into the database. Only `code`, `payment_cycle` and `loan_system` is required, all other optional:

        @param:    code: string,
                   description: string,
                   payment_cycle: string,
                   loan_system: string
                   data: json
        @return:   {
                      error: boolean,
                      message: string,
                      result: []
                   }

- `PUT /api/loan_types`:

  Update a loan_type entry. All parameters except id are optional:

        @param:    id: integer,
                   code: string,
                   description: string,
                   payment_cycle: string,
                   loan_system: string
                   data: json
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


- `DELETE /api/loan_types`:

  Delete a loan_type entry from the database:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }

### /api/documents

- `GET /api/documents`:

A document data model is defined as following:

    document: {
        id:               integer,
        filename:         string,
        documentcode:     string,
        documenttype_id:  integer,
        data:             json,
        status:            enum, ('-1','0', '1')
        status_note       text,
        tsc:              date,
        tsm:              date,
        uc:               string,
        um:               string
    }


- `GET /api/documents/for_entity/:entity_id`:

  Returns an array of documents, filtered by `:entity_id`.

        @param:    entity_id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                                {
                                    id: integer,
                                    filename: string,
                                    mime: string,
                                    documentcode: string,
                                    documenttype_id: integer,
                                    url: string,
                                    data: json,
                                    status: string,
                                    status_note: string,
                                    uc: string,
                                    um: string,
                                    tsm: date,
                                    tsc: dtae
                                }
                            ]
                    }

- `GET /api/documents/for_loan/:loan_id`:

  Returns an array of documents, filtered by `:loan_id`.

        @param:    loan_id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                                {
                                    id: integer,
                                    filename: string,
                                    mime: string,
                                    documentcode: string,
                                    documenttype_id: integer,
                                    url: string,
                                    data: json,
                                    status: string,
                                    status_note: string,
                                    uc: string,
                                    um: string,
                                    tsm: date,
                                    tsc: dtae
                                }
                            ]
                    }

- `GET /api/documents/for_collateral/:collateral_id`:

  Returns an array of documents, filtered by `:ollateral_id`. Returned JSON does not contain the file data. The result is the following:

        @param:    ollateral_id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                                {
                                    id: integer,
                                    filename: string,
                                    mime: string,
                                    documentcode: string,
                                    documenttype_id: integer,
                                    url: string,
                                    data: json,
                                    status: string,
                                    status_note: string,
                                    uc: string,
                                    um: string,
                                    tsm: date,
                                    tsc: dtae
                                }
                            ]
                    }

- `GET  /api/documents`:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: {{
                           id: integer,
                           filename: string,
                           documentcode: string,
                           documenttype_id: integer,
                           url: string,
                           data: json,
                           status: string,
                           status_note: string,
                           tsc: date,
                           tsm: date,
                           uc: string,
                           um: string
                       }}
                   }

  To instead retrieve a single document you must provide a document id using `/api/documents/:id` format, eg. `http://<hostname>:<port>/documents/12345`. This time file data is returned into `data` field. The result is the following:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: {
                           id: integer,
                           filename: string,
                           documentcode: string,
                           documenttype_id: integer,
                           url: json,
                           data: json,
                           status: string,
                           status_note: string,
                           tsc: date,
                           tsm: date,
                           uc: string,
                           um: string
                       }
                   }

- `POST /api/documents`:

  Insert a new document entry into the database. It accepts one file in one request.

        @param:    documentcode:     string,
                   documenttype_id:  integer,
                   file:             file (req.file),
                   status:           string,
                   status_note:      string
        @return:   {
                      error: boolean,
                      message: string,
                      result: [
                              id: integer,
                              filename: string,
                              documentcode: string,
                              documenttype_id: integer,
                              url: string,
                              data: json,
                              status: string,
                              status_note: string,
                              tsc: date,
                              tsm: date,
                              uc: string,
                              um: string
                      ]
                   }

- `POST /api/documents/uploadandrelate`:

  Insert a new document entry into the database and relate it with joining tables `collateral_document`, `entity_document`, `loan_document`. It accepts one file in one request.

        @param:    documentcode:     string,
                   documenttype_id:  integer,
                   entity_id:        integer,
                   loan_id:          integer,
                   collateral_id     integer,
                   file:             file (req.file),
                   data:             json,
                   status:            string,
                   status_note:      string
        @return:   {
                      error: boolean,
                      message: string,
                      result: [
                               id: integer,
                               filename: string,
                               documentcode: string,
                               documenttype_id: integer,
                               url: string,
                               data: json,
                               status: string,
                               status_note: string,
                               tsc: date,
                               tsm: date,
                               uc: string,
                               um: string
                      ]
                   }

- `PUT /api/documents`:

  Update a document entry. All parameters except id are optional:

        @param:    id:               integer,
                   documentcode:     string,
                   documenttype_id:  integer,
                   file:             file,
                   data:             json,
                   status:            string,
                   status_note:      string,
                   uc:               string,
                   um:               string
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


- `DELETE /api/documents`:

  Delete a document entry from the database:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }

- `GET /api/documents/download/:name`: (NOTE: It is not in use currently, use 'url' property in returned data which has actual url to file )

  Download a document from server:

        @param:    name: string (i.e gh7vg90a-myfilename.jpg)
        @return:   {
                       stream of file
                    }


### /api/document_types

A document_type data model is defined as following:

    document_type: {
        id:                       integer,
        code:                     string,
        description:              string,
        validationrequirements:   string,
        data:                     json,
        tsc:                      date,
        tsm:                      date,
        uc:                       string,
        um:                       string
    }


- `GET /api/document_types`:

  Returns an array of document_types.

        @param:    none.
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                          {
                               id: integer,
                               code: string,
                               description: string,
                               validationrequirements: integer,
                               data: json,
                               tsc: date,
                               tsm: date,
                               uc: string,
                               um: string
                           }
                        ]
                    }


  If an id is provided as query parameter, eg. `http://<hostname>:<port>/api/document_types/12345`, then a single document_type is returned (JSON) and the result is the following:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: {
                           id: integer,
                           code: string,
                           description: string,
                           validationrequirements: string,
                           data: json,
                           tsc: date,
                           tsm: date,
                           uc: string,
                           um: string
                       }
                   }

- `POST /api/document_types`:

  Insert a new document entry into the database. Only `code` and `validationrequirements` is required, all other optional:

        @param:    code: string,
                   description: string,
                   validationrequirements: string,
                   data: json
        @return:   {
                      error: boolean,
                      message: string,
                      result: []
                   }

- `PUT /api/document_types`:

  Update a document_type entry. All parameters except id are optional:

        @param:    id: integer,
                   code: string,
                   description: string,
                   validationrequirements: string,
                   data: json
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


- `DELETE /api/document_types`:

  Delete a document_type entry from the database:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


### /api/entity_roles

An entity_role data model is defined as following:

    entity_role: {
        id:                       integer,
        name:                     string,
        description:              string,
        tsc:                      date,
        tsm:                      date,
        uc:                       string,
        um:                       string
    }


- `GET /api/entity_roles`:

  Returns an array of entity_role.

        @param:    none.
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                          {
                               id: integer,
                               name: string,
                               description: string,
                               tsc: date,
                               tsm: date,
                               uc: string,
                               um: string
                           }
                        ]
                    }


  If an id is provided as query parameter, eg. `http://<hostname>:<port>/entity_roles/12345`, then a single entity_role is returned (JSON) and the result is the following:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: {
                           id: integer,
                           name: string,
                           description: string,
                           tsc: date,
                           tsm: date,
                           uc: string,
                           um: string
                       }
                   }

- `POST /api/entity_roles`:

  Insert a new entity_role entry into the database. Parameter `name` required, `description` is instead optional:

        @param:    name: string,
                   description: string,
                   uc: string,
                   um: string
        @return:   {
                      error: boolean,
                      message: string,
                      result: []
                   }

- `PUT /api/entity_roles`:

  Update a entity_role entry. All parameters except id are optional:

        @param:    id: integer,
                   name: string,
                   description: string
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


- `DELETE /api/entity_roles`:

  Delete a entity_role entry from the database:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


### /api/loan_documents

An loan_document data model is defined as following:

      loan_document: {
              id:             <integer>,
              loan_id:        <integer>,
              document_id:    <integer>,
              um:             <string>
              uc:             <string>
              tsc:            <date>
              tsm:            <date>
             }


- `GET /api/loan_documents`:

  Returns an array of loan_document.

        @param:    none.
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                          {
                              id:             <integer>,
                              loan_id:        <integer>,
                              document_id:    <integer>,
                              um:             <string>
                              uc:             <string>
                              tsc:            <date>
                              tsm:            <date>
                           }
                        ]
                    }


  If an id is provided as query parameter, eg. `http://<hostname>:<port>/api//loan_documents/12345`, then a single loan_documents is returned (JSON) and the result is the following:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: {
                              id:             <integer>,
                              loan_id:        <integer>,
                              document_id:    <integer>,
                              um:             <string>
                              uc:             <string>
                              tsc:            <date>
                              tsm:            <date>
                       }
                   }

- `POST /api/loan_documents`:

  Insert a new loan_documents entry into the database. Parameter `document_id`, `loan_id` required, Others are optional:

        @param:    document_id: integer,
                   loan_id: integer,
                   uc: string,
                   um: string
        @return:   {
                      error: boolean,
                      message: string,
                      result: []
                   }

- `PUT /api/loan_documents`:

  Update a loan_documents entry. All parameters except id are optional:

        @param:    id: integer,
                   document_id: integer,
                   loan_id: integer,
                   uc: string,
                   um: string
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


- `DELETE /api/loan_documents`:

  Delete a loan_documents entry from the database:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }

- `DELETE /api/loan_documents/for_loan/:loan_id`:

  This method will delete all loan_document records from the database for given loan_id.

        @param:    loan_id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }

### /api/entity_documents

An entity_document data model is defined as following:

      entity_document: {
	   id:               <integer>,
	   entity_id:        <integer>,
	   document_id:      <integer>,
	   tsc:              <date>,
	   tsm:              <date>,
	   uc:               <string>,
	   um:               <string>
     }


- `GET /api/entity_documents`:

  Returns an array of entity_documents.

        @param:    none.
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                          {
                              id:             <integer>,
                              entity_id:      <integer>,
                              document_id:    <integer>,
                              um:             <string>
                              uc:             <string>
                              tsc:            <date>
                              tsm:            <date>
                           }
                        ]
                    }


  If an id is provided as query parameter, eg. `http://<hostname>:<port>/api/entity_documents/12345`, then a single entity_documents is returned (JSON) and the result is the following:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: {
                              id:             <integer>,
                              entity_id:      <integer>,
                              document_id:    <integer>,
                              um:             <string>
                              uc:             <string>
                              tsc:            <date>
                              tsm:            <date>
                       }
                   }

- `POST /api/entity_documents`:

  Insert a new entity_documents entry into the database. Parameter `document_id`, `entity_id` required, Others are optional:

        @param:    document_id: integer,
                   entity_id: integer,
                   uc: string,
                   um: string
        @return:   {
                      error: boolean,
                      message: string,
                      result: []
                   }

- `PUT /api/entity_documents`:

  Update a entity_documents entry. All parameters except id are optional:

        @param:    id: integer,
                   document_id: integer,
                   entity_id: integer,
                   uc: string,
                   um: string
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


- `DELETE /api/entity_documents`:

  Delete a entity_documents entry from the database:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }

- `DELETE /api/entity_documents/for_entity/:entity_id`:

  This method will delete all an entity_document record from the database for given entity_id.

        @param:    entity_id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }

### /api/collateral_documents

An collateral_document data model is defined as following:

      collateral_document: {
	   id:               <integer>,
	   collateral_id:    <integer>,
	   document_id:      <integer>,
	   tsc:              <date>,
	   tsm:              <date>,
	   uc:               <string>,
	   um:               <string>
     }


- `GET /api/collateral_documents`:

  Returns an array of collateral_documents.

        @param:    none.
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                          {
                              id:             <integer>,
                              collateral_id:  <integer>,
                              document_id:    <integer>,
                              um:             <string>
                              uc:             <string>
                              tsc:            <date>
                              tsm:            <date>
                           }
                        ]
                    }


  If an id is provided as query parameter, eg. `http://<hostname>:<port>/api/collateral_documents/12345`, then a single collateral_documents is returned (JSON) and the result is the following:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: {
                              id:             <integer>,
                              collateral_id:      <integer>,
                              document_id:    <integer>,
                              um:             <string>
                              uc:             <string>
                              tsc:            <date>
                              tsm:            <date>
                       }
                   }

- `POST /api/collateral_documents`:

  Insert a new collateral_documents entry into the database. Parameter `document_id`, `collateral_id` required, Others are optional:

        @param:    document_id: integer,
                   collateral_id: integer,
                   uc: string,
                   um: string
        @return:   {
                      error: boolean,
                      message: string,
                      result: []
                   }

- `PUT /api/collateral_documents`:

  Update a collateral_documents entry. All parameters except id are optional:

        @param:    id: integer,
                   document_id: integer,
                   collateral_id: integer,
                   uc: string,
                   um: string
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


- `DELETE /api/collateral_documents`:

  Delete a collateral_documents entry from the database:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }

- `DELETE /api/collateral_documents/for_collateral/:collateral_id`:

  This method will delete all an collateral_documents record from the database for given collateral_id.

        @param:    collateral_id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }

## Implemented WebHooks

- `POST /hooks/phoneHooks`:

  To trigger a webhook just make an http POST request to the hook url

      @param:    url: string (required)
                 event: string (required)
                 data: json (optional)
      @return:   {
                     error: boolean,
                     message: string,
                     result: []
                  }

- `POST /hooks/listo`:

  To trigger a webhook just make an http POST request to the hook url

      @param:    rfc: string (required)
                 invoice: string (required)
      @return:   {
                     error: boolean,
                     message: string,
                     result: []
                  }


### /api/collateral

An collateral data model is defined as following:

      collateral: {
       id:             <integer>,
       name:           <string>,
       valuation:      <string>,
       entity_id:      <integer>,
       loan_id:        <integer>,
       data:           <json>,
       um:             <string>
       uc:             <string>
       tsc:            <date>
       tsm:            <date>
      }


- `GET /api/collateral`:

  Returns an array of collateral.

        @param:    none.
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                          {
                           id:         <integer>,
                           name:       <string>,
                           valuation:  <string>
                           entity_id:  <integer>
                           loan_id:    <integer>
                           data:       <json>
                           uc:         <string>
                           um:         <string>
                           tsc:         <date>
                           tsm:         <date>
                           }
                        ]
                    }


  If an id is provided as params parameter, eg. `http://<hostname>:<port>/api/collateral/12345`, then a single loan_types is returned (JSON) and the result is the following:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: {
                           id:         <integer>,
                           name:       <string>,
                           valuation:  <string>
                           entity_id:  <integer>
                           loan_id:    <integer>
                           data:       <json>
                           uc:         <string>
                           um:         <string>
                           tsc:         <date>
                           tsm:         <date>
                       }
                   }

- `GET /api/collateral/for_entity/:entity_id`:

  Returns an array of collateral related to given entity_id

        @param:      entity_id: integer,
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                          {
                           id:         <integer>,
                           name:       <string>,
                           valuation:  <string>
                           entity_id:  <integer>
                           loan_id:    <integer>
                           data:       <json>
                           uc:         <string>
                           um:         <string>
                           tsc:         <date>
                           tsm:         <date>
                           }
                        ]
                    }

- `GET /api/collateral/for_loan/:loan_id`:

  Returns an array of collateral related to given loan_id

        @param:      loan_id: integer,
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                          {
                           id:         <integer>,
                           name:       <string>,
                           valuation:  <string>
                           entity_id:  <integer>
                           loan_id:    <integer>
                           data:       <json>
                           uc:         <string>
                           um:         <string>
                           tsc:         <date>
                           tsm:         <date>
                           }
                        ]
                    }

- `POST /api/collateral`:

  Insert a new collateral entry into the database. Parameter `name`,`valuation`, `entity_id`, `loan_id`  required, all other optional optional:

        @param:    name: string,
                   valuation: string,
                   entity_id: integer,
                   loan_id: integer,
                   data: json,
                   uc: string,
                   um: string
        @return:   {
                      error: boolean,
                      message: string,
                      result: {
                             id: integer,
                             name: string,
                             valuation: string,
                             entity_id: integer,
                             loan_id: integer,
                             data: json,
                             uc: string,
                             um: string,
                             tsc: date,
                             tsm: date
                      }
                   }

- `PUT /api/collateral`:

  Update a collateral entry. All parameters except id are optional:

        @param:      id: integer,
                     name: string,
                     valuation: string,
                     entity_id: integer,
                     loan_id: integer,
                     data: json,
                     uc: string,
                     um: string
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


- `DELETE /api/collateral`:

  Delete a collateral entry from the database:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }

### /api/entity_roles

An entity_role data model is defined as following:

    entity_role: {
        id:                       integer,
        name:                     string,
        description:              string,
        tsc:                      date,
        tsm:                      date,
        uc:                       string,
        um:                       string
    }


- `GET /api/entity_roles`:

  Returns an array of entity_role.

        @param:    none.
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                          {
                               id: integer,
                               name: string,
                               description: string,
                               tsc: date,
                               tsm: date,
                               uc: string,
                               um: string
                           }
                        ]
                    }


  If an id is provided as query parameter, eg. `http://<hostname>:<port>/entity_roles/12345`, then a single entity_role is returned (JSON) and the result is the following:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: {
                           id: integer,
                           name: string,
                           description: string,
                           tsc: date,
                           tsm: date,
                           uc: string,
                           um: string
                       }
                   }

- `POST /api/entity_roles`:

  Insert a new entity_role entry into the database. Parameter `name` required, `description` is instead optional:

        @param:    name: string,
                   description: string,
                   uc: string,
                   um: string
        @return:   {
                      error: boolean,
                      message: string,
                      result: []
                   }

- `PUT /api/entity_roles`:

  Update a entity_role entry. All parameters except id are optional:

        @param:    id: integer,
                   name: string,
                   description: string
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


- `DELETE /api/entity_roles`:

  Delete a entity_role entry from the database:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }

### /api/ledgers

A ledger data model is defined as following:

    ledger: {
                       id:         integer,
                       name:       string,
                       loan_id:    integer,
                       account_id: integer,
                       amount:     money,
                       projection: string,
                       datedue:    date,
                       installment:integer,
                       principal:  money,
                       interest:   float,
                       balance:    money,
                       um:         string
                       uc:         string
                       tsc:        date
                       tsm:        date
    }


- `GET /api/ledgers`:

  Returns an array of ledgers.

        @param:    none.
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                          {
                           id:         integer,
                           name:       string,
                           loan_id:    integer,
                           account_id: integer,
                           amount:     money,
                           projection: string,
                           datedue:    date,
                           installment:integer,
                           principal:  money,
                           interest:   float,
                           balance:    money,
                           um:         string
                           uc:         string
                           tsc:        date
                           tsm:        date
                           }
                        ]
                    }


  If an id is provided as query parameter, eg. `http://<hostname>:<port>/api/ledgers/12345`, then a single ledger is returned (JSON) and the result is the following:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: {
                           id:         integer,
                           name:       string,
                           loan_id:    integer,
                           account_id: integer,
                           amount:     money,
                           projection: string,
                           datedue:    date,
                           installment:integer,
                           principal:  money,
                           interest:   float,
                           balance:    money,
                           um:         string
                           uc:         string
                           tsc:        date
                           tsm:        date
                       }
                   }


- `GET /api/ledgers/for_account/:account_id`:

  Returns an array of ledgers related to account id

        @param:    account_id : integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                          {
                           id:         integer,
                           name:       string,
                           loan_id:    integer,
                           account_id: integer,
                           amount:     money,
                           projection: string,
                           datedue:    date,
                           installment:integer,
                           principal:  money,
                           interest:   float,
                           balance:    money,
                           um:         string
                           uc:         string
                           tsc:        date
                           tsm:        date
                           }
                        ]
                    }


- `GET /api/ledgers/for_loan/:loan_id`:

  Returns an array of ledgers related to loan id

        @param:    loan_id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                          {
                           id:         integer,
                           name:       string,
                           loan_id:    integer,
                           account_id: integer,
                           amount:     money,
                           projection: string,
                           datedue:    date,
                           installment:integer,
                           principal:  money,
                           interest:   float,
                           balance:    money,
                           um:         string
                           uc:         string
                           tsc:        date
                           tsm:        date
                           }
                        ]
                    }

- `POST /api/ledgers`:

  Insert a new document entry into the database. all are required:

	  @param:      name:       <string>,
                   loan_id:    <integer>,
                   account_id: <integer>,
                   amount:     <money>,
                   projection: <string>,
                   datedue:    <date>,
                   installment:<integer>,
                   principal:  <money>,
                   interest:   <number>,
                   balance:    <money>

	  @callback:     error: <boolean>
			 message: <string>,
			 results: []

- `PUT /api/ledgers`:

  Update a ledger entry. All parameters except id are optional:

	  @param:      id:         <integer>,
                   name:       <string>,
                   loan_id:    <integer>,
                   account_id: <integer>,
                   amount:     <money>,
                   projection: <string>,
                   datedue:    <date>,
                   installment:<integer>,
                   principal:  <money>,
                   interest:   <number>,
                   balance:    <money>
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


- `DELETE /api/ledgers`:

  Delete a ledger entry from the database:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


## Implemented WebHooks

To trigger a webhook just make an http POST request to the hook url, usually passing a JSON as following:


    {
      url: "/api/apiUrl",
      event: "eventName",
      data: {}
    }

The `data` field is optional and not currently used.


### /hooks/phoneHooks

- `POST /hooks/phoneHooks`:

  Triggers the phoneHook, which data model is defined as follows:

        PhoneHook: {
            id:           <integer>,
            url:          <url>,
            event:        <string>,
            data:         <json>
        }

  `url` is the url you want to call, `event` is the name of the event sent by the phone system. Basically, using this pair of `url`/`event` a data model record is matched and the appropriate JSON data found is then sent to the API identified with `url`.

  Return values are the following:


        @param:    url:   string,
                   event  string
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


### /api/voip

- `POST /api/voip`:

        @param:         uniqueid:     <string>, (optional - default is shortId)
                        billsec:      <integer>,
                        src:          <string>,
                        dst:          <string>,
                        calldate:     <date>,
                        file:         req.file[file] (as multipart/data file)
                        text:         <string>


  Return values are the following:

        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }

- `PUT /api/voip`:

        @param:         uniqueid:     <string>, Required
                        src:          <string>, (optional)
                        dst:          <string>, (optional)
                        status:       <string>, (optional)
                        text:         <string>, (optional)


  Return values are the following:

        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }



## TODO

- Data models
- Add documentation of data models (minimal)



### /api/kontox

    For more Info: http://developer.kontomatik.com/kontomatik-api-documentation

    For sample view, first login into site http://domian/login.html and then open http://domian/kontox.html
    Slecect any bank and put your credentials, and you will see view after few seconds

- `POST /`:

  send the kontox credential to server to run background job for user bank info, It will take few minutes to get data back from kontox.

        @param:    sessionId : string,
                   sessionIdSignature : string
                   entity_id : integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }

- `GET /account_info/for_entity/:entity_id`:

  Get the detail of user bank accounts from db.

        @param:    entity_id : integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                            id: integer,
                            entity_id: integer,
                            accountInfo: [{
                               name : string,
                               iban : string,
                               currencyBalance : string,
                               currencyName : string
                               owner : string
                               activeSinceAtLeast : string
                            }],
                            accountTransactions: [ // contain multiple arrays, depend on number of accountInfo, It will download last 6 month account hstory for each account in accountInfo
                            [
                                {
                                   transactionOn : string,
                                   bookedOn : string,
                                   currencyAmount :
                                   currencyBalance : string,
                                   partyIban : string,
                                   party : string,
                                   title : string,
                                   kind: string
                                   uuid: string
                                }
                            ]
                            ],
                            accountOwners: [{
                                   name : (string),
                                   address : (string),
                                   polishPesel: (string),
                                   polishNip: (string),
                                   phone : (string),
                                   email : (string),
                                   citizenship : (string),
                                   personalDocumentType : (string),
                                   personalDocumentNumber : (string),
                                   birthDate: (string) (date of birth)
                                   kind: string (string)
                                   polishRegon: (string)
                            }]
                       ]
                    }
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }

- `POST /import-accounts`:

  Initiates the import of accounts.

        @param:    sessionId : string,
                   sessionIdSignature : string
        @return:   {
                       error: boolean,
                       message: string,
                       result: [{
                           name : string, (official account name, as shown in the bank’s transaction system) (guaranteed)
                           iban : string, (full account number (with country code for IBAN accounts)) (guaranteed)
                           currencyBalance : string, (current account balance in an account’s currency (it can be different than the currency of the country which the bank is located in)) (guaranteed)
                           currencyName : string (currency symbol, e.g. "PLN") (guaranteed)
                           owner : string (name of the owner or owners of the account as supplied by the bank system.) (available except for exceptional circumstances)
                           activeSinceAtLeast : string (the date when the account was opened or the date of the oldest transaction found (but not older than a year if searching for older transactions would substantially affect the execution time of the command) (available except for exceptional circumstances)
                       }]
                    }
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


- `POST /import-account-transactions`:

  Initiates import of money transactions associated with a given account identified by account number.

        @param:    sessionId : string,
                   sessionIdSignature : string,
                   iban : string (full account number from `/import-accounts`)
                   since : date (start date in YYYY-MM-DD format, only transactions that occurred on or after the since date will be imported.)
        @return:   {
                       error: boolean,
                       message: string,
                       result: [{
                           transactionOn : string, (actual transaction date) (guaranteed)
                           bookedOn : string, (transaction’s booking date) (guaranteed)
                           currencyAmount : string, (transaction amount in account’s currency) (guaranteed)
                           currencyBalance : string,
                           partyIban : string, (full account number of the other party of the transaction.) (guaranteed for the transactions with a non-empty party attribute)
                           party : string, (the name of other party of the transaction is always available) (possibly none)
                           title : string, (transaction title) (possibly none)
                           kind: string (transaction type) (possibly none)
                           uuid: string (uuid)
                       }]
                    }
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


- `POST /import-owners`:

  Initiates the import of details of all the users associated with a given user account at the online transaction system.
  In most cases, the list returned by the command will contain only information about the sole owner of the user account.
  However, it may also contain the data of owner’s attorneys and/or co-owners in case of joint-account.
  In contrast to the import-accounts command, this command scrapes data from the global settings page rather than from the details pages for each of the bank account.

        @param:    sessionId : string,
                   sessionIdSignature : string
        @return:   {
                       error: boolean,
                       message: string,
                       result: [{
                           name : (string), (name and surname or company’s name) (guaranteed)
                           address : (string), (address)  (possibly none)
                           polishPesel: (string) (PESEL number) (possibly none)
                           polishNip: (string) (NIP number) (possibly none)
                           phone : (string), (phone) (possibly none)
                           email : (string), (email) (possibly none)
                           citizenship : (string), (citizenship) (possibly none)
                           personalDocumentType : (string), (identity document type, as presented by the bank) (possibly none)
                           personalDocumentNumber : (string), (identity document number) (possibly none)
                           birthDate: (string) (date of birth) (possibly none)
                           kind: string (string) (one of the three: "OWNER", "CO_OWNER, "COMPANY") (guaranteed)
                           polishRegon: (string) (REGON number) (possibly none)
                       }]
                    }
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


- `POST /sign-out`:

  Logs out from the online transaction system, (Only if given target online transaction system supports it)

        @param:    sessionId : string,
                   sessionIdSignature : string
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


- `GET /aggregates`:

  Returns aggregates for given owner.

        @param:    sessionId : string,
                   sessionIdSignature : string
        @return:   {
                       error: boolean,
                       message: string,
                       result: [{
                           externalId : (string),
                           target : (string),
                           activeSinceAtLeast: (string),
                           currencyName: (string),
                           iban : (string),
                           owner : (string),
                           accounts : {
                                            month : {
                                                $: (string)
                                            },
                                            daysInMonth: (string),
                                            withdrawalsTotal: (string),
                                            withdrawalsCount: (string),
                                            depositsTotal: (string),
                                            depositsCount: (string),
                                            balance: (string),
                                            balanceAverage: (string),
                                            positiveBalanceAverage: (string),
                                            negativeBalanceAverage: (string),
                                            maxBalance: (string),
                                            minBalance: (string),
                                            polishUsTransactionsTotal: (string),
                                            polishUsTransactionsCount: (string),
                                            polishZusTransactionsTotal: (string),
                                            polishZusTransactionsCount: (string)
                                        }
                       }]
                    }
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


### /api/listo

- `POST /api/listo`:

  It will append rfc and customer_token in Entity data:json record, Same end point can be used to update listo credentials for entity

        @param:    rfc: string
                   customer_token: string
                   entity_id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }




# Integration of Kontox Wigdet On Client Side

    An example of embedding widget in webpage is shown below:
    You can check it on developer website also `http://developer.kontomatik.com/kontomatik-api-documentation/#customizing-the-widget`

        <!DOCTYPE html>
        <html>
        <head>
          <script type="text/javascript" src="https://signin.kontomatik.com/assets/signin-widget.js"></script>
        </head>
        <body>

          <div id="kontox"></div>

          <script type="text/javascript">
            embedKontomatik({
              divId: 'kontox',           // where to embed KontoX widget
              client: 'your_client_id',  // your client id
              country: 'mx',             // name of the country to filter targets by
              locale: 'mx',              // widget's user interface language
              ownerExternalId: 's83c3',  // your identifier for the user
              showFavicons: true,
              onSuccess: function(target, sessionId, sessionIdSignature) {
                // User successfully signed in to the bank
                // Pass target, sessionId and sessionIdSignature to your backend
              },
              onError: function(exception) {
                // User failed to sign in to the bank. Possible causes: failure to provide
                // valid credentials, temporary connection problems.
              }
            });
          </script>
        </body>
        </html>


    Description of parameters passed to the embedKontox() function:

        divId - obligatory parameter, an id of element into which the widget will be placed.
                Make sure the element exists before calling embedKontox() function.

        client - obligatory parameter, an identifier that you received when you registered with KontoX.

        country - optional parameter, ISO 3166-1 alpha-2 code format, filters targets by the country they operate in.
                If the parameter is omitted, a drop down select list for country might be shown.

        locale - optional parameter, ISO 639-1 format, controls widget’s user interface language, if none or unsupported is specified, the widget will use Polish language.

        ownerExternalId - optional parameter, the widget will use this parameter to create API session with KontoX Service.
                        It is highly recommended to provide KontoX Service with this parameter, as it will enable you to associate users with sessions and fetch aggregated data via single call to API.

        onSuccess - obligatory parameter, callback that will be called when user has successfully logged into online transaction system.
                    Upon successful authorization in online transaction system the widget will provide you with three parameters: sessionId, sessionIdSignature and target.
                    You should pass them to your backend application.

        onError - optional parameter, callback that will be called when user has failed to sign into online transaction system.
                The widget will provide you with exception parameter, which indicates what went wrong during an attempt to sign in.

        showFavicons - optional parameter, Set to true to show banks’ favicons in a drop down list


### /api/apikey


- `POST /api/apikey`: require `x-access-token` in url `header`.

  This method will create a api key in database. Only authenticated user can create it.
  after creating an api key, allocate it to user, then protected route can can accessed by passing `x-api-key` iin url `header`
  Note: It can be valid only for some routes (Protected routes not configured yet)

        @param:
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }
        @return:   {
                       error: boolean,
                       message: string,
                       result: {
                            id: integer
                            name: string
                            key: string (it is api key)
                            userId: string
                            expires: date
                            active: string
                        }



### /api/emails

A email data model is defined as following:

    email: {
                       id:         integer,
                       sender:     string,
                       data:       json,
                       um:         string,
                       uc:         string,
                       tsc:        date,
                       tsm:        date
    }


- `GET /api/emails`:

  Get all Email records from our Email model. An array of Email is returned.

        @param:    none.
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                          {
                             id: integer,
                             sender: string,
                             data: json,
                             tsc: date,
                             tsm: date,
                             uc: string,
                             um: string
                          }
                        ]
                    }


  If an id is provided as query parameter, eg. `http://<hostname>:<port>/api/emails/12345`, then a single email is returned (JSON) and the result is the following:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: {
                            id: integer,
                            sender: string,
                            data: json,
                            tsc: date,
                            tsm: date,
                            uc: string,
                            um: string
                       }
                   }

- `GET /api/emails/sender/:email`:

  Get all Email from our Email model by sender email.
  We expect sender email as parameter, eg. "http://<hostname>/api/emails/sender/:email".
  An Email array is returned (JSON).

        @param:    email : string
        @return:   {
                       error: boolean,
                       message: string,
                       result:
                       [
                          {
                              id: integer,
                              sender: string,
                              data: json,
                              tsc: date,
                              tsm: date,
                              uc: string,
                              um: string
                           }
                        ]
                    }

- `POST /api/emails`:

  This method will insert a new email record into the database. Below parameters are required

	  @param:      sender:    string,
                   data:      json

	  @return:   {
	                 error: <boolean>,
			          message: <string>,
                     results: []
                    }

- `PUT /api/emails`:

  We expect id as parameter, all the other parameters are instead optional.
  This method will update a email model db record.

      @param:        id:       integer,
                     sender:   string,
                     data:     json
      @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


- `DELETE /api/emails`:

  This method will delete an email record from the database.:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }




### /api/tokens

A token data model is defined as following:

    token: {
                       id:         integer,
                       key:        string,
                       tag:        string,
                       data:       json,
                       um:         string,
                       uc:         string,
                       tsc:        date,
                       tsm:        date
    }


- `GET /api/tokens`:

  Returns an array of tokens.

        @param:    none.
        @return:   {
                       error: boolean,
                       message: string,
                       result: [
                          {
                             id:         integer,
                             key:        string,
                             tag:        string,
                             data:       json,
                             um:         string,
                             uc:         string,
                             tsc:        date,
                             tsm:        date
                          }
                        ]
                    }


  If an id is provided as query parameter, eg. `http://<hostname>:<port>/api/tokens/12345`, then a single token is returned (JSON) and the result is the following:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: {
                            id:         integer,
                            key:        string,
                            tag:        string,
                            data:       json,
                            um:         string,
                            uc:         string,
                            tsc:        date,
                            tsm:        date
                       }
                   }

- `GET /api/tokens/email/:email`:

  Returns a token related to email

        @param:    email : string
        @return:   {
                       error: boolean,
                       message: string,
                       result:
                          {
                              id: integer,
                              key: string,
                              tag: string,
                              data: json,
                              tsc: date,
                              tsm: date,
                              uc: string,
                              um: string
                           }
                    }

- `POST /api/tokens`:

  This method will insert a new token record into the database. Below parameters are required

	  @param:      key:       string,
                   tag:       string,
                   data:      json

	  @return:   {
	                 error: <boolean>,
			          message: <string>,
                     results: []
                    }

- `PUT /api/tokens`:

  We expect id as parameter, all the other parameters are instead optional.
  This method will update a token model db record.

      @param:        id:       integer,
                     key:      string,
                     tag:      string,
                     data:     json
      @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


- `DELETE /api/tokens`:

  This method will delete a token record from the database.:

        @param:    id: integer
        @return:   {
                       error: boolean,
                       message: string,
                       result: []
                    }


# Initial Configuration Data

### loan_type
    1. SMB Mortgage Loan

### entity_role
    1. Acreditado ( = Borrower)
    2. Garante Hipotecario ( = Mortgage Guarantor)
    3. Aval (obligado solidario) ( = Guarantor)
    4. Cónyuge de Garante Hipotecario (= Spouse of Mortgage Guarantor)

### document_type
    1. rfc
    2. curp
    3. ife
    4. more etc


### Socket server

socket server is up on respected port of dev, pro or local
just add it as http://domain

Agent dashboard can be accessed from here
http://domain/chat

# Strider Server

Our server used strider to deploy application changes. It can be accessed from [here](http://strider.credijusto.com:8080/juanviolaz/cj-lms/)

There are two main branches, `master` and `staging`. If we push code in these these branches, It will deploy automatically on server.

`master` branch is used for production changes, it can be viewed [here](prolms.credijusto.com).

`staging` branch is used for development changes, it can be viewed [here](devlms.credijusto.com).

- Add users documentation of data models (minimal)
- Build an index for this README.md

# LMS Server

LMS server is hosted on [AWS EC2]([https://aws.amazon.com/ec2/) and its instance type is t2.small.

# LMS Database

LMS Server is using [AWS PostgreSQL RDS](https://aws.amazon.com/rds/).
It's setting can be found in `cj-lms/backend/config/env/<NODE_ENV>.js`
`NODE_ENV` is node environment variable, It can be one of `development,`production`, or `local`.  Default is `local`
