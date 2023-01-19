# ehua-studies
HUA E-Studies Repository

## Dependencies
----------------------------------
[Docker Platform](https://www.docker.com/) should be installed in order to run the web application. **Docker Images** will be download automatically by executing the commands below.

## Bash 
----------------------------------
**Create new files for _Environment variables_ by coping the example files.**
```
    $ cp .env.test .env
    $ cp ./frontend/.test.env ./frontend/.env
    $ cp ./admin_console/.test.env ./admin_console/.env
```
>After copy the env files add values to the variables

## **Run web server via _Docker Engine_**
----------------------------------
> Open bash in the root of the project directory and run the following commands.


@*Interactive mode*
* docker start
```
    docker-compose build
```
* docker running
```
    docker-compose up
```
* docker end - remove
```
    docker-compose down
```


@*Batch mode*
* docker running in backround
```
    docker-compose up -d
```
* docker view active containers
```
    docker ps
```
* docker end
```
    docker kill (container id)
```

## Enter MongoDB container and create DB for the frontend
----------------------------------
> Enter the container bash
```
    docker exec -it ehua-studies-mongodb_container-1 mongosh -u "root" -p "rootpassword"
```
#### mongodb shell
>View all databases
```
    show dbs
```
>Select admin user
```
    use admin
```
>Create a new user for the database (owner)
```
    db.createUser({user: "hua_user", pwd: "hua_pass", roles:[{role:"dbOwner", db:"huadatabase"}]})
```
>Change to the new database
```
    use huadatabase
```
>Run query to find all application users
```
    db.feusers.find()
```

## Run Test Data Migration from the *admin* application
----------------------------------
1. Enter **admin_console** on the localhost
2. Use admin credentials from the ./admin_console/.env 
3. Login the application
4. Click one by one the urls into the screen
5. Data from csv files will be inserted to the backend database
>You are free to add new data into files, based on database structure and relatioships

## MinIO Platform
----------------------------------
[MinIO](https://min.io/) used as an object storage for store the uploaded documents from the application
* Enter MinIO on the localhost
* Login with admin credentials
* Create new Access Key 
* Create new Secret Key
* Copy these to ./frontend/.env parameters

## View Backend API Web Services Definitions and Models
----------------------------------
>Enter localhost base url on the backend application

* [Swagger](https://swagger.io) 
    - {{baseurl}}/documentation

* [Redoc](https://github.com/Redocly/redoc) 
    - {{baseurl}}/redocs

* [OpenAPI](https://www.openapis.org) 
    - {{baseurl}}/openapi.json


