## Install PHP

### macOS
```
/bin/bash -c "$(curl -fsSL https://php.new/install/mac/8.4)"
```

### Windows
#### Run as administrator...
```
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows/8.4'))
```

## Install Composer
```
composer global require laravel/installer
```

### Install NVM and NodeJS (do this yourself)

## Inside the project directory...
### Install Composer Dependencies
```
composer install
``` 

### Install NPM Dependencies
```
npm install
```

## Starting the App
Server
```
php artisan serve
```
Client
```
npm run dev
```