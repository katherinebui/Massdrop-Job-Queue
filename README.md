# Massdrop Job Queue Challenge

## Challenge:
Create a job queue whose workers fetch data from a URL and store the results in a database. The job queue should expose a REST API for adding jobs and checking their status / results.

## Tech Stack:
Full JavaScript stack, using: Kue, Express, Redis, Body-Parser, Cookie-Parser, Morgan, Valid-Url and for testing: Supertest and Tape

## To start:
run:
```
redis-server
```
```
npm start
```

## To test:
run:
```
npm test
```
## REST API:
### To POST a new job (to create a new job):
```
POST /create/:url
```
Example:
```
curl "http://localhost:3000/create/www.google.com" -X POST
```

### To GET status information on a job:
```
GET /:id/status
```
Example:
```
curl "http://localhost:3000/1/status"
```

### To query database to check for key/value pair:
```
redis-cli
```
#### To grab all keys:
```
KEYS *
```

#### To grab all values for a key (which is also the job ID):
```
HGETALL (job id)
```
Example:
```
HGETALL 8
```

