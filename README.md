# 🛒 BGMarket — Sistema de Inventario Full Stack

**BGMarket** es una aplicación web full stack para gestionar productos, lotes, movimientos de inventario, usuarios y más, desarrollada con **.NET Core** para el backend y **React** para el frontend.

---

##  Tecnologías utilizadas

### Backend
-  ASP.NET Core Web API
-  Entity Framework Core (EF Core)
-  JWT Authentication + Roles
-  Swagger (OpenAPI)
-  Serilog (Logs)
-  SQL Server

### Frontend
-  React + Vite
-  Axios
-  React Router DOM
-  TailwindCSS (o Bootstrap)
-  Gestión de sesión con JWT

---

##  Estructura del Proyecto

```
bgmarket/
├── bgmarketAPI/         # Backend ASP.NET Core
├── bgmarketDB/          # Modelos y DbContext
├── frontend/            # Frontend React
├── bgmarketAPI.sln      # Solución principal
├── .gitignore
└── README.md
```

---

##  Cómo ejecutar el proyecto

###  Backend (.NET Core)

1. Abre el proyecto `bgmarketAPI.sln` en Visual Studio
2. Asegúrate de tener SQL Server configurado y cambia tu `appsettings.json` si es necesario
3. Ejecuta migraciones (si no están aplicadas):

```bash
dotnet ef database update
```

4. Corre el backend:

```bash
dotnet run --project bgmarketAPI
```


---

###  Frontend (React)

1. Ve a la carpeta `frontend/`:

```bash
cd frontend
```

2. Instala dependencias:

```bash
npm install
```

3. Crea un archivo `.env` con la URL del backend:

```bash
echo VITE_API_URL=https://localhost:44397/api > .env
```

4. Ejecuta la app:

```bash
npm run dev
```


---

##  Funcionalidades principales

- [x] Login seguro con JWT
- [x] Control de acceso por rol (`Admin`)
- [x] CRUD de usuarios, categorías, productos, lotes y movimientos
- [x] Registro de logs del sistema con IP y acción
- [x] Validaciones contra duplicados (producto, lote, categoría, usuario)
- [x] Documentación automática con Swagger
- [x] API RESTful con respuesta estructurada

---

##  Documentación de la API

Disponible automáticamente en Swagger UI

---

##  Decisiones técnicas

- Se utilizó **LogHelper** para centralizar la trazabilidad
- Se optimizaron consultas con `.Include(...)` en EF Core
- Se validaron entidades únicas por campos clave (como código de producto y número de lote)
- Se dividieron los proyectos (`bgmarketAPI` y `bgmarketDB`) para mejorar el desacoplamiento

---

##  Accesos de prueba

| Usuario      | Rol   | Contraseña |
|--------------|-------|------------|
| `admin2`      | Admin | `admin123` |

> Puedes registrar más usuarios desde el endpoint `POST /api/usuario`

---

##  Contribuir

1. Haz un fork del repositorio
2. Crea una rama: `git checkout -b nueva-funcionalidad`
3. Haz tus cambios y commits
4. Abre un Pull Request

---

##  Autor

**[Jared Castillo Chiang]**  
Desarrollador Full Stack  

---


