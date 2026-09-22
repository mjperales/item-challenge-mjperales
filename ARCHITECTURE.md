# Architecture Documentation

## Database Model

TableName: `exam-items-dev`
PK: `id`

To query by `version`, I would have to duplicate `version` outside of `metadata` and use a GSI: `verion-index`, PK: `version`.

## Infrastructure

CDK allows for the creation of `dev` and `prod` stacks.
We can use the `develop` branch to deploy to `dev` and the `main` branch to deploy to production.
It keeps database, API, and lambdas seperate and allows for testing in `dev`.

## Lambdas

I created a seperate file for each lambda. We could also use **one** lambda and call a correponding function for
each HTTP method.

## If I had more time

- I would add CDK tests
- Create handlers for all other endpoints
