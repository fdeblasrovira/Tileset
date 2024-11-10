# docker
docker volume create tileset-data

docker run --name tileset -e MYSQL_ROOT_PASSWORD=tileset -v tileset-data:/var/lib/mysql -d mysql:latest

# mysql
docker exec -it tileset bash

mysql -u root -p

CREATE USER 'laravel'@'127.0.0.1' IDENTIFIED BY 'tileset';
CREATE USER 'laravel'@'localhost' IDENTIFIED BY 'tileset';
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'laravel'@'127.0.0.1' WITH GRANT OPTION;
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'laravel'@'localhost' WITH GRANT OPTION;
CREATE USER 'laravel'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tileset';
DROP USER 'laravel'@'localhost';

CREATE DATABASE tileset;

# curl
curl -X POST http://localhost:3000/login \
   -H "Content-Type: application/json" \
   -d '{"username": "tj", "password": "foobar"}'  
  
curl http://localhost:3000/logout
curl http://localhost:3000/restricted