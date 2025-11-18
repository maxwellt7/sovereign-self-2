# Redis is Optional for Testing

Redis is used for:
- Background job processing (embedding generation)
- API response caching

**You can run the app WITHOUT Redis** for initial testing. Features that work without Redis:
- ✅ Authentication (Clerk)
- ✅ Journal entries (create, read, update, delete)
- ✅ Knowledge base
- ✅ Search (database search works)
- ❌ Semantic AI search (needs embeddings which need Redis jobs)
- ❌ AI insights (needs background processing)

## To Start Docker Later

When you want AI features, start Docker Desktop:
1. Open Docker Desktop app
2. Wait for it to start (Docker icon in menu bar will stop animating)
3. Run: `docker-compose up -d`

## Start Without Redis Now

The app will skip Redis gracefully and still work for core features!

