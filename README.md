# Getting Started

## Install dependencies

```
npm i
```

## Environment Variables

Copy .env config

```
cp .env.sample .env
```

Get Api Key from [Coinbase](https://docs.cdp.coinbase.com/coinbase-app/docs/getting-started)

Supply the Api Key name to the `COINBASE_KEY_NAME` env var in the .env

Supply the Api Key secret to the `COINBASE_KEY_SECRET` env var in the .env. Ensure to wrap it in double quotes

## Database setup

```
npx prisma migrate reset
```

When it says `Are you sure you want to reset your database? All data will be lost.`, ensure you input `y` to set the database up

This will creatge 2 files in the `src/database` directory: `dev.db` & `dev.db-journal`. `dev.db` is a sqlite database that will be used by the application

# Runnig the App

```
# development
npm run start

# watch mode
npm run start:dev
```

# Running tests
```
# unit tests
npm run test

# test coverage
npm run test:cov
```