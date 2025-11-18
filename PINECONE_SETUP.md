# Pinecone Setup Guide

Complete guide to setting up Pinecone for semantic search in Sovereign Self.

## Why Pinecone?

Pinecone provides vector search capabilities that power:
- Semantic search across journal entries
- "Ask your journal" natural language queries
- Related content recommendations
- AI-powered insights

## Step 1: Create Account

1. Go to https://app.pinecone.io
2. Sign up for free account
3. Choose a plan:
   - **Starter (Free)**: 1 pod, 100K vectors
   - **Standard**: More capacity
   - **Serverless**: Pay per usage

## Step 2: Choose Embedding Dimensions

OpenAI's `text-embedding-3-small` supports multiple dimension sizes:

| Dimensions | Speed | Accuracy | Cost | Use Case |
|------------|-------|----------|------|----------|
| 384 | ⚡⚡⚡ | ⭐⭐ | 💰 | Large datasets, fast search |
| 768 | ⚡⚡ | ⭐⭐⭐ | 💰💰 | Balanced |
| **1024** | ⚡ | ⭐⭐⭐⭐ | 💰💰 | **Recommended** |
| 1536 | ⚡ | ⭐⭐⭐⭐⭐ | 💰💰💰 | Maximum accuracy |

**Recommendation**: Use **1024** dimensions for the best balance.

## Step 3: Create Indexes

### Index 1: Journal Embeddings

1. Click **Create Index**
2. Configure:
   ```
   Name: journal-embeddings
   Dimensions: 1024
   Metric: cosine
   ```
3. Choose infrastructure:
   - **Serverless** (recommended for development):
     - Cloud: AWS or GCP
     - Region: us-east-1 or your preferred region
   - **Pod-based** (for production with predictable costs):
     - Pod Type: s1.x1 or p1.x1
     - Replicas: 1

4. Click **Create Index**

### Index 2: Knowledge Embeddings

Repeat the same process:
```
Name: knowledge-embeddings
Dimensions: 1024  (must match journal-embeddings!)
Metric: cosine
```

**Important**: Both indexes MUST use the same dimension size!

## Step 4: Get API Key

1. Go to **API Keys** in Pinecone console
2. Click **Create API Key**
3. Name it: "Sovereign Self"
4. Copy the key (starts with your project ID)

## Step 5: Configure Application

Add to `apps/api/.env`:

```bash
PINECONE_API_KEY=your-api-key-here
PINECONE_ENVIRONMENT=us-east-1-aws  # or your region
PINECONE_INDEX_JOURNAL=journal-embeddings
PINECONE_INDEX_KNOWLEDGE=knowledge-embeddings
EMBEDDING_DIMENSION=1024  # Must match your index dimensions!
```

## Step 6: Verify Setup

```bash
# Start your API server
cd sovereign-self
pnpm --filter api dev

# Create a test journal entry
# The background job will generate embeddings automatically

# Check Pinecone console to see vectors appear
```

## Troubleshooting

### "Index not found"
- Verify index names match exactly
- Check index status in Pinecone console (should be "Ready")
- Wait a few minutes after creation

### "Dimension mismatch"
- All indexes must use the same dimension size
- Update `EMBEDDING_DIMENSION` in `.env` to match your index
- Recreate indexes if dimensions don't match

### "API key invalid"
- Verify you copied the complete key
- Check for extra spaces
- Regenerate key if needed

### "Rate limit exceeded"
- Free tier has limits
- Upgrade plan or wait for reset
- Add delays between embedding generation

## Testing Semantic Search

Once set up, you can test semantic search:

1. Create a few journal entries with different topics
2. Wait for embeddings to be generated (check background jobs)
3. Use the semantic search feature:
   - In the app: Knowledge Base → Search tab
   - Or via API: `POST /api/ai/search/journal`

Example search queries:
- "entries where I felt stressed"
- "times when I was productive"
- "insights about relationships"

## Cost Considerations

### Free Tier Limits
- 1 pod
- ~100,000 vectors
- Shared resources

### Estimation
- Each entry = 1 vector
- 1000 entries = 1000 vectors
- Well within free tier for personal use

### Serverless Pricing
- Pay per storage and compute
- Very cost-effective for low-moderate usage
- Scales automatically

## Dimension Size Guide

If Pinecone shows different preset options, choose the closest:

| If you see | Choose this | Update .env to |
|------------|-------------|----------------|
| 128, 256, 512 | 512 | `EMBEDDING_DIMENSION=512` |
| 384, 768, 1024 | 1024 | `EMBEDDING_DIMENSION=1024` |
| 1536, 3072 | 1536 | `EMBEDDING_DIMENSION=1536` |

The app will automatically use the dimension size you specify!

## Alternative: Use 768 Dimensions

If 1024 isn't available, use 768:

```bash
# In apps/api/.env
EMBEDDING_DIMENSION=768

# Create Pinecone indexes with:
Dimensions: 768
```

This will work perfectly fine - OpenAI's model supports any of these sizes.

## Questions?

- Check Pinecone docs: https://docs.pinecone.io
- Verify your plan supports your chosen pod type
- Contact Pinecone support for account-specific questions

