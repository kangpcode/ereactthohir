# EreactThohir Framework Documentation v1.5.0 🚀

Selamat datang di dokumentasi resmi **EreactThohir**, framework fullstack tingkat enterprise yang dirancang untuk kecepatan, keamanan, dan produktivitas maksimal. Terinspirasi oleh keanggunan Laravel, namun dibangun sepenuhnya dengan **TypeScript** dan **React**.

---

## 📑 Daftar Isi
1. [Filosofi & Arsitektur](#1-filosofi--arsitektur)
2. [Instalasi & Quick Start](#2-instalasi--quick-start)
3. [Struktur Proyek](#3-struktur-proyek)
4. [Routing & Middleware](#4-routing--middleware)
5. [Database: Schema, Models & Migrations](#5-database-schema-models--migrations)
6. [AI Ecosystem (Multi-Driver)](#6-ai-ecosystem-multi-driver)
7. [Payment Gateway Hub](#7-payment-gateway-hub)
8. [Rice UI & Frontend Components](#8-rice-ui--frontend-components)
9. [CLI Command & Generators](#9-cli-command--generators)
10. [Keamanan & Enkripsi](#10-keamanan--enkripsi)

---

## 1. Filosofi & Arsitektur
EreactThohir menggunakan pola **Provider-Based Architecture**. Setiap layanan inti terdaftar melalui `Service Provider` untuk memastikan aplikasi tetap modular dan mudah diuji.

- **Request Lifecycle**: Request -> Kernel -> Middlewares -> Router -> Controller -> Response.
- **Service Container**: Manajemen dependensi yang kuat memungkinkan Anda melakukan *binding* dan *resolution* layanan di mana pun.

---

## 2. Instalasi & Quick Start
Pastikan Anda memiliki **Node.js v20+** terinstal.

```bash
# Membuat proyek baru
npx @ereactthohir/create my-app

# Masuk ke direktori
cd my-app

# Generate kunci aplikasi (AES-256)
ereact key:generate

# Jalankan server pengembangan
ereact dev
```

---

## 3. Struktur Proyek
Proyek EreactThohir mengikuti standar industri yang rapi:
- `app/`: Logika bisnis (Controllers, Models, Services, Middlewares).
- `config/`: Semua konfigurasi aplikasi (database, ai, payment).
- `database/`: Migrations, Factories, dan Seeders.
- `resources/`: Asset frontend, Views (React Pages), dan Styles.
- `routes/`: Definisi routing (`web.ts` dan `api.ts`).

---

## 4. Routing & Middleware
Routing di EreactThohir sangat ekspresif dan mendukung middleware pipeline.

```typescript
import { Route } from '@ereactthohir/core';

// Route Dasar
Route.get('/', (req, res) => res.view('Welcome'));

// Route Group dengan Middleware
Route.group({ middleware: ['auth'] }, () => {
    Route.post('/dashboard', 'DashboardController@index');
});
```

---

## 5. Database: Schema, Models & Migrations
EreactThohir menyediakan ORM yang kuat dan sistem migrasi bergaya Laravel.

### Migrations
```bash
ereact make:migration create_products_table
```
```typescript
await Schema.create('products', (table) => {
    table.increments('id');
    table.string('name');
    table.decimal('price', 15, 2);
    table.timestamps();
});
```

### Enterprise CRUD Generator ⚡
Bangun fitur lengkap hanya dalam satu detik:
```bash
ereact make:crud Order
```
*Menciptakan: Model, Migration, Controller, Factory, dan Halaman React.*

---

## 6. AI Ecosystem (Multi-Driver)
Gunakan berbagai penyedia AI dengan satu antarmuka yang seragam.

### Driver yang Didukung:
- **OpenAI**: GPT-4o, GPT-3.5-Turbo.
- **Google Gemini**: Gemini 1.5 Pro/Flash.
- **Ollama**: AI lokal (Llama 3, Mistral, dll).

### Contoh Penggunaan:
```typescript
import { AI } from '@ereactthohir/core';

// Menggunakan Ollama untuk AI lokal yang gratis dan privat
const response = await AI.driver('ollama').generate('Jelaskan konsep Quantum Physics');
```

---

## 7. Payment Gateway Hub
Integrasi pembayaran tidak pernah semudah ini. Didesain khusus untuk pasar Indonesia dan Internasional.

### Provider Resmi:
- **Midtrans**: (Snap, Card, VA).
- **Duitku** & **Durianpay**: Populer di Indonesia.
- **Stripe**: Standar Global.

```typescript
const payment = await Payment.driver('midtrans').createTransaction({
    order_id: 'ORDER-101',
    gross_amount: 150000,
    customer_details: { name: 'Dhafa Nazula', email: 'kangpcode@example.com' }
});
```

---

## 8. Rice UI & Frontend Components
EreactThohir dilengkapi dengan **Rice UI**, library komponen React premium dengan estetika modern seperti Glassmorphism.

- **DashboardLayout**: Sidebar responsif, Navbar, dan area konten.
- **MetricCard**: Visualisasi KPI dengan tren (naik/turun).
- **ChatBox**: Komponen chat siap pakai untuk asisten AI.

---

## 9. CLI Command & Generators
Gunakan CLI `ereact` untuk mempercepat alur kerja Anda:

| Command | Deskripsi |
|---------|-----------|
| `make:controller` | Membuat controller baru |
| `make:model` | Membuat model database |
| `make:resource` | Membuat API Resource transformer |
| `make:ai-driver` | Membuat driver AI kustom |
| `make:payment-provider` | Membuat provider pembayaran baru |
| `migrate` | Menjalankan migrasi database |

---

## 10. Keamanan & Enkripsi
Kami menjaga keamanan data Anda dengan sangat serius.
- **Encryption**: Menggunakan `AES-256-CBC` untuk enkripsi data sensitif.
- **Hashing**: Menggunakan `Bcrypt` untuk keamanan password.
- **Sanitization**: Otomatis mencegah SQL Injection dan XSS.

---

## 📖 Bantuan Lebih Lanjut
Untuk pertanyaan lebih lanjut atau kolaborasi, silakan hubungi:
- **GitHub**: [KangPCode/EreactThohir](https://github.com/KangPCode/EreactThohir)
- **Creator**: Dhafa Nazula Permadi (KangPCode)

Dikembangkan dengan ❤️ untuk ekosistem pengembang Indonesia.
