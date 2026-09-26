# Changelog

## 2026-09-26

- New repository with a clean history, copied from the team repo.
- Moved the Django secret key and JWT signing key into environment variables.
- `/users/` no longer returns password hashes; the serializer lists the fields the frontend uses.
- Fixed `import_events`, which referenced fields the `SocialEvent` model no longer has.
- Removed debug pages and routes (`debug-session`, `admin`, `api/hello`, `api/restricted`), a duplicate `confirm-presence` API route, an unused local import script, deploy scripts from another project, and debug logging of sessions and tokens.
- Dropped the out-of-sync `package-lock.json`; the frontend uses Yarn (`yarn.lock`), like its Dockerfiles.
- Renamed `scrapping/` to `scraping/`.
- Added `.env.example` files, README with architecture and run steps, and this changelog.

## 2025-07

- Presence confirmation (participations) and a "my events" page backed by the API.
- Event history, profile page and category filters on the feed.
- Events loaded from a fixture on container start, with images and links from the scraped data.
- Auth integrated end to end: NextAuth credentials provider on top of Django SimpleJWT.
- Selenium scrapers for Sympla, Eventim and Shotgun producing a common JSON format.

## 2025-06

- First version of the Next.js frontend (login, register, feed) and the Django API with JWT auth.

## 2025-05

- Project setup: Django, PostgreSQL and Redis with Docker Compose.
