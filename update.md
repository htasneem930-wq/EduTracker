# EduTrack — Full Project Code & Explanation

This document explains the EduTrack project (backend + frontend), includes links to every source file in the workspace, shows key code excerpts, explains what each file does (what/why/how), and describes the database schema and tables.

---

**How this document is structured**

- Project overview
- How to run (dev) — commands for backend and frontend
- Backend: file list, key code excerpts, and per-file explanation
- Frontend: file list, key code excerpts, and per-file explanation
- Database: schema, table fields, and how DB is used by the app
- Quick smoke-test steps

---

**Project root**

- Backend Spring Boot app: [Backend/edutrack](Backend/edutrack)
- Frontend React app (Vite): [Frontend/edutrack-ui](Frontend/edutrack-ui)


## How to run (development)

1. Start the database (MySQL) and ensure credentials match [Backend/edutrack/src/main/resources/application.properties](Backend/edutrack/src/main/resources/application.properties#L1-L40).
2. Start backend (port 8080):

```bash
cd Backend/edutrack
mvn spring-boot:run
```

3. Start frontend (port 5175):

```bash
cd Frontend/edutrack-ui
npm install   # first time only
npm run dev
```

The frontend dev server proxies `/api` to the backend (see [Frontend/edutrack-ui/vite.config.js](Frontend/edutrack-ui/vite.config.js#L1-L40)).

---

## Backend (Spring Boot)

Main package: `com.edutrack.edutrack` in [Backend/edutrack/src/main/java/com/edutrack/edutrack](Backend/edutrack/src/main/java/com/edutrack/edutrack)

Key files (linked):

- Application entry: [EdutrackApplication.java](Backend/edutrack/src/main/java/com/edutrack/edutrack/EdutrackApplication.java)
- Security config: [config/SecurityConfig.java](Backend/edutrack/src/main/java/com/edutrack/edutrack/config/SecurityConfig.java)
- Controllers:
  - [controller/AuthController.java](Backend/edutrack/src/main/java/com/edutrack/edutrack/controller/AuthController.java)
  - [controller/StudentController.java](Backend/edutrack/src/main/java/com/edutrack/edutrack/controller/StudentController.java)
  - [controller/TeacherController.java](Backend/edutrack/src/main/java/com/edutrack/edutrack/controller/TeacherController.java)
  - [controller/AttendanceController.java](Backend/edutrack/src/main/java/com/edutrack/edutrack/controller/AttendanceController.java)
  - [controller/PerformanceController.java](Backend/edutrack/src/main/java/com/edutrack/edutrack/controller/PerformanceController.java)
- Models (JPA entities):
  - [model/Users.java](Backend/edutrack/src/main/java/com/edutrack/edutrack/model/Users.java)
  - [model/Student.java](Backend/edutrack/src/main/java/com/edutrack/edutrack/model/Student.java)
  - [model/Teacher.java](Backend/edutrack/src/main/java/com/edutrack/edutrack/model/Teacher.java)
  - [model/Attendance.java](Backend/edutrack/src/main/java/com/edutrack/edutrack/model/Attendance.java)
  - [model/Performance.java](Backend/edutrack/src/main/java/com/edutrack/edutrack/model/Performance.java)
- Repositories:
  - [repository/UserRepository.java](Backend/edutrack/src/main/java/com/edutrack/edutrack/repository/UserRepository.java)
  - [repository/StudentRepository.java](Backend/edutrack/src/main/java/com/edutrack/edutrack/repository/StudentRepository.java)
  - [repository/TeacherRepository.java](Backend/edutrack/src/main/java/com/edutrack/edutrack/repository/TeacherRepository.java)
  - [repository/AttendanceRepository.java](Backend/edutrack/src/main/java/com/edutrack/edutrack/repository/AttendanceRepository.java)
  - [repository/PerformanceRepository.java](Backend/edutrack/src/main/java/com/edutrack/edutrack/repository/PerformanceRepository.java)
- Config & properties: [src/main/resources/application.properties](Backend/edutrack/src/main/resources/application.properties#L1-L40)
- Build: [pom.xml](Backend/edutrack/pom.xml)


### Key code excerpts and explanations

**SecurityConfig.java** — core auth configuration

```java
// Excerpt from SecurityConfig.java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/auth/signup").permitAll()
            .anyRequest().authenticated()
        )
        .httpBasic(Customizer.withDefaults());
    return http.build();
}
```

- What: Configures Spring Security to use HTTP Basic authentication and CORS rules.
- Why: The frontend sends Basic Authorization headers (base64 email:password) for signin, and the app expects Basic auth for protected endpoints.
- How it works: `httpBasic()` enables Spring Security's basic auth — when a request to a protected endpoint includes `Authorization: Basic <creds>`, Spring will authenticate using a `UserDetailsService`. The `userDetailsService()` bean loads users from DB via `UserRepository.findByEmail(...)`.
- Important: The controller's `/auth/signin` relies on Spring Security providing a `Principal` populated from Basic auth credentials.


**AuthController.java** — signup & signin endpoints (summary)

- `/auth/signup` (POST): accepts a `Users` JSON body; checks if user exists, encodes password with `BCryptPasswordEncoder`, creates associated `Student` if role is STUDENT, saves the `Users` entity, and returns user info and success status.
- `/auth/signin` (POST): uses `Principal` (set by Spring Security when Basic auth credentials are valid). If `principal` is null or user not found, returns 401. Otherwise returns user meta (id, email, name, role, studentId).

Why this pattern: The app uses Basic auth to authenticate each request. On signin the frontend sends Basic header and the backend verifies credentials; it returns user info to the client which the client caches in `localStorage` along with the base64 token used for subsequent requests.


**Users.java (model)** — user representation

- Fields: `id`, `email`, `password`, `name`, `role` (enum ADMIN/TEACHER/STUDENT), `studentId`, `isPasswordCustomized`.
- JPA annotations map the class to the `users` table. The `password` stores BCrypt-hashed password.

Why: Clear separation between student profile (`Student` entity) and authentication (`Users`). Students may be pre-created and then linked to a `Users` row via `studentId`.


**application.properties** (critical settings)

- `spring.datasource.url=jdbc:mysql://localhost:3306/edutrack_db`
- `spring.datasource.username=root`
- `spring.datasource.password=...`
- `spring.jpa.hibernate.ddl-auto=update`
- `server.port=8080`
- `server.servlet.context-path=/api`

What/Why: Defines DB connection and enables JPA auto-update of schema. The `context-path` means every REST route is served under `/api` (so `/api/auth/signup`).


**Repository interfaces**

- Repositories extend `JpaRepository<T, ID>` giving CRUD methods and support for query derivation (e.g., `findByEmail`). These are used in controllers and services for DB access.


## Frontend (React + Vite)

Project root: [Frontend/edutrack-ui](Frontend/edutrack-ui)

Key files (linked):

- [vite.config.js](Frontend/edutrack-ui/vite.config.js#L1-L40) — dev server, proxy to backend, port 5175
- [package.json](Frontend/edutrack-ui/package.json)
- API client: [src/api/axios.js](Frontend/edutrack-ui/src/api/axios.js)
- Auth utils: [src/utils/auth.js](Frontend/edutrack-ui/src/utils/auth.js)
- Pages (auth flows): [src/pages/LoginPage.jsx](Frontend/edutrack-ui/src/pages/LoginPage.jsx#L1-L400)
- App entry: [src/main.jsx](Frontend/edutrack-ui/src/main.jsx)
- App component: [src/App.jsx](Frontend/edutrack-ui/src/App.jsx)
- Pages for dashboards: [src/pages/AdminDashboard.jsx](Frontend/edutrack-ui/src/pages/AdminDashboard.jsx), [src/pages/TeacherDashboard.jsx](Frontend/edutrack-ui/src/pages/TeacherDashboard.jsx), [src/pages/StudentDashboard.jsx](Frontend/edutrack-ui/src/pages/StudentDashboard.jsx)


### Key frontend code and behavior

**src/api/axios.js** — axios client and Basic auth header injection

```js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Basic ${token}`;
  }
  return config;
});

export default api;
```

- What: Creates an axios instance that prefixes requests with `/api` (proxied to backend) and injects the `Authorization` header carrying the base64 token if present.
- Why: Keeps API calls centralized and ensures Basic auth header is attached to every request automatically.
- How: `localStorage.authToken` is set on successful signin/signup by `saveUserSession`.


**src/utils/auth.js** — session helpers

- `saveUserSession(userData, password)`: stores `userId`, `role`, `name`, `email`, and `authToken` (base64 of `email:password`) in `localStorage`.
- `getUserSession()`, `clearUserSession()`, `isAuthenticated()` helpers are used across components to check auth state and route accordingly.

Why Basic: The project uses Basic auth for simplicity — the client stores the base64 string and axios sends it on each request. This is simple but has security tradeoffs: do not use in production without HTTPS and token-rotation. The backend stores only bcrypt-hashed passwords.


**src/pages/LoginPage.jsx** — signup/signin UI and API calls

- SignUp: posts to `/auth/signup` with `{name, email, password, role}`. On success, shows message and switches to login.
- SignIn: creates base64 header from provided credentials, posts to `/auth/signin` sending an empty body but with `Authorization: Basic <b64>` header. On success, saves session (including the password-based token) and redirects to the appropriate dashboard.

Why it works with backend: Backend expects Basic auth for signin. The frontend takes user input password (plaintext) and builds the Basic header; the backend checks credentials (via `UserDetailsService` and bcrypt) and returns user info.


### Vite proxy and ports

- [vite.config.js](Frontend/edutrack-ui/vite.config.js#L1-L40) sets `server.proxy['/api']` to `http://localhost:8080` and `server.port` is set to `5175` so development runs on `http://localhost:5175/`.
- CORS: Backend must allow origin `http://localhost:5175` (updated in SecurityConfig). Frontend's axios baseURL `/api` routes requests through Vite proxy.


## Database schema and explanation

Main entities (tables) based on JPA models in `model/`:

1. `users` (from `Users.java`)
   - id INT PRIMARY KEY AUTO_INCREMENT
   - email VARCHAR(...) UNIQUE NOT NULL
   - password VARCHAR(...) NOT NULL (BCrypt hash)
   - name VARCHAR(...) NOT NULL
   - role ENUM('ADMIN','TEACHER','STUDENT') NOT NULL
   - student_id INT NULL (references students.id)
   - is_password_customized BOOLEAN DEFAULT FALSE

2. `student` (from `Student.java`)
   - id INT PRIMARY KEY AUTO_INCREMENT
   - name VARCHAR
   - email VARCHAR UNIQUE
   - other student-specific fields (if present)

3. `teacher` (from `Teacher.java`)
   - id, name, email, etc.

4. `attendance` (from `Attendance.java`)
   - id INT
   - student_id INT (FK)
   - date DATE/TIMESTAMP
   - present BOOLEAN or status

5. `performance` (from `Performance.java`)
   - id INT
   - student_id INT (FK)
   - subject VARCHAR
   - score/grade fields

How DB is used

- On signup for STUDENT role, app either associates an existing `Student` record by email or creates a new `Student` record, then sets `users.studentId` to point to that student.
- Authentication checks `users.email` + password (compares bcrypt hash in DB) via the `UserDetailsService` which wraps the `Users` entity into a Spring Security `User` object.
- Repositories provide CRUD for controllers to create/read attendance and performance records.


## Security considerations (summary)

- The app uses HTTP Basic authentication in dev. This places responsibility on the transport (HTTPS) and secure storage of credentials.
- Passwords in DB are BCrypt-hashed — good practice.
- Frontend stores base64(email:password) in `localStorage` — acceptable for simple dev setups, but for production consider JWTs, refresh tokens, or session cookies with Secure/HttpOnly flags.
- CORS config has been updated to allow `http://localhost:5175` and permit the `Authorization` header so the client can send Basic auth headers.


## Quick smoke-test (manual)

1. Open frontend at: http://localhost:5175
2. Create an account (Sign Up) — pick role STUDENT or TEACHER or ADMIN
3. Sign In with same credentials — should redirect to the appropriate dashboard.
4. Server logs: backend receives POST `/api/auth/signup` and `/api/auth/signin` (look for logs from `spring.jpa.show-sql=true` and controller responses).

If signin fails with `401`:
- Confirm DB contains the user and `users.password` is stored as a BCrypt hash.
- Confirm frontend sends `Authorization: Basic <base64>` header — the network tab or Vite console will show proxied requests.
- Confirm `application.properties` `server.servlet.context-path=/api` (frontend uses `/api/auth/...`).


## Where to find full source code

All backend and frontend source files are present in the workspace. Use these links to open files in the editor:

- Backend main: [Backend/edutrack/src/main/java/com/edutrack/edutrack](Backend/edutrack/src/main/java/com/edutrack/edutrack)
- Backend resources: [Backend/edutrack/src/main/resources/application.properties](Backend/edutrack/src/main/resources/application.properties#L1-L40)
- Backend build: [Backend/edutrack/pom.xml](Backend/edutrack/pom.xml)
- Frontend main: [Frontend/edutrack-ui/src](Frontend/edutrack-ui/src)
- Frontend config: [Frontend/edutrack-ui/vite.config.js](Frontend/edutrack-ui/vite.config.js#L1-L40)


---
