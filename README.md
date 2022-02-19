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

Hello World
```

## Create a local user account

```sh
curl -X POST -H "Content-Type: application/json" \
    -d '{"email": "egbert@egbertpot.nl"}' \
    http://localhost:3010/users
```

## Authenticate

```sh
curl -X POST -H "Content-Type: application/json" \
    -d '{"email": "egbert@egbertpot.nl" }' \
    http://localhost:3010/auth/request-otp
```

```sh
curl -X POST -H "Content-Type: application/json" \
    -d '{"email": "egbert@egbertpot.nl", "password": "<the OTP on your commandline>"}' \
    http://localhost:3010/auth/login

{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVnYmVydEBlZ2JlcnRwb3QubmwiLCJzdWIiOjEsImlhdCI6MTY0NTI4NTQ0OSwiZXhwIjoxNjQ1MjkxNDQ5fQ.GprmLY2m9eNzdqZ1O6rqsFF6hFEzQeRUMgrbmws_Wio"}
```

```sh
curl -X POST -H "Content-Type: application/json" \
    -d '{"email": "egbert@egbertpot.nl", "password": "<the OTP on your commandline>"}' \
    http://localhost:3010/auth/login | jq -r .access_token | read JWT
```

Check if the `JWT` variable was correctly set

```
echo $JWT

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVnYmVydEBlZ2JlcnRwb3QubmwiLCJzdWIiOjEsImlhdCI6MTY0NTI4NTQ0OSwiZXhwIjoxNjQ1MjkxNDQ5fQ.GprmLY2m9eNzdqZ1O6rqsFF6hFEzQeRUMgrbmws_Wio
```

## Trigger the transaction-impport job using REST endpoint

```sh
curl -X POST -H "Content-Type: application/json" \
    http://localhost:3010/import
```
