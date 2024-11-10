# docker
docker volume create tileset-data

docker run --name tileset -e MYSQL_ROOT_PASSWORD=tileset -v tileset-data:/var/lib/mysql -d -p 3308:3306 mysql:latest

# mysql
docker exec -it tileset bash

mysql -u root -p

CREATE USER 'tileset'@'172.17.0.1' IDENTIFIED BY 'tileset';
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'tileset'@'172.17.0.1' WITH GRANT OPTION;
CREATE USER 'laravel'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tileset';
DROP USER 'tileset'@'127.0.0.1';
DROP USER 'tileset'@'localhost';

CREATE DATABASE tileset;

# curl
curl -X POST http://localhost:3000/login \
   -H "Content-Type: application/json" \
   -d '{"username": "tj", "password": "foobar"}'  
  
curl http://localhost:3000/logout
curl http://localhost:3000/restricted