# Anime Management API

RESTful API untuk sistem manajemen anime dengan fitur CRUD data master, transaksional, dan statistik.

## Tech Stack
- Node.js + Express
- MySQL
- Joi (Validation)

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
