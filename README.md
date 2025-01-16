# Overview

This application is a robust and scalable currency conversion service built with Node.js using the NestJS framework, which leverages Express under the hood. NestJS is a preferred choice for this project because of its opinionated structure, comprehensive functionality, and built-in tools that simplify creating a robust and maintainable application.

The service integrates with external APIs to perform real-time currency conversions, logs and stores user requests for auditing purposes, and implements per-user rate limiting to ensure fair usage. It supports both FIAT and cryptocurrencies, including USD, EUR, BTC, and ETH, making it versatile for modern financial needs.

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
npm run db:init
```

This will create a `dev.db` file which is a sqlite database that will be used by the application. It will also seed the database with a sample user.

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

# Application Details

## Endpoints

Endpoint: `GET /convert`
Description: Converts a specified amount from one currency to another using real-time exchange rates. Optionally, a source can be specified to choose between supported currency providers.
Inputs (as Query Parameters):

- `from` (string, required): The source currency. Supported values: USD, EUR, BTC, ETH.
- `to` (string, required): The target currency. Supported values: USD, EUR, BTC, ETH.
- `amount` (number, required): The amount to convert.
- `source` (string, optional): The currency exchange source to use. Supported values:
  - COINBASE (default): Fetches exchange rates from the Coinbase API.
  - RANDOM: Generates random exchange rates to demonstrate an alternative provider.

Example Requests:

Default source (Coinbase):

```
GET /convert?from=USD&to=EUR&amount=100
```

## Framework

This application is built using **NestJS**, a powerful and versatile framework for developing scalable server-side applications with Node.js. While the assignment specifies using Node.js with Express, NestJS fully satisfies this requirement as it is built on top of Express (via the `@nestjs/platform-express package`) and seamlessly integrates its capabilities.

I chose NestJS for this project because of its exceptional developer experience (DX) and my significant experience with the framework. NestJS allows me to move much faster by providing essential features like dependency injection, modular design, middleware handling, and more—out of the box—in a well-organized and easy-to-use manner. Setting up these major pieces manually with vanilla Express would take considerably more time and effort.

If you look at the package.json file, you’ll see the `@nestjs/platform-express` package, which connects the framework to the underlying Express platform.

NestJS brings together the simplicity of Express with the power of a structured and feature-rich framework, making it the ideal choice for building maintainable and production-ready applications.

## Authentication

This application implements API key-based authentication by mapping a Bearer token provided in the Authorization header to a unique user ID. Each request must include this header to identify the user. For example:

```
Authorization: Bearer dab458d6-8352-42e6-88a1-88acc76b4e43
```

This approach ensures that every request can be securely associated with a specific user, enabling features like rate limiting and request logging on a per-user basis.

Under the hood, this leverages NestJS’s powerful [guard](https://docs.nestjs.com/guards) abstraction to validate the Bearer token provided in the Authorization header. The guard ensures the token is both present and corresponds to a valid user record in the database, adding a secure layer of authentication to every request.

## Database

This application uses **SQLite** as its database engine, offering a lightweight, file-based solution ideal for local development. For database interactions, I chose **Prisma ORM** due to my familiarity with it and the excellent developer experience it provides. Prisma’s modern, type-safe query builder and schema-driven workflow streamline database management and make development enjoyable.

While I opted for Prisma in this project, there are many other excellent ORM options available that could also work well, depending on individual preferences and project requirements.

The database is used to store:

- **Request Logs**: Captures details of each API request, including endpoints, query parameters, and timestamps.
- **User Records**: Maintains user data to support authentication and enforce rate limits.

This setup ensures a reliable, efficient, and developer-friendly approach to managing the application’s data.

## Testing

This application uses **Jest**, a powerful testing framework that integrates seamlessly with NestJS, to ensure functionality and reliability. Jest’s speed, built-in mocking, and snapshot testing capabilities make it an excellent choice for writing maintainable and effective tests.

### Philosophy

The testing approach emphasizes practicality and maintainability, with the following guiding principles:

- **Validate Behavior, Not Implementation**: Tests focus on what the code should do, rather than how it does it. This makes tests resilient to refactoring and ensures they align with the application’s goals.
- **Emphasize Integration Tests**: Integration tests are prioritized to cover as many code paths as possible, ensuring that components work together as expected. Unit tests are used selectively for logic with well-defined inputs and outputs.
- **Prioritize Critical Business Logic**: Testing efforts are concentrated on the core functionality of the application, such as currency conversion, rate limiting, and API integrations, to maximize impact.
- **Key Coverage Over 100% Coverage**: The goal is not to achieve 100% code coverage but to have meaningful coverage in critical areas. Overemphasizing full coverage can lead to brittle tests that are difficult to maintain due to excessive implementation-level mocking.

This philosophy ensures that the tests provide strong protection against regressions while remaining maintainable and relevant as the application evolves.

## Rate Limiting

The application implements per-user rate limiting to ensure fair usage and prevent abuse. Each user is allowed:

- 100 requests per workday (Monday to Friday).
- 200 requests per day on weekends (Saturday and Sunday).

Rate limiting is enforced using NestJS’s guard abstraction, which intercepts incoming requests and validates the user’s request count based on their unique ID from the Authorization header. The guard tracks usage and ensures that requests exceeding the limit receive an appropriate error response, notifying users that their quota has been exhausted.

To provide transparency, the application includes rate limit details in the response headers for each request:

- `X-RateLimit-Limit-PerUser`: Indicates the maximum number of requests allowed within the current period.
- `X-RateLimit-Remaining-PerUser`: Shows the number of remaining requests for the user in the current period.
- `X-RateLimit-Reset-PerUser`: Specifies the time (in milliseconds) when the rate limit will reset.

By leveraging the guard abstraction and including these headers, the application maintains system stability, provides a fair experience for all users, and offers clear feedback on rate limit status.

## Currency Exchange Providers

This application supports multiple currency exchange sources, such as Coinbase and a custom Random Source, to fetch exchange rates for both FIAT and cryptocurrencies. The strategy pattern is used to manage these sources, enabling seamless substitution and extension of exchange rate providers.

Each source implements a common interface, ensuring consistent behavior regardless of the underlying provider. For example:

- The Coinbase provider fetches real-time exchange rates from the Coinbase API.
- The Random provider generates random exchange rates, demonstrating how alternative providers can be easily integrated.

The application dynamically selects the appropriate source based on the user’s request, making it easy to add or replace exchange sources without modifying the core business logic. This design ensures flexibility, scalability, and maintainability.
