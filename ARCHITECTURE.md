# Architecture Documentation

## System Overview

Sovereign Self is a production-grade personal development platform built with modern web technologies and best practices.

```
┌─────────────────┐
│                 │
│  React Frontend │ ◄──── Vercel Edge Network
│   (Vite + TS)   │
│                 │
└────────┬────────┘
         │
         │ HTTPS + JWT
         │
┌────────▼────────┐
│                 │
│  Express API    │ ◄──── Railway Container
│  (Node.js + TS) │
│                 │
└─┬──┬──┬──┬──┬──┘
  │  │  │  │  │
  │  │  │  │  └──► OpenAI API
  │  │  │  │       (GPT-4 + Embeddings)
  │  │  │  │
  │  │  │  └─────► Pinecone
  │  │  │          (Vector Search)
  │  │  │
  │  │  └────────► Redis
  │  │             (Caching + Jobs)
  │  │
  │  └───────────► Supabase
  │                (PostgreSQL)
  │
  └──────────────► Clerk
                   (Authentication)
```

## Technology Stack

### Frontend Architecture

**Core:**
- React 18 with hooks
- TypeScript for type safety
- Vite for fast builds and HMR

**State Management:**
- TanStack Query (React Query) for server state
- Zustand for client state (if needed)
- Clerk for auth state

**UI Layer:**
- Tailwind CSS for styling
- Radix UI primitives (accessible)
- Shadcn/ui component library
- Lucide React icons

**Rich Text:**
- Tiptap (ProseMirror-based)
- JSON storage format
- Extensible editor

**Data Visualization:**
- Recharts for analytics
- Custom SVG for brand elements

### Backend Architecture

**Core:**
- Node.js 20+ with ES modules
- Express.js for REST API
- TypeScript for type safety

**Database Layer:**
- Prisma ORM (type-safe queries)
- PostgreSQL via Supabase
- Migration-based schema

**Authentication:**
- Clerk for user management
- JWT verification
- Webhook sync to database
- RBAC with middleware

**AI/ML Pipeline:**
- OpenAI for embeddings and chat
- Pinecone for vector storage
- BullMQ for background jobs
- Redis for job queue

**Caching:**
- Redis for API responses
- React Query for client-side
- Prisma query caching

## Data Flow

### Journal Entry Creation

```
1. User types in Tiptap editor
   ↓
2. Content auto-saved (debounced)
   ↓
3. API POST /api/journal
   ↓
4. Prisma saves to PostgreSQL
   ↓
5. Background job queued (BullMQ)
   ↓
6. Worker generates OpenAI embedding
   ↓
7. Embedding stored in Pinecone
   ↓
8. Entry marked as synced
```

### Semantic Search

```
1. User enters search query
   ↓
2. API POST /ai/search/journal
   ↓
3. Generate query embedding (OpenAI)
   ↓
4. Search Pinecone for similar vectors
   ↓
5. Fetch full entries from PostgreSQL
   ↓
6. Return ranked results
```

### Authentication Flow

```
1. User signs in via Clerk
   ↓
2. Clerk issues JWT token
   ↓
3. Frontend stores token
   ↓
4. Token sent in Authorization header
   ↓
5. Backend verifies with Clerk
   ↓
6. User info attached to request
   ↓
7. RLS policies enforced
```

## Security Architecture

### Authentication & Authorization

- **Client**: Clerk handles UI and token management
- **API**: JWT verification on protected routes
- **Database**: Row-level security in Supabase
- **Admin**: Role-based middleware checks

### Data Protection

- HTTPS enforced in production
- CORS configured per environment
- Rate limiting on all endpoints
- Input validation with Zod
- SQL injection prevention (Prisma)
- XSS protection (React escaping)

### Secrets Management

- Environment variables (never committed)
- Clerk handles auth secrets
- API keys rotated regularly
- Webhook secrets verified

## Scalability Considerations

### Horizontal Scaling

- Stateless API (can run multiple instances)
- Redis for shared state
- Background workers can scale independently
- Database connection pooling

### Performance Optimization

- Database indexes on common queries
- Redis caching for expensive operations
- CDN for static assets (Vercel)
- Lazy loading for routes and components
- Background jobs for heavy operations

### Database Optimization

