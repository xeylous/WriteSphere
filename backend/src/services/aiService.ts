import Groq from 'groq-sdk';
import { env } from '../config/env';
import { AIHistory } from '../models';

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

/**
 * AI service integrating with the Groq Cloud API.
 * Uses Llama-3-70b-8192 or similar performant models.
 * Records token consumption and latency metrics in database.
 */
class AIService {
  private model = 'llama3-70b-8192';

  private async callGroq(prompt: string, systemPrompt: string, userId: string, action: string, blogId?: string) {
    const startTime = Date.now();
    try {
      const completion = await groq.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
      });

      const output = completion.choices[0]?.message?.content || '';
      const latencyMs = Date.now() - startTime;
      const tokens = completion.usage?.total_tokens || 0;

      // Log AI history entry asynchronously
      AIHistory.create({
        user: userId,
        blog: blogId,
        action,
        input: prompt.substring(0, 1000),
        output,
        aiModel: this.model,
        tokens,
        latencyMs,
      }).catch((err) => console.error('Failed to log AI History:', err));

      return { result: output, tokens };
    } catch (err: any) {
      console.error('Groq API Error:', err);
      throw new Error(`AI processing failed: ${err.message}`);
    }
  }

  async grammarFix(text: string, userId: string) {
    return this.callGroq(
      text,
      'You are a professional copyeditor. Fix any spelling, grammatical, or punctuation errors in the user\'s text while keeping the exact meaning, style, and tone. Output only the corrected text with no introductions or extra notes.',
      userId,
      'grammar_fix',
    );
  }

  async rewrite(text: string, tone: string, userId: string) {
    return this.callGroq(
      text,
      `You are an expert editor. Rewrite the user's text to have a ${tone} tone. Improve the flow and sentence structure, but preserve the core information. Output only the rewritten text with no introductions or extra notes.`,
      userId,
      'rewrite',
    );
  }

  async expand(text: string, userId: string) {
    return this.callGroq(
      text,
      'You are an insightful essayist. Expand on the user\'s thoughts, elaborating on key points and adding relevant details, examples, or depth while maintaining a premium, readable tone. Output only the expanded text.',
      userId,
      'expand',
    );
  }

  async shorten(text: string, userId: string) {
    return this.callGroq(
      text,
      'You are a precise editor. Condense the user\'s text to make it more concise and punchy without losing key information. Output only the shortened text.',
      userId,
      'shorten',
    );
  }

  async continueWriting(text: string, context: string, userId: string) {
    return this.callGroq(
      `Current content:\n${text}\n\nAdditional Context/Prompt: ${context || 'Continue the flow naturally'}`,
      'You are a skilled writer. Continue the text provided by the user naturally, matching its tone, style, and vocabulary. Write about 2-3 coherent paragraphs that flow directly from the end of the text. Output only the continuation text.',
      userId,
      'continue',
    );
  }

  async generateTitle(content: string, userId: string) {
    return this.callGroq(
      content,
      'Generate 5 premium, engaging, and SEO-friendly headlines for this article. Output the titles as a numbered list with no explanation or extra content.',
      userId,
      'generate_title',
    );
  }

  async generateTags(content: string, userId: string) {
    return this.callGroq(
      content,
      'Generate up to 5 relevant tags (single words or short phrases) for this article. Output only the tags separated by commas, with no explanation.',
      userId,
      'generate_tags',
    );
  }

  async generateSEO(content: string, userId: string) {
    return this.callGroq(
      content,
      'Generate a JSON block containing "metaTitle" (max 60 chars) and "metaDescription" (max 155 chars) optimized for SEO based on the article content. Output only valid JSON inside a code block.',
      userId,
      'generate_seo',
    );
  }

  async generateIntro(topic: string, userId: string) {
    return this.callGroq(
      topic,
      'Write a highly engaging, professional introduction paragraph for an article about the user\'s topic. Capture the reader\'s attention and frame the importance of the topic. Output only the paragraph.',
      userId,
      'generate_intro',
    );
  }

  async generateConclusion(content: string, userId: string) {
    return this.callGroq(
      content,
      'Write a powerful, thought-provoking conclusion paragraph for this article. Summarize key takeaways and leave the reader with a strong final thought. Output only the paragraph.',
      userId,
      'generate_conclusion',
    );
  }

  async summarize(content: string, userId: string) {
    return this.callGroq(
      content,
      'Summarize this article in 3-4 clear sentences. Focus on the main argument and key takeaways. Output only the summary text.',
      userId,
      'summarize',
    );
  }

  async keyTakeaways(content: string, userId: string) {
    return this.callGroq(
      content,
      'Extract up to 5 key bullet points summarizing the core learnings, facts, or takeaways from this article. Format them as a simple markdown bulleted list.',
      userId,
      'key_takeaways',
    );
  }
}

export const aiService = new AIService();
