import process from 'node:process';
import OpenAI from 'openai';
import {CoachingSession, User, Group} from '../../models/index.js';
import type {
  CoachingSessionMessage,
  InteractiveMetadata,
} from '../../models/CoachingSession.js';
import {formatTimeAgo} from '../formatTimeAgo.js';

type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

type SessionResponse = {
  id: string;
  planTitle: string;
  planDescription: string;
  status: string;
  messages: CoachingSessionMessage[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  error?: string;
};

type UserContext = {
  name: string;
  language: string;
  ageGroups: string[];
};

type InteractiveElement = {
  type: 'multiple_choice' | 'thumbs';
  options?: Array<{id: string; label: string; emoji?: string}>;
};

type KaisaResponse = {
  message: string;
  sessionComplete: boolean;
  interactiveElement?: InteractiveElement;
  error?: string;
};

type RetryContext = {
  malformedResponse: string;
  validationError: string;
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? '',
});

/**
 * Fetch user context for injection into the system prompt
 */
async function getUserContext(userId: string): Promise<UserContext> {
  const user = await User.findById(userId).lean();
  const name = user ? `${user.firstName} ${user.lastName}`.trim() : 'Teacher';
  const language = user?.language ?? 'fi';

  // Get unique age groups from user's groups
  const groups = await Group.find({owner: userId}).select('ageGroup').lean();
  const ageGroups = [...new Set(groups.map((g) => g.ageGroup))];

  return {name, language, ageGroups};
}

/**
 * Format previous session summaries for injection into prompt
 */
function formatPreviousSessionsContext(
  previousSummaries: Array<{title: string; content: string; completedAt: Date}>,
): string {
  if (previousSummaries.length === 0) {
    return '';
  }

  const now = new Date();
  const formattedSummaries = previousSummaries
    .map((summary) => {
      const timeAgo = formatTimeAgo(summary.completedAt, now) ?? 'recently';
      return `"Session title: ${summary.title}" (${timeAgo})\nContent: ${summary.content}`;
    })
    .join('\n\n');

  return `
=== PREVIOUS SESSION CONTEXT ===
The following are summaries of previous coaching sessions with this teacher. Use this context to understand their journey and avoid repeating the same ground. The user may have done the same session multiple times. The session title is set by the system. Reference insights from previous sessions when relevant:

${formattedSummaries}
`;
}

/**
 * Build the full system prompt with user context and session plan
 */
function buildSystemPrompt(
  basePromptContent: string,
  sessionPlanContent: string,
  sessionTitle: string,
  userContext: UserContext,
  previousSummaries: Array<{
    title: string;
    content: string;
    completedAt: Date;
  }> = [],
): string {
  const ageGroupText =
    userContext.ageGroups.length > 0
      ? userContext.ageGroups.join(', ')
      : 'not specified';

  const previousSessionsContext =
    formatPreviousSessionsContext(previousSummaries);

  return `${basePromptContent}

=== TEACHER CONTEXT ===
Teacher's name: ${userContext.name}
Preferred language: ${userContext.language}
Age groups they teach: ${ageGroupText} (this and internal system slug)

Conduct the entire conversation in the teacher's preferred language (${userContext.language}) unless the teacher requests otherwise or switches the conversation to another language.
${previousSessionsContext}
=== SESSION PLAN ===
Session title: ${sessionTitle}

${sessionPlanContent}

=== OUTPUT FORMAT ===
You MUST respond with valid JSON in this exact format:
{
  "message": "Your response text here. Use markdown formatting.",
  "sessionComplete": false,
  "interactiveElement": null
}

=== INTERACTIVE ELEMENTS (OPTIONAL) ===
When you want the teacher to choose from options instead of typing, include an interactiveElement:

For multiple choice questions:
{
  "message": "Which of these approaches would you like to try first?",
  "sessionComplete": false,
  "interactiveElement": {
    "type": "multiple_choice",
    "options": [
      {"id": "a", "label": "Start with a morning routine", "emoji": "🌅"},
      {"id": "b", "label": "Try during circle time", "emoji": "⭕"},
      {"id": "c", "label": "Something else"}
    ]
  }
}

Note: The "emoji" field is optional. You can include emojis to make options more visual, or omit them entirely. If you don't want an emoji, simply leave out the "emoji" field - do not set it to null.

For thumbs up/down feedback:
{
  "message": "Did this suggestion help?",
  "sessionComplete": false,
  "interactiveElement": {
    "type": "thumbs"
  }
}

Use interactive elements when it fit the natural flow of the conversation.

Set "sessionComplete" to true only when:
- The coaching conversation has reached a natural conclusion
- You have summarized the key insight or takeaway
- You are warmly closing the session

Keep "sessionComplete" as false during the ongoing conversation.`;
}

