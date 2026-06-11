# IA2 - API REST de Cerveses i Vins 🍻🍷

Aquest projecte és una API REST desenvolupada amb **Node.js**, **Express** i **MongoDB** (a través de **Mongoose**), dissenyada per a l'avaluació de la unitat **IA2 - Kates NodeJS**. 

Compta amb operacions CRUD completes per a cerveses i vins, autenticació mitjançant **JSON Web Tokens (JWT)**, control d'accés basat en rols (**usuari** i **admin**), pujada d'imatges amb **Multer**, documentació de proves manuals amb `api.http` i un complet joc de proves automatitzades escrit amb **Jest** i **Supertest**.

---

## 🛠️ Tecnologies Utilitzades

*   **Entorn de desenvolupament**: Node.js (ES Modules - `type: module`)
*   **Framework Web**: Express.js
*   **Base de Dades**: MongoDB Atlas & Mongoose
*   **Autenticació**: JSON Web Tokens (JWT) & bcryptjs
*   **Gestió de Fitxers**: Multer (emmagatzematge local a la carpeta `uploads/`)
*   **Proves Automatitzades**: Jest & Supertest
*   **Eines addicionals**: Nodemon (desenvolupament actiu), Dotenv (variables d'entorn)

---

## 📁 Estructura del Projecte

```text
IA2-KatesNodeJS/
├── __tests__/              # Proves automatitzades
│   └── api.test.js
├── src/
│   ├── config/             # Configuracions (Base de dades, Multer)
│   │   ├── db.js
│   │   └── multer.js
│   ├── controllers/        # Controladors de la lògica de negoci
│   │   ├── authController.js
│   │   ├── cervezasController.js
│   │   └── vinosController.js
│   ├── middlewares/        # Middlewares (Autenticació, Rols)
│   │   └── authMiddleware.js
│   ├── models/             # Esquemes de Mongoose (MongoDB)
│   │   ├── Cervesa.js
│   │   ├── Usuario.js
│   │   └── Vino.js
│   ├── routes/             # Rutes de l'API
│   │   ├── authRoutes.js
│   │   ├── cervezasRoutes.js
│   │   └── vinosRoutes.js
│   ├── scripts/            # Scripts de suport (Seeding d'Admin)
│   │   └── seedAdmin.js
│   ├── app.js              # Configuració i muntatge d'Express
│   └── index.js            # Punt d'entrada del Servidor
├── uploads/                # Directori local on es guarden les imatges pujades
├── .env                    # Variables d'entorn de desenvolupament (ignorat per Git)
├── .env.test               # Variables d'entorn per a tests (ignorat per Git)
├── .gitignore              # Fitxers a ignorar per Git
├── api.http                # Fitxer de proves manuals del REST Client
├── jest.config.js          # Configuració de Jest
└── package.json            # Scripts i dependències del projecte
```

---

## ⚙️ Configuració de l'Entorn

Crea un fitxer anomenat `.env` a l'arrel de la carpeta del projecte i configura les variables següents:

```env
PORT=3000
MONGODB_URI=tu_cadena_de_connexió_de_mongodb_atlas
JWT_SECRET=la_teva_clau_secreta_super_segura_jwt
```

Per a executar les proves, pots configurar un entorn separat a `.env.test`:

```env
PORT=3001
MONGODB_URI_TEST=tu_cadena_de_connexió_de_la_bd_de_proves
JWT_SECRET=clau_secreta_de_tests_12345
```

---

## 🚀 Instruccions de Desenvolupament i Execució

### 1. Instal·lació de dependències
Executa la següent comanda per a descarregar tots els paquets necessaris:
```bash
npm install
```

### 2. Poblar la base de dades amb l'usuari Administrador per defecte
Hem preparat un script de *seeding* per tal que puguis crear ràpidament un compte administratiu i així provar els permisos restrictius (`POST`, `PUT`, `DELETE` i pujada d'imatges):
```bash
npm run seed
```
Això crearà l'usuari:
*   **Email**: `admin@api.com`
*   **Contrasenya**: `adminpassword123`
*   **Rol**: `admin`

### 3. Executar en mode desenvolupament (amb recàrrega automàtica via Nodemon)
```bash
npm run dev
```
El servidor s'aixecarà a `http://localhost:3000`.

### 4. Executar el banc de proves automatitzat (Jest + Supertest)
```bash
npm test
```
Aquest script utilitza `--experimental-vm-modules` per a donar suport complet a ES Modules de manera nativa.

---

## 📡 Endpoints de l'API

Tots els camins estan prefixats per la ruta del servidor (per defecte: `http://localhost:3000`).

| Mètode | Ruta | Requereix Token? | Rol admès | Descripció |
| :--- | :--- | :---: | :---: | :--- |
| **GET** | `/api` | ❌ No | Tothom | Llista detallada d'endpoints del servidor |
| **GET** | `/health` | ❌ No | Tothom | Health check de l'API (retorna `{ "estat": "ok" }`) |
| **POST** | `/api/auth/registro` | ❌ No | Tothom | Registra un usuari nou (per defecte: rol 'usuari') |
| **POST** | `/api/auth/login` | ❌ No | Tothom | Valida les credencials i retorna el token JWT |
| **PUT** | `/api/auth/perfil` |  Sí | `usuari` \| `admin` | Actualitza el correu i/o contrasenya de l'usuari |
| **GET** | `/api/cervezas` |  Sí | `usuari` \| `admin` | Retorna la llista de cerveses en format `{ dades: [...], total: N }` |
| **GET** | `/api/cervezas/:id` |  Sí | `usuari` \| `admin` | Retorna una cervesa pel seu ID. 404 si no existeix |
| **POST** | `/api/cervezas` |  Sí | `admin` | Crea una nova cervesa. Retorna 201 i el document creat |
| **PUT** | `/api/cervezas/:id` |  Sí | `admin` | Actualitza la informació d'una cervesa |
| **DELETE** | `/api/cervezas/:id` |  Sí | `admin` | Esborra una cervesa. Retorna codi 204 |
| **PATCH**| `/api/cervezas/:id/imatge` |  Sí | `admin` | Puja una imatge en format multipart i l'enllaça a la cervesa |
| **GET** | `/uploads/:filename` | ❌ No | Tothom | Accés públic a les imatges pujades |
| **GET** | `/api/vinos` |  Sí | `usuari` \| `admin` | Retorna la llista de vins en format `{ dades: [...], total: N }` |
| **GET** | `/api/vinos/:id` |  Sí | `usuari` \| `admin` | Retorna un vi pel seu ID. 404 si no existeix |
| **POST** | `/api/vinos` |  Sí | `admin` | Crea un nou vi. Retorna 201 i el document creat |
| **PUT** | `/api/vinos/:id` |  Sí | `admin` | Actualitza la informació d'un vi |
| **DELETE** | `/api/vinos/:id` |  Sí | `admin` | Esborra un vi. Retorna codi 204 |

---

## 📝 Com Provar Manualment (`api.http`)

Si utilitzes l'extensió **REST Client** de VS Code:
1. Obre el fitxer `api.http` que es troba a l'arrel de l'espai de treball.
2. Inicia el servidor de desenvolupament (`npm run dev`).
3. Fes clic a **Send Request** a sobre de cadascuna de les peticions en l'ordre documentat dins del propi fitxer. 
4. L'extensió capturarà els tokens JWT automàticament i els propagarà a les rutes de prova corresponents gràcies a les variables dinàmiques (`@userToken` i `@adminToken`).

---

## 🌐 Guia de Desplegament de Bases de Dades

A continuació s'explica com configurar i desplegar la teva base de dades tant en **MongoDB Atlas** (per a aquest projecte) com en **Neon** (si decideixes migrar a una arquitectura PostgreSQL relacional).

### 🍃 Desplegar a MongoDB Atlas (Base de dades d'aquest projecte)

1. **Crear un compte**: Registra't de manera gratuïta a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. **Crear un clúster**: Genera un clúster gratuït (Shared M0) seleccionant el teu proveïdor de núvol favorit i la regió més propera.
3. **Configurar la seguretat**:
    *   **Accés de xarxa (IP Access List)**: Afegeix `0.0.0.0/0` per a permetre connexions des de qualsevol lloc (essencial si el projecte es desplegarà en servidors de núvol com Render, Railway o Vercel).
    *   **Usuaris de la base de dades**: Crea un usuari amb permisos de lectura i escriptura (`dbAdmin` / `Read and write to any database`). Anota bé la contrasenya.
4. **Obtenir la cadena de connexió**:
    *   Fes clic a **Connect** en el teu clúster.
    *   Tria **Drivers** (Node.js).
    *   Copia l'enllaç de connexió semblant a:
        `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/api_cervezas?retryWrites=true&w=majority`
5. **Afegir-lo al servidor**: Substitueix el valor de `MONGODB_URI` en el teu fitxer `.env` de producció amb aquesta URI.

---

### 🐘 Desplegar en Neon (PostgreSQL Serverless)

Si en el futur vols desplegar o migrar aquest projecte a una base de dades relacional SQL (PostgreSQL), la plataforma de referència és **Neon**.

#### 1. Què és Neon?
[Neon](https://neon.tech/) és una base de dades PostgreSQL serverless, de codi obert i totalment gestionada, dissenyada per a escalar instantàniament a zero quan no rep trànsit, oferint característiques úniques com el *branching* de base de dades (molt similar a les branques de Git).

#### 2. Com crear una base de dades a Neon
1. Entra a [neon.tech](https://neon.tech/) i registra't.
2. Fes clic a **Create Project**.
3. Posa un nom al teu projecte i selecciona la versió de PostgreSQL i la regió de desplegament.
4. A la següent pantalla rebràs la teva cadena de connexió (**Connection String**). Semblarà una cosa així:
   `postgres://alex:abcd1234@ep-cool-flower-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`
5. Guarda aquesta cadena a les teves variables d'entorn del fitxer `.env` (per exemple, `DATABASE_URL`).

#### 3. Com utilitzar Neon PostgreSQL en una aplicació Express de Node.js

Per connectar el servidor Node.js al teu clúster de Neon, tens dues opcions principals:

##### Opció A: Utilitzant el controlador oficial `pg` (ideal per consultes SQL directes)
1. Instal·la la dependència al projecte:
   ```bash
   npm install pg
   ```
2. Crea el fitxer de connexió (ex: `src/config/pgDb.js`):
   ```javascript
   import pg from 'pg';
   const { Pool } = pg;

   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: {
       rejectUnauthorized: false // Requerit per a les connexions segures de Neon
     }
   });

   export const query = (text, params) => pool.query(text, params);
   ```
3. Fes consultes a la base de dades dins dels teus controladors:
   ```javascript
   import { query } from '../config/pgDb.js';

   export const listCervezasSQL = async (req, res) => {
     try {
       const result = await query('SELECT * FROM cervezas');
       res.status(200).json({
         dades: result.rows,
         total: result.rowCount
       });
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   };
   ```

##### Opció B: Utilitzant Prisma ORM (mètode modern recomanat)
1. Inicialitza Prisma al projecte:
   ```bash
   npm install @prisma/client
   npm install -D prisma
   npx prisma init
   ```
2. Modifica el fitxer `prisma/schema.prisma` per indicar que fas servir Postgres:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   generator client {
     provider = "prisma-client-js"
   }

   model Cervesa {
     id        Int      @id @default(autoincrement())
     nom       String
     graduacio Float
     tipus     String
     imatge    String?
     createdAt DateTime @default(now())
   }
   ```
3. Executa la migració perquè Prisma generi les taules al teu Neon:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Utilitza Prisma Client en els teus controladors:
   ```javascript
   import { PrismaClient } from '@prisma/client';
   const prisma = new PrismaClient();

   export const listCervezasPrisma = async (req, res) => {
     try {
       const cerveses = await prisma.cervesa.findMany();
       res.status(200).json({
         dades: cerveses,
         total: cerveses.length
       });
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   };
   ```
