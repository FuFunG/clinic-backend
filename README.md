# clinic-backend

Project Testing EndPoint: http://clinic.futszfung.com/

## Testing Account:
- test@test.com / Passw0rd (Normal User)
- doctor@test.com / Passw0rd (Doctor)

## Ahourization:
- Only Doctor can be create consultation record.
- Doctor only create consultation base on there clinic.
- Doctor only getting there clinic consultation records.

- All user only getting their consultation records

## Tech Stack:

- Express.js
- Typescript
- PostgreSQL
- TypeORM
- JWT

## Project Structure:

- [Entity](/src/entity) - Database Entity
- [Auth](/src/Auth) - JWT + Authourization Minddleware
- [Query](/src/query) - SQL Query
- [Response](/src/Response) - HTTP Response Structure
- [Route](/src/route) - API Entry Point