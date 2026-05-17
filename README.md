# Anime Management API

REST API sederhana untuk manajemen Anime Management System.

## Features
- CRUD Anime
- CRUD Genres
- CRUD Users
- CRUD Reviews
- CRUD Watchlists
- Statistik data transaksional

## Tech Stack
- Node.js + Express
- MySQL
- Postman

## API Endpoints

### Anime
- GET /api/anime
- GET /api/anime/:id
- POST /api/anime
- PUT /api/anime/:id
- DELETE /api/anime/:id

### Genres
- GET /api/genres
- GET /api/genres/:id
- POST /api/genres
- PUT /api/genres/:id
- DELETE /api/genres/:id

### Users
- GET /api/users
- GET /api/users/:id
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id

### Reviews
- GET /api/reviews
- POST /api/reviews
- PUT /api/reviews/:id
- DELETE /api/reviews/:id

### Watchlists
- GET /api/watchlists
- GET /api/watchlists/user/:user_id
- POST /api/watchlists
- PUT /api/watchlists/:id
- DELETE /api/watchlists/:id

### Statistics
- GET /api/stats
- GET /api/stats/users/:user_id
- GET /api/stats/anime/:anime_id

## Documentation
Dokumentasi API tersedia pada folder:

```text
/docs/Anime_Management_API.postman_collection.json
## Cara Menjalankan

```bash
# Clone repository
git clone https://github.com/Maulanahadi-D/anime-management-api.git

# Masuk ke folder project
cd anime-management-api

# Install dependencies
npm install

# Setup .env file
cp .env.example .env

# Import database
mysql -u root -p anime_management < anime_management_backup.sql

# Jalankan server
npm start
