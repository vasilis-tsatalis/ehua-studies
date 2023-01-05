# ehua-studies
HUA E-Studies Repository

### Run web server via Docker locally
----------------------------------
* config file
```bash
    cp .env.test .env
    cp ./frontend/.test.env ./frontend/.env
    cp ./admin_console/.test.env ./admin_console/.env
```

* docker start
```bash
    docker-compose build
```

* docker running
```bash
    docker-compose up
```

* docker end - remove
```bash
    docker-compose down
```

### Enter MongoDB container and create DB
----------------------------------
* mongodb shell
```bash
    docker exec -it ehua-studies-mongodb_container-1 mongosh -u "root" -p "rootpassword"
```
```bash
    show dbs
```
```bash
    use admin
```
``` mongo shell
    db.createUser({user: "hua_user", pwd: "hua_pass", roles:[{role:"dbOwner", db:"huadatabase"}]})
```
```bash
    use huadatabase
```
```bash
    db.createUser({user: "root", pwd: "rootpassword", roles:["dbOwner"]})
```
```bash
    db.feusers.find()
```

### MinIO Platform
----------------------------------
* Enter Minio with admin credentials
* Create new Access Key
* Create new Secret Key
* Copy these to .env parameters
