# Laravel 11.31 + InertiaJS 2.0 + React 19.0.0 + TailwindCSS 3.4.13 + TypeScript 5.7.3 + Firebase + MongoDB + Sessions

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


## Firebase Domain Configuration

When using Firebase Authentication with email links, you need to configure authorized domains in Firebase. This allows specific domains to complete the sign-in process.

### Steps to Configure Domains

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** > **Settings**
4. Scroll to "Authorized domains" section
5. Click "Add domain"

### Domains to Whitelist

For a typical setup, you'll want to whitelist:

#### Development
- `localhost`
- `127.0.0.1`

#### Production
- `your-app.vercel.app`
- Any other domains your app uses

### Important Notes

- No code changes are needed - this is purely a Firebase Console configuration
- The authentication error occurs when domains aren't properly whitelisted
- Make sure to add all domains for each environment (development, staging, production)

# Generating Types for Models
To generate types for models, run the following command:
```
php artisan generate:types
```
