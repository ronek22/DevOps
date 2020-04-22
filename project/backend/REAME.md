### Create network

`docker network create my-demo-app`

### Run redis and postgres containers in the same network allows each other to communicate

Redis

`docker run --rm --name my-redis --network my-demo-app redis`

Postgres

`docker run --rm --name my-postgres -e POSTGRES_PASSWORD=123qaz123qaz --network my-demo-app  postgres`

### Run backend app with volumes mapping and environmental variables to configure databases 
`docker run --env REDIS_HOST=my-redis --rm --name my-backend --network my-demo-app -v /opt/app/node_modules -v ${PWD}:/opt/app -e PGHOST=my-postgres -e PGUSER=postgres -e PGDATABASE=postgres -e PGPASSWORD=123qaz123qaz -e PGPORT=5432 <build-id>`