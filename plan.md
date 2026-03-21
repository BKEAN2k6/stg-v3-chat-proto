# Plan: LLM Response Sanitization & Error Handling

## Problem Summary

When the LLM generates responses, it sometimes returns `null` for optional string fields (e.g., `emoji: null` instead of omitting the field). This causes AJV schema validation to fail because the schema defines these as `type: 'string'`, and `null` is not a valid string.

Additionally, there's no user-facing error handling when LLM responses are malformed - users see a generic error with no way to retry.

## Goals

1. Update LLM prompts to clarify that optional fields (like emoji) can be omitted
2. Sanitize optional string fields flexibly: accept string/null/undefined → convert to `""`
3. Reject truly malformed data (wrong types like numbers, objects, arrays for string fields)
4. Return errors in a way the UI can handle gracefully with retry buttons
5. No automatic retries - user-initiated only to avoid expensive loops

## Affected Files

### Backend - Prompt Update

**1. `backend/src/services/CoachingService/CoachingService.ts`**

Location: `buildSystemPrompt()` function, the interactive elements documentation section (around line 132-157)

Update the prompt to clarify emojis are optional:

```typescript
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
```

### Backend - Flexible Parsing & Sanitization

**2. `backend/src/services/CoachingService/CoachingService.ts`**

Location: `parseKaisaResponse()` function (lines 171-186)

Add type-checking sanitization that:
- Accepts string (including empty) → use as-is
- Accepts null/undefined → convert to `""`
- Rejects other types → return error response

```typescript
type KaisaResponse = {
  message: string;
  sessionComplete: boolean;
  interactiveElement?: InteractiveElement;
  error?: string; // Add error field for malformed responses
};

function sanitizeOptionalString(value: unknown): string | 'invalid' {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return 'invalid';
}

function parseKaisaResponse(responseText: string): KaisaResponse {
  try {
    const parsed = JSON.parse(responseText) as Record<string, unknown>;

    // Validate required fields
    if (typeof parsed.message !== 'string') {
      return {
        message: '',
        sessionComplete: false,
        error: 'AI response was malformed. Please try again.',
      };
    }

    // Sanitize interactive element options if present
    if (parsed.interactiveElement && typeof parsed.interactiveElement === 'object') {
      const element = parsed.interactiveElement as Record<string, unknown>;

      if (Array.isArray(element.options)) {
        const sanitizedOptions = [];

        for (const opt of element.options) {
          if (typeof opt !== 'object' || opt === null) {
            return {
              message: '',
              sessionComplete: false,
              error: 'AI response was malformed. Please try again.',
            };
          }

          const option = opt as Record<string, unknown>;

          // Validate required fields
          if (typeof option.id !== 'string' || typeof option.label !== 'string') {
            return {
              message: '',
              sessionComplete: false,
              error: 'AI response was malformed. Please try again.',
            };
          }

          // Sanitize optional emoji field
          const emoji = sanitizeOptionalString(option.emoji);
          if (emoji === 'invalid') {
            return {
              message: '',
              sessionComplete: false,
              error: 'AI response was malformed. Please try again.',
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
      message: parsed.message as string,
      sessionComplete: Boolean(parsed.sessionComplete),
      interactiveElement: parsed.interactiveElement as InteractiveElement | undefined,
    };
  } catch {
    // JSON parsing failed entirely
    return {
      message: '',
      sessionComplete: false,
      error: 'AI response was malformed. Please try again.',
    };
  }
}
```

**3. `backend/src/services/CoachingService/CoachingService.ts`**

Location: `generateInitialMessage()` and `sendMessage()` methods

Check for error in parsed response and propagate to the API response:

```typescript
// In generateInitialMessage (around line 352):
const kaisaResponse = parseKaisaResponse(responseText);

if (kaisaResponse.error) {
  // Return session with error flag - don't save failed message
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

// In sendMessage (around line 440):
const kaisaResponse = parseKaisaResponse(responseText);

if (kaisaResponse.error) {
  // Remove the optimistic user message we added
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
      createdAt: session.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: session.updatedAt?.toISOString() ?? new Date().toISOString(),
      completedAt: session.completedAt?.toISOString(),
    },
    error: kaisaResponse.error,
  };
}
```

### Backend - Schema Updates

**4. `backend/src/api/schemas/definitions/CoachingSession.ts`**

Add optional `error` field to session response:

```typescript
export const CoachingSession = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    planTitle: {type: 'string'},
    planDescription: {type: 'string'},
    status: {type: 'string', enum: ['active', 'completed', 'abandoned']},
    messages: {
      type: 'array',
      items: {$ref: '#/definitions/CoachingSessionMessage'},
    },
    createdAt: {type: 'string'},
    updatedAt: {type: 'string'},
    completedAt: {type: 'string'},
    error: {type: 'string'}, // Add this
  },
  required: [
    'id',
    'planTitle',
    'planDescription',
    'status',
    'messages',
    'createdAt',
    'updatedAt',
  ],
} as const;
```

**5. `backend/src/api/controllers/coaching-session/index.ts`**

Update the `/coaching-sessions/:id/messages` response schema to include error:

```typescript
response: {
  type: 'object',
  properties: {
    message: {type: 'string'},
    session: {$ref: '#/definitions/CoachingSession'},
    error: {type: 'string'}, // Add this
  },
  required: ['message', 'session'],
},
```

### Frontend - Error States & Retry

**6. `frontend/src/pages/coaching/CoachingSessionPage.tsx`**

Handle error in response and show retry UI:

```typescript
// Add state for error
const [llmError, setLlmError] = useState<string | undefined>();

// In handleSendMessage:
const handleSendMessage = async (event: React.FormEvent) => {
  event.preventDefault();
  if (!id || !messageInput.trim()) return;

  const message = messageInput.trim();
  setMessageInput('');
  setOptimisticMessage(message);
  setLlmError(undefined);

  const result = await sendMessageMutation.mutateAsync({
    pathParameters: {id},
    payload: {content: message},
  });

  if (result.error) {
    setLlmError(result.error);
    setOptimisticMessage(undefined);
    // Refetch to get the session state (user message was removed)
    await refetch();
    return;
  }

  await refetch();
  setOptimisticMessage(undefined);
};

// Similar update for handleInteractiveSelect

// In JSX, after the typing indicator, show error with retry:
{llmError && !sendMessageMutation.isPending && (
  <div className="coaching-error-container">
    <div className="coaching-error-message">
      {llmError}
    </div>
    <Button
      variant="outline-primary"
      size="sm"
      onClick={() => setLlmError(undefined)}
    >
      <Trans>Dismiss</Trans>
    </Button>
  </div>
)}
```

**7. `frontend/src/pages/coaching/CoachingSessionPage.scss`**

Add styles for error message:

```scss
.coaching-error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  margin: 0.5rem 0;
}

.coaching-error-message {
  color: var(--bs-danger);
  text-align: center;
  font-size: 0.9rem;
}
```

### AiGuidanceService - Similar Pattern

**8. `backend/src/services/AiGuidanceService/AiGuidanceService.ts`**

Apply similar sanitization for `activityId` field (optional string that LLM might set to null):

```typescript
// After JSON.parse at line 1237:
const parsed = JSON.parse(content) as AiGuidanceResponseWithRationale;

// Sanitize optional activityId
if (parsed.activityId === null || parsed.activityId === undefined) {
  parsed.activityId = '';
} else if (typeof parsed.activityId !== 'string') {
  throw new Error('Invalid activityId type from LLM');
}
```

## Implementation Order

1. **Prompt update** - Update the system prompt to clarify emoji is optional
2. **Backend sanitization** - Update `parseKaisaResponse()` with flexible type checking
3. **Backend schema** - Add `error` field to CoachingSession and message response schemas
4. **Regenerate API client** - Run `npm run api-client`
5. **Backend service** - Update `generateInitialMessage()` and `sendMessage()` to handle errors
6. **Frontend error UI** - Add error state and dismiss button to CoachingSessionPage
7. **AiGuidanceService** - Apply similar sanitization pattern

## Post-Implementation

After changes:
1. Run `npm run api-client` (schemas changed)
2. Run `npm run lint --prefix backend -- --fix`
3. Run `npm run lint --prefix frontend -- --fix`

## Design Decisions

**Why return 200 with error field instead of 4xx/5xx?**
- LLM mistakes are expected behavior, not infrastructure failures
- The generated API client throws on non-2xx, requiring try/catch
- A 200 with error field flows through normally and is easier to handle in UI
- The session state is still valid and returned (just without the new message)

**Why not auto-retry?**
- LLM calls are expensive
- Retry loops can get stuck on consistently malformed responses
- User should decide when to retry
- Keeps the user informed about what's happening

**Why `undefined` instead of empty string for omitted emoji?**
- Project convention: "Avoid `null` in types; use `undefined`"
- Cleaner serialization - undefined fields are omitted from JSON
- Frontend already handles missing emoji: `option.emoji ? ... : null`

**Why sanitize instead of just updating schemas to allow null?**
- Keeps schemas strict and self-documenting
- Handles the problem at the source (service layer)
- Works for any unexpected null from the LLM, not just emoji
