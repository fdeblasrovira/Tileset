# docker db
docker volume create tileset-data

docker run --name tileset -e MYSQL_ROOT_PASSWORD=tileset -e TZ=Asia/Tokyo -v tileset-data:/var/lib/mysql -d -p 3308:3306 mysql:latest

# mysql
docker exec -it tileset bash

mysql -hlocalhost -u root -p

CREATE USER 'tileset'@'172.17.0.1' IDENTIFIED BY 'tileset';
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'tileset'@'172.17.0.1' WITH GRANT OPTION;
DROP USER 'tileset'@'127.0.0.1';
DROP USER 'tileset'@'localhost';

CREATE DATABASE tileset;

# curl
curl -X POST http://localhost:3000/login \
   -H "Content-Type: application/json" \
   -d '{"username": "tj", "password": "foobar"}'  
  
curl http://localhost:3000/logout
curl http://localhost:3000/restricted

# process
lsof -i tcp:3000
kill -9 1605

# s3
awslocal s3 ls --recursive s3://tileset-development-user-images
awslocal s3 rm --recursive s3://tileset-development-user-images