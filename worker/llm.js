// worker/llm.js
//
// Provider abstraction. Every provider below except Anthropic speaks the
// OpenAI chat-completions wire format, so one fetch call covers all of them.
//
// Pick a provider with the LLM_PROVIDER variable and set the matching secret.
// Nothing else in the codebase needs to change when you switch.
//
// Model ids verified 2026-08-16. `fallbackModel` is used when the primary is
// rate-limited or erroring — Groq's free tier limits are per model, and a
// therapist mid-session should not see a failure we can route around.

export const PROVIDERS = {
  // Measured on this app's own prompt (see the note below): llama-3.3-70b is
  // both the fastest and the most reliable of what Groq currently serves, so
  // it stays the default even though newer models are available there.
  groq_fast: {
    kind: 'openai',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    keyVar: 'GROQ_API_KEY',
    model: 'llama-3.3-70b-versatile',
    fallbackModel: 'openai/gpt-oss-120b',
  },
  openai: {
    kind: 'openai',
    url: 'https://api.openai.com/v1/chat/completions',
    keyVar: 'OPENAI_API_KEY',
    model: 'gpt-5.6-luna',
    fallbackModel: 'gpt-5.6-terra',
  },
  // grok-4-fast was retired in May 2026 and now redirects.
  xai_grok: {
    kind: 'openai',
    url: 'https://api.x.ai/v1/chat/completions',
    keyVar: 'XAI_API_KEY',
    model: 'grok-4.5',
  },
  gemini: {
    kind: 'openai',
    url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    keyVar: 'GEMINI_API_KEY',
    model: 'gemini-3.7-flash',
  },
  anthropic: {
    kind: 'anthropic',
    url: 'https://api.anthropic.com/v1/messages',
    keyVar: 'ANTHROPIC_API_KEY',
    model: 'claude-opus-5',
  },
};

export function resolveProvider(env) {
  const name = env.LLM_PROVIDER || 'groq_fast';
  const provider = PROVIDERS[name];
  if (!provider) {
    throw new Error(
      `Unknown LLM_PROVIDER "${name}". Valid options: ${Object.keys(PROVIDERS).join(', ')}`
    );
  }
  const apiKey = env[provider.keyVar];
  if (!apiKey) {
    throw new Error(`${provider.keyVar} is not set — required for provider "${name}".`);
  }
  return {
    name,
    apiKey,
    ...provider,
    // LLM_MODEL overrides the provider default, so you can A/B a model without
    // touching code.
    model: env.LLM_MODEL || provider.model,
  };
}

/**
 * Sends the conversation and returns the raw assistant text.
 * `messages` uses the OpenAI shape; the Anthropic branch translates it.
 */
export async function chat(provider, messages, { signal, maxTokens = 400 } = {}) {
  if (provider.kind === 'anthropic') return anthropicChat(provider, messages, { signal, maxTokens });
  return openaiChat(provider, messages, { signal, maxTokens });
}

async function openaiChat(provider, messages, { signal, maxTokens }) {
  const attempt = (model, json) =>
    fetch(provider.url, {
      method: 'POST',
      signal,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.2,
        max_tokens: maxTokens,
        ...(json ? { response_format: { type: 'json_object' } } : {}),
      }),
    });

  let response = await attempt(provider.model, true);

  // Some models advertise JSON mode but fail the server-side validation, which
  // comes back as a hard 400. The reply parser copes with plain text anyway, so
  // drop the constraint and retry rather than failing the request.
  if (response.status === 400 && /JSON/i.test(await peek(response))) {
    response = await attempt(provider.model, false);
  }

  // Rate limit or upstream wobble: try the provider's second model once.
  if ((response.status === 429 || response.status >= 500) && provider.fallbackModel) {
    response = await attempt(provider.fallbackModel, true);
  }

  if (!response.ok) {
    throw new Error(`${provider.name} returned ${response.status}: ${await safeText(response)}`);
  }
  const data = await response.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

/** Reads an error body without consuming the response we may still want. */
async function peek(response) {
  try {
    return await response.clone().text();
  } catch {
    return '';
  }
}

async function anthropicChat(provider, messages, { signal, maxTokens }) {
  const system = messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n\n');
  const rest = messages.filter((m) => m.role !== 'system');

  const response = await fetch(provider.url, {
    method: 'POST',
    signal,
    headers: {
      'content-type': 'application/json',
      'x-api-key': provider.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: provider.model,
      max_tokens: maxTokens,
      system,
      messages: rest,
      // The task is one short sentence — low effort keeps it fast and cheap.
      output_config: { effort: 'low' },
    }),
  });

  if (!response.ok) {
    throw new Error(`anthropic returned ${response.status}: ${await safeText(response)}`);
  }
  const data = await response.json();
  if (data?.stop_reason === 'refusal') throw new Error('anthropic declined the request');
  return (data?.content || [])
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('');
}

async function safeText(response) {
  try {
    return (await response.text()).slice(0, 300);
  } catch {
    return '<no body>';
  }
}
