<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Features

- Light/dark mode
- Responsive
- Accessible
- With built-in Sidebar component
- Global Search Command
- 10+ pages
- Extra custom components

## Tech Stack

**UI:** [ShadcnUI](https://ui.shadcn.com) (TailwindCSS + RadixUI)

**Frontend:** [ReactJS](https://vite.dev/guide) (ReactJS + Typescript + Vite)

**Build Tool:** [Vite](https://vitejs.dev/)

**Routing:** [Laravel](https://laravel.com/docs/11.x/routing)

**Routing Management:** [Inertia](https://inertiajs.com/links)

**State Sharing:** [Inertia](https://inertiajs.com/)

**Type Checking:** [TypeScript](https://www.typescriptlang.org/)

**Formatting:** [Prettier](https://prettier.io/)

**Icons:** [Tabler Icons](https://tabler.io/icons)

## Run Locally

Clone the project

```bash
  git clone https://github.com/Hnzsama/Siakad-Web.git
```

Go to the project directory

```bash
  cd Siakad-Web
```

Install dependencies

```bash
  composer install && npm install
```

Build node dependencies

```bash
  npm run build
```

Copy .env from .env.example
```bash
  cp .env.example .env
```

Generate Application Key
```bash
  php artisan key:generate
```

Migrate database (default sqlite)
```bash
  php artisan migrate
```

Start the server

Development
```bash
  composer run dev
```

You need to run api host to use mobile App
You can change your host on composer.json
```bash
  composer run host
```

Staging: Run built resources.
```bash
  composer run host 
```

## Author

Crafted by [@hnzsama](https://github.com/Hnzsama)

## License

Licensed under the [MIT License](https://choosealicense.com/licenses/mit/)