- Indexes on foreign keys
- Indexes on search fields
- Connection pooling via Supabase
- Query optimization with Prisma

### Monitoring & Observability

- Sentry for error tracking
- PostHog for user analytics
- Railway logs for debugging
- Health check endpoints

## Design Patterns

### Backend Patterns

1. **Layered Architecture**
   - Routes → Controllers → Services → Data Access

2. **Dependency Injection**
   - Services instantiated as singletons
   - Easy to mock for testing

3. **Error Handling**
   - Custom AppError class
   - Centralized error middleware
   - Proper HTTP status codes

4. **Validation**
   - Zod schemas shared with frontend
   - Middleware-based validation
   - Type-safe at runtime

### Frontend Patterns

1. **Component Composition**
   - Small, reusable components
   - Props-based configuration
   - Compound components for complex UI

2. **Custom Hooks**
   - Data fetching hooks
   - UI state hooks
   - Reusable business logic

3. **Feature-Based Organization**
   - Components grouped by feature
   - Co-located with related code

4. **Optimistic Updates**
   - Immediate UI feedback
   - React Query handles rollback
   - Toast notifications

## API Design

### RESTful Principles

- Resource-based URLs
- HTTP methods: GET, POST, PATCH, DELETE
- Consistent response format
- Pagination for lists
- Filtering via query params

### Response Format

```typescript
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}

// Paginated
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Endpoint Structure

```
/api/auth/*          - Authentication webhooks
/api/users/*         - User management
/api/journal/*       - Journal entries
/api/knowledge/*     - Knowledge base
/api/ai/*            - AI features
/api/admin/*         - Admin functions
```

## Database Schema

### Key Relationships

```
User (1) ──── (N) JournalEntry
User (1) ──── (N) KnowledgeBaseItem
User (1) ──── (N) UserGoal
User (1) ──── (N) GrowthMetric
JournalEntry (1) ──── (N) Reflection
KnowledgeBaseItem (1) ──── (N) KnowledgeBaseItem (self-ref)
```

### Indexing Strategy

- Foreign keys always indexed
- Search fields (tags, title) indexed
- Date fields for sorting indexed
- Composite indexes for common queries

## Deployment Architecture

### Production Environment

**Frontend (Vercel):**
- Automatic deployments from main
- Preview deployments for PRs
- Edge network CDN
- Environment variables in dashboard

**Backend (Railway):**
- Container-based deployment
- Auto-scaling based on load
- PostgreSQL managed service
- Redis managed service
- Health check monitoring

### CI/CD Pipeline

```
GitHub Push
    ↓
GitHub Actions
    ├─→ Lint & Type Check
    ├─→ Run Tests
    └─→ Build
         ↓
    ✓ Pass
         ↓
    ┌────┴────┐
    │         │
Vercel     Railway
Deploy     Deploy
```

## Future Enhancements

### Phase 2 Features

1. **Mobile Apps**
   - React Native
   - Shared API client
   - Offline mode

2. **Collaboration**
   - Shared knowledge bases
   - Mentor connections
   - Comments and discussions

3. **Advanced AI**
   - Personalized coaching
   - Pattern recognition
   - Predictive insights

4. **Integrations**
   - Google Calendar
   - Notion export
   - Zapier webhooks

### Technical Improvements

1. **GraphQL Layer**
   - Apollo Server (already included)
   - Efficient data fetching
   - Real-time subscriptions

2. **Real-time Features**
   - Supabase real-time
   - Live collaboration
   - Presence indicators

3. **Advanced Search**
   - Full-text search (PostgreSQL)
   - Hybrid search combining vector + text
   - Search filters and facets

4. **Performance**
   - Redis caching strategy
   - Database query optimization
   - Image optimization
   - Code splitting

## Maintenance

### Regular Tasks

- Monitor error rates (Sentry)
- Review user analytics (PostHog)
- Check database performance
- Update dependencies monthly
- Review and optimize slow queries
- Backup critical data

### Scaling Checklist

- [ ] Add more Railway replicas
- [ ] Upgrade database plan
- [ ] Implement caching strategy
- [ ] Optimize bundle size
- [ ] Add CDN for media
- [ ] Monitor API response times
- [ ] Set up alerts for critical errors

## Questions & Support

For architecture questions:
- Review this document
- Check code comments
- Ask in GitHub discussions

