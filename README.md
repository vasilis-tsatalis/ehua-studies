# ehua-studies
HUA E-Studies Repository

#
Run web server via Docker locally
----------------------------------
** config file
```bash
cp .env.test .env
cp ./frontend/.test.env ./frontend/.env
cp ./admin_console/.test.env ./admin_console/.env
```

** docker start
```bash
docker-compose build
```

** docker running
```bash
docker-compose up
```

** docker end - remove
```bash
docker-compose down
```



** mongodb shell
```bash
docker exec -it ehua-studies-mongodb_container-1 mongosh -u "root" -p "rootpassword"
```
```bash
show dbs
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