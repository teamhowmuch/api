# HowMuch Api

## Prerequisites

1. Install Node Version Manager `nvm` : 
    1. See https://github.com/nvm-sh/nvm for installation instructions
    2. Add nvm to bash or ZShell profile: https://stackoverflow.com/questions/16904658/node-version-manager-install-nvm-command-not-found
2. Install the latest `LTS` version of Node 
    1. `nvm install node`
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

Before you perform the next step, first request a new OTP (as you can use the OTP only one time ;-)

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

## List banks

```sh
curl -X GET -H "Content-Type: application/json" \
    -H "Authorization: Bearer $JWT" \
    http://localhost:3010/banks-connections
```

```
curl -XGET -H "Content-Type: application/json" -H "Authorization: Bearer $JWT" http://localhost:3010/bank-connections/list-banks
```

```json
[
    {
        "id": "ABNAMRO_ABNANL2A",
        "name": "ABN AMRO Bank",
        "bic": "ABNANL2A",
        "transaction_total_days": "540",
        "countries": [
            "NL"
        ],
        "logo": "https://cdn.nordigen.com/ais/ABNAMRO_FTSBDEFAXXX.png"
    },
(...)
```

```sh
curl -XPOST -H "Content-Type: application/json" -H "Authorization: Bearer $JWT" \
    -d '{"bankId": "SANDBOXFINANCE_SFIN0000"}' \
    http://localhost:3010/bank-connections
```

```json
{
  "id": 1,
  "provider": "nordigen",
  "created_at": "2022-02-19T15:13:50.930Z",
  "status": "CR",
  "link": "https://ob.nordigen.com/psd2/start/63b46158-ce26-4912-b46d-da6c41de7e09/SANDBOXFINANCE_SFIN0000",
  "accounts": []
}
```

User visits the URL in `link` and gives consent via the process of the bank.
You can just use dummy userID and PIN (ie: 1 and 1)

Check if we now have access

```sh
curl -XPATCH -H "Content-Type: application/json" -H "Authorization: Bearer $JWT" \
    http://localhost:3010/bank-connections/1/requisition
```

```json
{
  "id": 1,
  "provider": "nordigen",
  "created_at": "2022-02-19T15:13:50.930Z",
  "status": "LN",
  "link": "https://ob.nordigen.com/psd2/start/63b46158-ce26-4912-b46d-da6c41de7e09/SANDBOXFINANCE_SFIN0000",
  "accounts": [
    "1048f194-cb13-4cee-a55c-5ef6d8661341",
    "582a6ea9-81c7-4def-952d-85709d9432cf"
  ]
}
```

Please note the `status` attribute which has now been changed from `CR` to `LN`

## Trigger the transaction-impport job using REST endpoint

```sh
curl -X POST -H "Content-Type: application/json" \
    http://localhost:3010/import
```

## 

## install redis locally

`brew install redis` 

start redis server: `redis-server /usr/local/etc/redis.conf` 

download a redis client:
- for Mac: 
    - (Red)[https://apps.apple.com/us/app/red-ui-for-redis/id1491764008?mt=12]
    - (Medis 2)[https://apps.apple.com/us/app/medis-2-gui-for-redis/id1579200037?mt=12]




