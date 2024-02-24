## ABOUT

- The study project about CQRS.

### What is it?

CQRS stands for COMMAND QUERY RESPONSABILITY SEGREGATION, where you have layer for command(operation like: save, update and delete) and layer query(opertions like: select). WARN: command has exclusive database  and query has exclusive database.

### What's usecases ?

There are application where you save data one way and when need retrieve data for client you need to send in different structure. So, you have command to persist that data and query database where you can define right structure to save data to easly retrieve data.

## Pros 

- You split the load between 2 database.
- For query layer you can structure data in database based how you go to return in future, so that way you prevent take long time to return data or execute heavy queries to return what client needs.

## Cons

- Eventual consistency. Warn: you need to analyse if you businees allow it.
- Keep 2 database with each database has data structured different for each one.
- You need to know about things such as: messaging queue and async processes.


## Technlogies

- Node.js
- Typescript
- Nest.js
- Bull.js + Redis(Messaging queue)
- Docker 
- Docker compose
- Database
  - Postgresql(Command layer)
  - ElasticSearch(Query layer)


## Instructions to run locally

- Clone.
- Execute command **npm install**.
- Create **.env** file based **.env.example** file.
- Execute command **docker-compose up -d** to setup Postgresql, ElasticSearch, Kibana(Ui to visualize elasticSearch data, redis).
- Execute command **npm run start:dev** to start Nest.js api.

