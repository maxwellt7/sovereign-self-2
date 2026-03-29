import { openai, CHAT_MODEL } from '../config/openai.js';

export class AIService {
  /**
   * Generate reflection prompts based on journal entry
   */
  async generateReflectionPrompts(entryContent: string): Promise<string[]> {
    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a thoughtful journaling coach. Generate 3-5 insightful reflection prompts based on the user's journal entry. Prompts should encourage deeper thinking and self-awareness.`,
        },
        {
          role: 'user',
          content: `Based on this journal entry, suggest reflection prompts:\n\n${entryContent}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content || '';
    // Parse prompts (assuming they're numbered or bulleted)
    const prompts = content
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => line.replace(/^[\d\-*.)]+\s*/, '').trim())
      .filter((line) => line.length > 0);

    return prompts.slice(0, 5);
  }

  /**
   * Summarize journal entry
   */
  async summarizeEntry(entryContent: string): Promise<string> {
    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that creates concise, meaningful summaries of journal entries. Focus on key themes, emotions, and insights.`,
        },
        {
          role: 'user',
          content: `Summarize this journal entry in 2-3 sentences:\n\n${entryContent}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 150,
    });

    return response.choices[0]?.message?.content || 'Unable to generate summary';
  }

  /**
   * Analyze mood trends from journal entries
   */
  async analyzeMoodTrend(entries: Array<{ date: string; mood: string }>): Promise<{
    trend: 'improving' | 'declining' | 'stable';
    insights: string;
  }> {
    const entriesText = entries.map((e) => `Date: ${e.date}, Mood: ${e.mood}`).join('\n');

    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a supportive mental wellness coach analyzing mood trends. Provide encouraging insights.`,
        },
        {
          role: 'user',
          content: `Analyze these mood entries and provide insights:\n\n${entriesText}`,
        },
      ],
      temperature: 0.6,
      max_tokens: 200,
    });

    const insights = response.choices[0]?.message?.content || '';

    // Simple trend detection (could be more sophisticated)
    const trend = insights.toLowerCase().includes('improv')
      ? 'improving'
      : insights.toLowerCase().includes('declin')
        ? 'declining'
        : 'stable';

    return { trend, insights };
  }

  /**
   * Generate personalized insights from knowledge base
   */
  async generateKnowledgeInsights(
    items: Array<{ title: string; content: string }>
  ): Promise<string> {
    const itemsText = items
      .map((item) => `Title: ${item.title}\nContent: ${item.content}`)
      .join('\n\n---\n\n');

    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a knowledge synthesis expert. Identify patterns, connections, and actionable insights from a collection of notes.`,
        },
        {
          role: 'user',
          content: `Generate insights and connections from these knowledge base items:\n\n${itemsText}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'Unable to generate insights';
  }
}

export const aiService = new AIService();
