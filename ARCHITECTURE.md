# Architecture Documentation

## Getting Started

Use `env.example` to setup environment variables.

- Run `pnpm dev` to run server locally and try out two endpoints.
- Run `pnpm test` to run tests

Note: handlers use DynamoDb. I used Docker to test things locally with DynamoDb.

I only implemented two endpoints:

- GET /items/:id
- POST /items

My strategy:

- Create handlers with tests using in-memory store
- Create infrastructure with AWS CDK
- Update handlers and tests to use DynamoDb
- Update AWS CDK to create a table and add permissions to lambdas
- Create helper functions to use in handlers and also in local `server.ts`

## Database Model

TableName: `exam-items-dev`
PK: `id`

Note: Did not implement a GSI for version.

To query by `version`, I would have to duplicate `version` outside of `metadata` and use a GSI: `verion-index`, PK: `version`.

## Infrastructure

CDK allows for the creation of `dev` and `prod` stacks.
We can use the `develop` branch to deploy to `dev` and the `main` branch to deploy to production.
It keeps database, API, and lambdas seperate and allows for testing in `dev`.

To validate:

- `cd infrastructure` and `npx cdk synth`

```
infrastructure/
  bin/
    infrastructure.ts
  lib/
    infrastructure-stacks.ts
```

## Lambdas

I created a seperate file for each lambda.

Lambda locations:

```
src/
  handlers/
    createItemHandler.ts
    getItemHandler.ts
```

## If I had more time

- I would add CDK tests
- Create handlers for all other endpoints