/**
 * Sanitize optional string fields from LLM response.
 * Accepts string (including empty) → use as-is
 * Accepts null/undefined → convert to ''
 * Rejects other types → return 'invalid'
 */
function sanitizeOptionalString(value: unknown): string | 'invalid' {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return 'invalid';
}

/**
 * Parse Kaisa's JSON response with sanitization
 */
function parseKaisaResponse(responseText: string): KaisaResponse {
  try {
    const parsed = JSON.parse(responseText) as Record<string, unknown>;

    // Validate required fields
    if (typeof parsed.message !== 'string') {
      return {
        message: '',
        sessionComplete: false,
        error: "Missing required 'message' field or not a string",
      };
    }

    // Sanitize interactive element options if present
    if (
      parsed.interactiveElement &&
      typeof parsed.interactiveElement === 'object'
    ) {
      const element = parsed.interactiveElement as Record<string, unknown>;

      if (Array.isArray(element.options)) {
        const sanitizedOptions = [];

        for (const [index, opt] of element.options.entries()) {
          if (typeof opt !== 'object' || opt === null) {
            return {
              message: '',
              sessionComplete: false,
              error: `Option at index ${index} is not a valid object`,
            };
          }

          const option = opt as Record<string, unknown>;

          // Validate required fields
          if (typeof option.id !== 'string') {
            return {
              message: '',
              sessionComplete: false,
              error: `Option at index ${index} missing required 'id' field`,
            };
          }

          if (typeof option.label !== 'string') {
            return {
              message: '',
              sessionComplete: false,
              error: `Option at index ${index} missing required 'label' field`,
            };
          }

          // Sanitize optional emoji field
          const emoji = sanitizeOptionalString(option.emoji);
          if (emoji === 'invalid') {
            return {
              message: '',
              sessionComplete: false,
              error: `Option at index ${index} has invalid 'emoji' field (must be string or omitted)`,
            };
          }

          sanitizedOptions.push({
            id: option.id,
            label: option.label,
            emoji: emoji || undefined, // Use undefined instead of empty string to omit from response
          });
        }

        element.options = sanitizedOptions;
      }
    }

    return {
      message: parsed.message,
      sessionComplete: Boolean(parsed.sessionComplete),
      interactiveElement: parsed.interactiveElement as
        | InteractiveElement
        | undefined,
    };
  } catch {
    // JSON parsing failed entirely
    return {
      message: '',
      sessionComplete: false,
      error: 'Failed to parse JSON response',
    };
  }
}

