Shadowrun Fifth Battle Tracker
==============================

Features
--------

* Uses React

Installation
------------
```
npm install
node ./setup.js
```

Usage
-----
```
npm start
```

ENV vars
-------
```
BACKEND_URL: The full URL (including protocol and port) for the backend API.
HOST: The host where the front end code is being loaded.
PORT: The port where the front end code is being loaded.
```

Deploy using NGINX
------------------
This is an example bash script for deploying through Nginx.
```
echo 'Building...'
npm run build:only

echo 'Copying...'
cp -R /root/code/dist /var/www
sudo chown -R www-data:web /var/www
sudo chmod -R 755 /var/www

echo 'Restarting Server...'
service nginx restart
```
