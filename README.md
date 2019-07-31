<p align="center">
    <a href='https://coveralls.io/github/jasoncarty/booking-system-api?branch=master'>
        <img src='https://coveralls.io/repos/github/jasoncarty/booking-system-api/badge.svg?branch=master' alt='Coverage Status' /></a>
    <a href="https://travis-ci.org/jasoncarty/booking_system_ruby.svg?branch=master">
        <img src="https://travis-ci.org/jasoncarty/booking-system-api.svg?branch=master" alt="build">
    </a>
</p>

## Description

An API for a booking system. Built with NestJS.

## Installation

```bash
$ npm install
```

## Setting up githooks

```bash
$ git config core.hooksPath .githooks
$ chmod +x .githooks/*
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Unit tests

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## E2E tests local

In 1 terminal
```bash
$ npm run e2e:prepare
```

In another terminal
```bash
$ npm run build
$ npm NODE_ENV=test run start
```

In first terminal
```bash
$ npm run e2e:test:execute
```

## E2E tests in docker

```bash
$ docker build -t jason.carty/booking-system-api .
$ docker-compose up --abort-on-container-exit --exit-code-from app2
```
