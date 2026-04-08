# Website Crawler Application

Aplikasi web crawler yang dibangun dengan **Express.js**, **Puppeteer**, dan **Swagger** untuk proses assignment test di **cmlabs.co**. Aplikasi ini dirancang untuk mengekstrak konten HTML dan aset-aset dari website secara otomatis.

## 📋 Daftar Isi

- [Deskripsi](#deskripsi)
- [Fitur Utama](#fitur-utama)
- [Requirements](#requirements)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Melihat Hasil Crawling](#-melihat-hasil-crawling)
- [Dokumentasi API](#dokumentasi-api)
- [Struktur Folder](#struktur-folder)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

---

## 🎯 Deskripsi

Aplikasi ini adalah website crawler yang memungkinkan pengguna untuk melakukan crawling pada website tertentu dan menyimpan hasil crawling dalam format HTML beserta semua aset-aset yang diperlukan (CSS, JavaScript, gambar, dll). Aplikasi ini menggunakan **Puppeteer** untuk browser automation dan **Express.js** sebagai framework server.

Aplikasi juga dilengkapi dengan fitur proxy image yang mendukung format Next.js (`_next/image`), sehingga memudahkan untuk melakukan testing terhadap website yang menggunakan Next.js.

---

## ✨ Fitur Utama

- **Web Crawler**: Mengekstrak konten HTML dan aset dari website target
- **Browser Automation**: Menggunakan Puppeteer untuk rendering dinamis
- **Image Proxy**: Mendukung proxy image termasuk Next.js format (`_next/image`)
- **REST API**: Dokumentasi API lengkap dengan Swagger
- **Session Management**: Manajemen sesi pengguna dengan Express Session
- **Database Support**: Integrasi MySQL dengan Sequelize ORM
- **Image Processing**: Optimasi gambar dengan Sharp
- **Data Export**: Export data ke file Excel dengan ExcelJS
- **Scheduled Tasks**: Cron job scheduling dengan node-cron
- **CORS Support**: Konfigurasi CORS untuk multi-origin requests
- **Docker Support**: Containerized application dengan Dockerfile
- **Input Validation**: Validasi input dengan express-validator
- **JWT Authentication**: Token-based authentication dengan JWT

---

## 📦 Requirements

Sebelum menjalankan aplikasi, pastikan Anda telah menginstal:

- **Node.js** v14 atau lebih tinggi
- **npm** atau **yarn**
- **MySQL** v5.7 atau lebih tinggi
- **Docker** (opsional, jika ingin menjalankan dengan Docker)

---

## 🚀 Instalasi

### 1. Clone atau Download Repository

```bash
cd d:\PROJECT\NODEJS\Crawler
```

### 2. Install Dependencies

```bash
npm install
```

Dependencies utama yang akan diinstal:

- `express`: Web framework
- `puppeteer`: Browser automation
- `swagger-ui-express`: UI untuk dokumentasi API
- `mysql2`: MySQL client
- `sequelize`: ORM untuk database
- `dotenv`: Environment variable management
- `axios`: HTTP client
- `sharp`: Image processing
- `exceljs`: Excel file generation
- Dan package lainnya (lihat `package.json`)

### 3. Setup Environment Variables

Buat file `.env` di root direktori aplikasi:

```env
# Server Configuration
NODE_ENV=development
PORT=3033
SESSION_SECRET=OutletTacob4

# Database Configuration
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=amra_db
DB_HOST=localhost
DB_DIALECT=mysql

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=7d

# Crawler Configuration
CRAWLER_TIMEOUT=30000
CRAWLER_HEADLESS=true
```

### 4. Setup Database

Buat database MySQL sesuai konfigurasi di `.env`:

```sql
CREATE DATABASE amra_db;
USE amra_db;
```

Jalankan migrasi Sequelize (jika ada):

```bash
npx sequelize-cli db:migrate
```

---

## ⚙️ Konfigurasi

### Konfigurasi Database

Edit file `config/config.json` untuk menyesuaikan koneksi database:

```json
{
  "development": {
    "username": "root",
    "password": "",
    "database": "amra_db",
    "host": "localhost",
    "dialect": "mysql"
  },
  "production": {
    "username": "amra_user",
    "password": "amra_password",
    "database": "amra_db",
    "host": "mysql",
    "dialect": "mysql"
  }
}
```

### Konfigurasi CORS

Edit file `app.js` untuk mengatur allowed origins:

```javascript
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3033",
  // Tambahkan origin lain di sini
];
```

### Konfigurasi Swagger

Dokumentasi API Swagger dikonfigurasi di file `swagger.js`. API endpoints didefinisikan menggunakan JSDoc comments di file router.

---

## ▶️ Menjalankan Aplikasi

### Mode Development (dengan Hot Reload)

```bash
npm start
```

Aplikasi akan berjalan di `http://localhost:3033` dan akan otomatis di-reload jika ada perubahan file.

### Mode Production

```bash
NODE_ENV=production node app.js
```

### Menjalankan dengan Docker

```bash
docker build -t crawler-app .
docker run -p 3033:3033 --env-file .env crawler-app
```

### Menjalankan Tests

```bash
npm test
```

---

## �️ Melihat Hasil Crawling

Setelah menjalankan proses crawling, Anda dapat melihat hasil-hasil yang telah di-crawl dengan cara:

### 1. Akses Hasil Crawling via Browser

Hasil crawling dapat diakses langsung melalui browser di folder `results/`:

```
http://localhost:3033/index.html
```

Semua file HTML dan aset yang berhasil di-crawl akan disimpan dan dapat diakses melalui URL di atas.

### 2. Folder Hasil Crawling

**Struktur folder `results/`:**

- Menyimpan semua file HTML dan aset yang di-crawl (CSS, JavaScript, gambar, dll)
- Setiap crawl akan membuat struktur folder sesuai dengan structure website original

**Contoh akses file:**

```
http://localhost:3033/assets/styles/main.css
http://localhost:3033/blog/article-title/index.html
http://localhost:3033/avatar/user-profile.png
```

### 3. Folder Referensi Crawling (html/)

Folder `html/` menyimpan contoh-contoh website yang sudah pernah di-crawl sebelumnya:

- **`html/www.cmlabs.co/`** - Hasil crawl dari website cmlabs.co
- **`html/www.sequence.day/`** - Hasil crawl dari website sequence.day

Folder ini berfungsi sebagai referensi dan dokumentasi hasil crawling sebelumnya. Anda dapat membandingkan struktur folder dengan folder `results/` untuk memahami bagaimana output crawling diorganisir.

### 4. Mengakses Folder Results

Untuk melihat struktur lengkap hasil crawling:

```bash
# Pada Windows
explorer results/

# Pada macOS
open results/

# Pada Linux
nautilus results/
```

**Catatan:** Folder `results/` akan secara otomatis dibuat oleh aplikasi ketika proses crawling pertama kali dijalankan.

---

## �📚 Dokumentasi API

Dokumentasi API lengkap dapat diakses melalui Swagger UI setelah aplikasi berjalan:

### Akses Swagger Documentation

Buka browser dan akses Swagger UI di:

```
http://localhost:3033/docs
```

Di halaman ini Anda dapat melihat semua endpoint API yang tersedia dan mencoba endpoint langsung dari Swagger UI.

### Endpoint Utama

#### 1. Crawl Website

```
GET /crawl?url=https://cmlabs.co
```

**Parameters:**

- `url` (required, string): URL website yang akan di-crawl
  - Contoh: `https://cmlabs.co`

**Response:**

```json
{
  "folder": "results",
  "file": "index.html",
  "message": "Crawl berhasil dilakukan"
}
```

#### 2. Image Proxy

```
GET /_next/image?url=https://example.com/image.png&w=300&q=75
```

**Parameters:**

- `url` (required, string): URL gambar yang akan di-proxy
- `w` (optional, number): Lebar gambar dalam pixel
- `q` (optional, number): Kualitas gambar (0-100)

**Response:**

- Binary image data dengan Content-Type sesuai format gambar

---

## 📁 Struktur Folder

```
Crawler/
├── app.js                 # File utama aplikasi Express
├── swagger.js             # Konfigurasi Swagger
├── package.json           # Dependencies dan scripts
├── Dockerfile             # Konfigurasi Docker
├── README.md              # Dokumentasi (file ini)
│
├── config/
│   ├── config.js          # Konfigurasi aplikasi
│   └── config.json        # Konfigurasi database
│
├── router/
│   └── router_main.js     # Main routes dan endpoints
│
├── modules/main/
│   ├── controllers/       # Controller logic
│   └── models/            # Database models (Sequelize)
│
├── helper/
│   ├── crawlerHelper.js   # Helper functions untuk crawler
│   └── handleError.js     # Error handling utility
│
├── middleware/            # Custom middleware
│
├── validation/            # Input validation rules
│
├── html/                  # Menyimpan HTML file yang di-crawl
│   ├── www.cmlabs.co/     # Hasil crawl cmlabs.co
│   └── www.sequence.day/  # Hasil crawl sequence.day
│
├── results/               # Output crawl results
│   ├── assets/
│   ├── avatar/
│   ├── blog/
│   ├── css/
│   ├── detail/
│   └── ...
│
├── library/               # Shared libraries dan utilities
│
└── cmlabs.co/             # Dokumentasi project cmlabs.co
    └── README.md
```

---

## 🛠️ Teknologi yang Digunakan

### Backend Framework

- **Express.js** - Web framework untuk Node.js
- **Node.js** - JavaScript runtime

### Web Scraping & Automation

- **Puppeteer** - Headless browser automation
- **Axios** - HTTP client untuk requests

### Database & ORM

- **MySQL** - Database management system
- **Sequelize** - ORM untuk Node.js
- **sequelize-cli** - CLI tool untuk Sequelize

### API & Documentation

- **Swagger/OpenAPI** - API documentation
- **swagger-jsdoc** - Generate OpenAPI specs from comments
- **swagger-ui-express** - UI untuk dokumentasi API

### Authentication & Security

- **JWT (jsonwebtoken)** - Token-based authentication
- **bcrypt** - Password hashing
- **crypto-js** - Enkripsi data

### Middle-ware & Utilities

- **express-session** - Session management
- **cookie-parser** - Parse cookie header
- **cors** - CORS middleware
- **express-validator** - Input validation
- **dotenv** - Environment variables management
- **multer** - File upload handling

### Data Processing & Export

- **ExcelJS** - Create/read Excel files
- **Sharp** - Image processing dan optimization
- **striptags** - HTML tag removal
- **moment.js** - Date/time manipulation
- **currency.js** - Currency calculation

### Utilities

- **node-cron** - Cron job scheduling
- **nodemon** - Auto-restart development server

### Testing

- **Jest** - Testing framework
- **supertest** - HTTP assertion library

---

## 📝 Catatan Penting

1. **Hasil Crawling**: Output dari crawl disimpan di folder `results/` dan `html/`
2. **Session Management**: Aplikasi menggunakan Express Session dengan nama `craw_sessid`
3. **CORS Configuration**: Di development environment, CORS diizinkan dari semua origin
4. **Nodemon Configuration**: Folder `results/` tidak di-monitor untuk auto-restart
5. **Database Connection**: Pastikan MySQL service berjalan sebelum menjalankan aplikasi

---

## 🤝 Kontribusi

Kontribusi dari pengembang lain sangat diterima. Untuk berkontribusi:

1. Fork repository ini
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi **MIT** - lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.

---

## 👤 Author

**Muammar Kadafi**

---

## 📧 Support

Jika ada pertanyaan atau kendala, silakan buat issue di repository ini atau hubungi tim development.

---

**Last Updated**: April 2026
