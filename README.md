# Laravel 11.31 + InertiaJS 2.0 + React 19.0.0 + TailwindCSS 3.4.13 + TypeScript 5.7.3

# Getting Started

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

## Deploying to Vercel
Make sure to update SESSION_DRIVER to mongodb in the .env file.
```
SESSION_DRIVER=mongodb
```