export const CoachingService = {
  /**
   * Get previous session summaries for a user
   */
  async getPreviousSummaries(
    userId: string,
    excludeSessionId?: string,
  ): Promise<Array<{title: string; content: string; completedAt: Date}>> {
    const sessions = await CoachingSession.find({
      user: userId,
      status: 'completed',
      summary: {$exists: true, $ne: null},
      ...(excludeSessionId ? {_id: {$ne: excludeSessionId}} : {}),
    })
      .sort({completedAt: -1})
      .limit(5)
      .select('summary')
      .lean();

    return sessions
      .filter((s) => Boolean(s.summary))
      .map((s) => ({
        title: s.summary!.title,
        content: s.summary!.content,
        completedAt: s.summary!.completedAt,
      }));
  },

  /**
   * Generate a summary for a completed session (runs asynchronously)
   */
  async generateSessionSummary(sessionId: string): Promise<void> {
    try {
      const session = await CoachingSession.findById(sessionId);
      if (!session || session.status !== 'completed') {
        return;
      }

      // Build conversation transcript for summarization
      const transcript = session.messages
        .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
        .join('\n\n');

      // Fetch previous summaries for progress context
      const userId = session.user._id.toJSON();
      const previousSummaries = await this.getPreviousSummaries(
        userId,
        sessionId,
      );

      // Format previous summaries for the prompt
      const now = new Date();
      const previousSummariesText =
        previousSummaries.length > 0
          ? previousSummaries
              .map((s) => {
                const timeAgo = formatTimeAgo(s.completedAt, now) ?? 'recently';
                return `"${s.title}" (${timeAgo}): ${s.content}`;
              })
              .join('\n\n')
          : 'No previous sessions.';

      const summaryPrompt = `You are generating a summary of a completed coaching session.

=== ORIGINAL SESSION CONTEXT ===
The following was the system prompt used for this coaching session:

${session.basePromptContent}

=== SESSION PLAN ===
Session title: ${session.planTitle}

${session.planContent}

=== PREVIOUS SESSION SUMMARIES ===
Use these to understand the teacher's journey and note any progress or recurring themes:

${previousSummariesText}

=== YOUR TASK ===
PURPOSE: This summary will be injected into FUTURE coaching sessions with this same teacher to provide context about their learning journey and progress. It helps the coach AI understand what topics have been discussed and what insights the teacher has gained. Your purpose is to summarize the session in a way that helps the coach AI to provide the best possible guidance to the teacher in the future.

IMPORTANT RULES:
1. Focus on what the TEACHER said and shared - summarize THEIR insights, reflections, and commitments
2. Remove ALL personal identifiers (student names, school names, specific personal details)
3. Focus on the teacher's pedagogical insights, goals discussed, and action items THEY mentioned
4. Keep the summary concise (2-4 sentences)
5. Use third person ("The teacher discussed..." not "You discussed...")
6. Highlight any commitments or next steps the teacher mentioned
7. Be warm and encouraging, but objective and make critical observations if needed
8. Note any PROGRESS compared to previous sessions if applicable (growth, recurring challenges, new insights)

NOTE: The ASSISTANT messages in the transcript are from the coach AI. Focus your summary on the USER messages - those are the teacher's actual words.

CONVERSATION TRANSCRIPT:
${transcript}

Respond with ONLY the summary text, no additional formatting or explanation.`;

      const completion = await client.responses.create({
        model: 'gpt-5.2',
        reasoning: {effort: 'low'},
        input: [{role: 'user', content: summaryPrompt}],
      });

      const summaryContent =
        completion.output_text || 'Session completed successfully.';

      // Save the summary to the session
      session.summary = {
        title: session.planTitle,
        content: summaryContent,
        completedAt: session.completedAt ?? new Date(),
      };

      await session.save();
    } catch (error) {
      // Log error but don't throw - summary generation is non-critical
      console.error('Failed to generate session summary:', error);
    }
  },

  /**
   * Generate the first message from the coach when a session starts
   */
  async generateInitialMessage(sessionId: string): Promise<SessionResponse> {
    const session = await CoachingSession.findById(sessionId);

    if (!session) {
      throw new Error('Session not found');
    }

    // Get user context
    const userId = session.user._id.toJSON();
    const userContext = await getUserContext(userId);

    // Get previous session summaries
    const previousSummaries = await this.getPreviousSummaries(
      userId,
      sessionId,
    );

    // Build enhanced system prompt
    const systemPrompt = buildSystemPrompt(
      session.basePromptContent,
      session.planContent,
      session.planTitle,
      userContext,
      previousSummaries,
    );
    const messages: ChatMessage[] = [{role: 'system', content: systemPrompt}];
    const input = messages.map((m) => ({role: m.role, content: m.content}));

    // Call OpenAI with JSON output format
    const completion = await client.responses.create({
      model: 'gpt-5.2',
      reasoning: {effort: 'low'},
      input,
      text: {format: {type: 'json_object'}},
    });

    const responseText =
      completion.output_text ||
      '{"message": "Hello! How can I help you today?", "sessionComplete": false}';
    const kaisaResponse = parseKaisaResponse(responseText);

    // If parsing failed, return session with error - don't save failed message
    if (kaisaResponse.error) {
      return {
        id: session._id.toJSON(),
        planTitle: session.planTitle,
        planDescription: session.planDescription,
        status: session.status,
        messages: session.messages,
        createdAt: session.createdAt?.toISOString() ?? new Date().toISOString(),
        updatedAt: session.updatedAt?.toISOString() ?? new Date().toISOString(),
        completedAt: session.completedAt?.toISOString(),
        error: kaisaResponse.error,
      };
    }

    // Add assistant message to session (with interactive metadata if present)
    const newAssistantMessage: CoachingSessionMessage = {
      role: 'assistant',
      content: kaisaResponse.message,
      createdAt: new Date(),
      ...(kaisaResponse.interactiveElement && {
        metadata: kaisaResponse.interactiveElement as InteractiveMetadata,
      }),
    };
    session.messages.push(newAssistantMessage);

    await session.save();

    return {
      id: session._id.toJSON(),
      planTitle: session.planTitle,
      planDescription: session.planDescription,
      status: session.status,
      messages: session.messages,
      createdAt: session.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: session.updatedAt?.toISOString() ?? new Date().toISOString(),
      completedAt: session.completedAt?.toISOString(),
    };
  },

  /**
   * Send a user message and get AI response
   */
  async sendMessage(
    sessionId: string,
    userId: string,
    userMessage: string,
    retryContext?: RetryContext,
  ): Promise<{
    message: string;
    session: SessionResponse;
    error?: string;
    retryContext?: RetryContext;
  }> {
    // 1. Get session and verify ownership
    const session = await CoachingSession.findOne({
      _id: sessionId,
      user: userId,
    });

    if (!session) {
      throw new Error('Session not found');
    }

    // 2. Add user message to session
    const newUserMessage: CoachingSessionMessage = {
      role: 'user',
      content: userMessage,
      createdAt: new Date(),
    };
    session.messages.push(newUserMessage);

    // 3. Get user context and previous summaries
    const userContext = await getUserContext(userId);
    const previousSummaries = await this.getPreviousSummaries(
      userId,
      sessionId,
    );
    const systemPrompt = buildSystemPrompt(
      session.basePromptContent,
      session.planContent,
      session.planTitle,
      userContext,
      previousSummaries,
    );

    // 4. Build messages array for OpenAI
    const messages: ChatMessage[] = [
      {role: 'system', content: systemPrompt},
      ...session.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    // 4.1 Inject correction context if this is a retry after malformed response
    if (retryContext) {
      messages.push(
        {
          role: 'assistant',
          content: retryContext.malformedResponse,
        },
        {
          role: 'user',
          content: `Your previous response was malformed and could not be parsed. Error: "${retryContext.validationError}". Please respond again with valid JSON following the exact format specified in your instructions.`,
        },
      );
    }

    // 5. Call OpenAI with JSON output format
    const completion = await client.responses.create({
      model: 'gpt-5.2',
      reasoning: {effort: 'low'},
      input: messages.map((m) => ({role: m.role, content: m.content})),
      text: {format: {type: 'json_object'}},
    });

    // 6. Parse structured response
    const responseText =
      completion.output_text ||
      '{"message": "I apologize, I could not generate a response.", "sessionComplete": false}';
    const kaisaResponse = parseKaisaResponse(responseText);

    // 7. If parsing failed, remove the optimistic user message and return error with retry context
    if (kaisaResponse.error) {
      session.messages.pop();
      await session.save();

      return {
        message: '',
        session: {
          id: session._id.toJSON(),
          planTitle: session.planTitle,
          planDescription: session.planDescription,
          status: session.status,
          messages: session.messages,
          createdAt:
            session.createdAt?.toISOString() ?? new Date().toISOString(),
          updatedAt:
            session.updatedAt?.toISOString() ?? new Date().toISOString(),
          completedAt: session.completedAt?.toISOString(),
        },
        error: kaisaResponse.error,
        retryContext: {
          malformedResponse: responseText,
          validationError: kaisaResponse.error,
        },
      };
    }

    // 8. Add assistant message to session (with interactive metadata if present)
    const newAssistantMessage: CoachingSessionMessage = {
      role: 'assistant',
      content: kaisaResponse.message,
      createdAt: new Date(),
      ...(kaisaResponse.interactiveElement && {
        metadata: kaisaResponse.interactiveElement as InteractiveMetadata,
      }),
    };
    session.messages.push(newAssistantMessage);

    // 9. Auto-complete session if Kaisa indicated completion
    if (kaisaResponse.sessionComplete) {
      session.status = 'completed';
      session.completedAt = new Date();
    }

    // 10. Save session
    await session.save();

    // 11. Trigger async summary generation if session completed
    if (kaisaResponse.sessionComplete) {
      // Fire and forget - don't await
      void this.generateSessionSummary(sessionId);
    }

    // 12. Return response with all required fields
    return {
      message: kaisaResponse.message,
      session: {
        id: session._id.toJSON(),
        planTitle: session.planTitle,
        planDescription: session.planDescription,
        status: session.status,
        messages: session.messages,
        createdAt: session.createdAt?.toISOString() ?? new Date().toISOString(),
        updatedAt: session.updatedAt?.toISOString() ?? new Date().toISOString(),
        completedAt: session.completedAt?.toISOString(),
      },
    };
  },
};
