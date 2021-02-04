# Delivery Much stock service challenge

## How to run the APP
- You need to have docker instaled in your machine
- Add the correct permissions to the seed file with `sudo chmod +x ./src/infra/db/seed-products.ts`
- Run `docker-compose up -d --build` 
- There is a container in the docker-compose containing the seed runner, so when you run the above command, it will run together. 
- The application is up and running on port **5000**.
- You can run the tests using `yarn test` or if you prefer, `yarn test:coverage` to run the tests and generate a coverage file.

## About the functionalities
- This service is an API and a Worker;
- The Worker part is connected with RabbitMQ and consume an exchange named `stock`
- This exchange will emit in every second a product name and an action (*incremented* or *decremented*)
- The name of the actions are self explanatory, but the Worker needs to consume those events and update the quantity of the given product in the database.
- The API part is a REST API containing 4 enpoints related with `orders` and `products`

## About the API
- The API contain the following endpoints:
 - `GET /orders` - Retrive all the orders from the database
 - `POST /orders` - Add a new order
 - `GET /orders/:id` - Retrieve an order by id
 - `GET /products/:name` - Retrieve a product by name
 - There is also a swagger configured in the API, so if you want to see those endpoints, just access the `/swagger` endpoint from a browser.

## About the stack and patterns used
- Was build with NodeJS 14.15 (LTS)
- Typescript
- OOP
- Clean Architecture
- Usage os SOLID principles 
- [Tsyringe](https://github.com/microsoft/tsyringe) as DI Container
- [TypeORM](https://typeorm.io/#/) to object-relational mapping
- MongoDB as database
- [jest](https://jestjs.io/en/) for unit tests
- [supertest](https://www.npmjs.com/package/supertesthttps://www.npmjs.com/package/supertest) for integration (e2e) tests
- [amqplib](https://www.npmjs.com/package/amqplib) to communicate with RabbitMQ
- Docker and docker-compose

**To Improve**
- Increase the total test coverage.
- Add a CI/CD pipeline to host the service in a cloud provider.
