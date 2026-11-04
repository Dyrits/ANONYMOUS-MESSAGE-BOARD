# ANONYMOUS-MESSAGE-BOARD

## About The Project

An anonymous message board back end built with Express and MongoDB (Mongoose), with security headers via Helmet. Assessment project (work in progress, per the repository description) for freeCodeCamp's "Information Security" certification.

### Built With

- Node.js
- Express
- MongoDB (Mongoose)
- Helmet

## Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB connection string

### Installation

```sh
npm install
```

Copy `sample.env` to `.env` and fill in the values.

### Running

```sh
npm start
```

Tests:

```sh
npm test
```

## License

MIT is declared in package.json; no license file is present in this repository.

## Contact

Dyrits - https://github.com/Dyrits

## Dependency verification (November 2026)

Use Node.js 26.13.0 LTS and a clean `npm ci`. Mocha 12 and Chai HTTP 4 run the existing CommonJS tests; Mocha's Glob dependency is overridden to patched 14.0.3. Both functional tests pass against an isolated local MongoDB 6.0.14 database: thread creation/password hashing and retrieval of recent threads/replies. The CLI suite closes its server and database connections, while the embedded FCC runner uses the same BDD interface and keeps the app available. Two moderate test-tool findings remain (one distinct minimatch advisory). The reply-post route is still an unimplemented placeholder and was not treated as working. No hosted database or deployment was tested.
