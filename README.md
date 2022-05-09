# HowMuch Api

## Prerequisites

1. Install Node Version Manager `nvm`
2. Install the latest `LTS` version of Node
3. Start the PostgreSQL database from the `dev-db` git repository (use `docker-compose up`)
4. Install `yarn`

## Getting started

Put the `.env` file in place. Ask Daan for the `.env` file

Start the service

```sh
$ yarn start:dev
```

Validate that the server is running

```sh
$ curl http://localhost:3010

Checkout Postman collection for more info