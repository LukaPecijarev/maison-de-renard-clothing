# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout — read this first

This repo contains **duplicate/stale copies** of both projects, left over from past reorganizations. Only these two directories are the live, active code:

- `Backend/` — Spring Boot API (package `com.example.maisonderenard`)
- `frontend/` — Create React App client

The following directories are old snapshots accidentally committed to git. **Do not edit them** — changes there will not affect the running app and will not match the active code (verified: e.g. `Backend/Maison de Renard/` is missing `ChatController`, `SoldProduct`, and other current classes):

- `Backend/Maison de Renard/`
- `frontend/AppFrontend/`
- `frontend/TimskiBackend/`
- `frontend/backend/`

If asked to find "the backend" or "the frontend", it's the top-level `Backend/` and `frontend/` — never the nested lookalikes.

## Commands

### Backend (`Backend/`, run from that directory)
```
./mvnw spring-boot:run     # run the API on :8080 (Windows: mvnw.cmd)
./mvnw test                # run tests
./mvnw test -Dtest=ClassName#methodName   # run a single test
./mvnw package             # build jar
```
Requires a local PostgreSQL instance matching `src/main/resources/application.properties` (`spring.datasource.*`). There is currently only one test in the repo (`MaisonDeRenardApplicationTests`, a context-load smoke test).

### Frontend (`frontend/`, run from that directory)
```
npm start                  # dev server on :3000 (proxies API calls to :8080)
npm test                   # CRA/Jest test runner (interactive watch mode)
npm run build               # production build
```

## Architecture

### Backend — layered, DTO-bounded
Standard Spring Boot layering under `com.example.maisonderenard`:

- `web/controllers` — `@RestController`s (`ProductController`, `CategoryController`, `OrderController`, `UserController`, `ChatController`). All CORS-scoped to `http://localhost:3000`.
- `service/application` (+ `impl`) — orchestration layer the controllers call; translates between DTOs and domain services.
- `service/domain` (+ `impl`) — business logic operating on JPA entities.
- `repository` — Spring Data JPA repositories.
- `model/domain` — JPA entities (`Product`, `Category`, `Order`, `User`, `SoldProduct`).
- `dto/domain` — request/response DTOs; controllers and application services never expose entities directly.
- `config/security` + `web/filters/JwtFilter` + `helpers/JwtHelper` — stateless JWT auth (`Authorization: Bearer <token>`), validated once per request in `JwtFilter`, wired in before `UsernamePasswordAuthenticationFilter`.
- `config/initialization/DataInitializer` — `@PostConstruct` seed data: creates `admin`/`admin123` and `customer`/`customer123` accounts and a full product/category catalog on first run (skips if data already exists).

Roles: `ADMIN` and `CUSTOMER`, with a role hierarchy (`config/security/JwtSecurityWebConfig`) where `ADMIN` implies `CUSTOMER`. Route authorization is declared centrally in `JwtSecurityWebConfig.securityFilterChain` (e.g. product/category mutations require `ADMIN`, `/api/orders/**` requires `CUSTOMER`, product/category GETs and `/api/chat` are public).

`SoldProduct` is a separate table that snapshots product data at sale time (name/price/color/material/etc.), used for sales analytics — it's not just a foreign key to `Product`, since products can change or be deleted after being sold.

`Order.status` is a plain `String` (no enum), defaulting to `"PENDING"` in `@PrePersist`; total price is recalculated server-side from the current product list rather than trusted from the client.

### Chat feature (`ChatController`)
Calls the Anthropic Messages API directly from the backend (via `RestTemplate`, not a client SDK) using `anthropic.api.key` from `application.properties`. It builds a large system prompt per-request containing the full product catalog, and — for authenticated users — order history and recently-viewed products (sent from the frontend in the request body); admins additionally get recent sales data and category stats for an analytics mode. The model is instructed to tag recommended products inline as `[PRODUCT_ID:123]`; the controller regex-extracts these IDs, strips the tags from the reply text, and returns the matched `DisplayProductDto`s alongside the cleaned reply so the frontend can render product cards.

### Frontend
- `axios/axios.js` — the shared axios instance; a request interceptor attaches `Authorization: Bearer <jwtToken>` from `localStorage`, and a response interceptor force-logs-out and redirects to `/login` on 401/403 (except for `/chat` calls, which fail silently).
- `hooks/useAuth.js` — the actual auth mechanism in use: reads/writes `jwtToken`/`username`/`role` in `localStorage`. This is what pages and components use.
- `contexts/authContext.js` (`AuthContext`/`AuthProvider`) — a second, **unused** auth implementation (stores its token under a different `localStorage` key, `token`, not `jwtToken`). It's dead code, not wired into `App.js`; don't assume it's the source of truth for auth state.
- `repository/*` — thin per-resource API wrappers (`productRepository`, `categoryRepository`, `orderRepository`, `userRepository`) around the shared axios instance; `hooks/*` wrap these for components.
- `pages/*` are route-level components wired up in `App.js`; `components/layout/` holds the persistent `Header`/`Footer`/`Layout` shell. `ChatBot` is mounted globally in `App.js` (outside `Layout`) so it's available on every route.

## Known local config issue

`Backend/src/main/resources/application.properties` currently has an uncommitted change that adds a live-looking `anthropic.api.key` value directly to the file (the same file a prior commit, `cc1d7d4`, explicitly scrubbed a secret from). Don't commit this file as-is — move the key to an untracked `application-local.properties`/env var, matching how the previous fix was done, before committing.
