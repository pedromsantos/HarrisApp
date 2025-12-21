export interface Env {
  WES_API_KEY: string;
  WES_API_BASE_URL?: string;
}

const WES_API_BASE_URL_DEFAULT = 'https://api.harrisjazzlines.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

function handleCORS(request: Request): Response | null {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }
  return null;
}

async function handleHealth(env: Env): Promise<Response> {
  const response = {
    status: 'ok',
    hasApiKey: !!env.WES_API_KEY,
    apiBaseUrl: env.WES_API_BASE_URL || WES_API_BASE_URL_DEFAULT,
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

async function handleApiProxy(request: Request, env: Env): Promise<Response> {
  if (!env.WES_API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }

  const url = new URL(request.url);

  const apiPath = url.pathname.replace('/api', '');
  const searchParams = url.search;

  const apiBaseUrl = env.WES_API_BASE_URL || WES_API_BASE_URL_DEFAULT;
  const targetUrl = `${apiBaseUrl}${apiPath}${searchParams}`;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.WES_API_KEY}`,
    };

    const requestBody =
      request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined;

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: requestBody,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({
          error: `API request failed: ${errorText}`,
        }),
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const contentType = response.headers.get('content-type');
    let responseBody;

    if (contentType && contentType.includes('application/json')) {
      responseBody = await response.json();
    } else {
      const text = await response.text();
      responseBody = { message: text };
    }

    return new Response(JSON.stringify(responseBody), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsResponse = handleCORS(request);
    if (corsResponse) {
      return corsResponse;
    }

    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return handleHealth(env);
    }

    if (url.pathname.startsWith('/api/')) {
      return handleApiProxy(request, env);
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  },
};
