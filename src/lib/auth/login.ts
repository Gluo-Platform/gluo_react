import { API_BASE_URL, GLUO_WEB_URL } from '@/lib/api/config';

export type LoginResult =
  | { ok: true; token: string }
  | { ok: false; message: string };

type ApiErrorItem = {
  field?: string;
  errors?: string[];
};

function extractToken(data: unknown): string | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;
  for (const key of ['token', 'access_token', 'ls_id', 'authorization', 'key']) {
    const value = record[key];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }

  return null;
}

function extractApiError(data: unknown, fallback: string): string {
  if (!data || typeof data !== 'object') {
    return fallback;
  }

  const record = data as Record<string, unknown>;

  if (Array.isArray(record.errors)) {
    const messages = record.errors.flatMap((item) => {
      const errorItem = item as ApiErrorItem;
      return Array.isArray(errorItem.errors) ? errorItem.errors : [];
    });

    if (messages.length > 0) {
      return messages.join(' ');
    }
  }

  if (typeof record.detail === 'string') {
    return record.detail;
  }

  if (typeof record.error === 'string') {
    return record.error;
  }

  return fallback;
}

function isMissingAuthToken(message: string): boolean {
  return (
    message.includes('No token provided') ||
    message.includes('missing the right permissions')
  );
}

function cookieValue(setCookieHeaders: string[], name: string): string | null {
  for (const header of setCookieHeaders) {
    const [pair] = header.split(';');
    const separator = pair.indexOf('=');
    if (separator === -1) {
      continue;
    }

    const key = pair.slice(0, separator).trim();
    const value = pair.slice(separator + 1).trim();
    if (key === name && value) {
      return value;
    }
  }

  return null;
}

async function loginWithApi(
  identifier: string,
  password: string,
): Promise<LoginResult> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ identifier, password }),
  });

  const data: unknown = await response.json().catch(() => null);
  const token = extractToken(data);

  if (response.ok && token) {
    return { ok: true, token };
  }

  return {
    ok: false,
    message: extractApiError(data, 'Unable to sign in. Please try again.'),
  };
}

async function loginWithWebsite(
  identifier: string,
  password: string,
  remember: boolean,
): Promise<LoginResult> {
  const loginPage = await fetch(`${GLUO_WEB_URL}/login`, {
    headers: { Accept: 'text/html' },
  });
  const html = await loginPage.text();
  const csrfMatch = html.match(
    /name="csrfmiddlewaretoken" value="([^"]+)"/,
  );

  if (!csrfMatch) {
    return { ok: false, message: 'Unable to start a login session.' };
  }

  const incomingCookies = loginPage.headers.getSetCookie();
  const csrfCookie = cookieValue(incomingCookies, 'csrftoken');
  const body = new URLSearchParams({
    csrfmiddlewaretoken: csrfMatch[1],
    username: identifier,
    password,
  });

  if (remember) {
    body.set('rememberme', 'on');
  }

  const response = await fetch(`${GLUO_WEB_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Origin: GLUO_WEB_URL,
      Referer: `${GLUO_WEB_URL}/login`,
      ...(csrfCookie ? { Cookie: `csrftoken=${csrfCookie}` } : {}),
    },
    body,
    redirect: 'manual',
  });

  const token = cookieValue(response.headers.getSetCookie(), 'ls_id');
  if (response.status === 302 && token) {
    return { ok: true, token };
  }

  return {
    ok: false,
    message: 'Invalid username or password.',
  };
}

export async function loginWithGluo(
  identifier: string,
  password: string,
  remember: boolean,
): Promise<LoginResult> {
  try {
    const apiResult = await loginWithApi(identifier, password);
    if (apiResult.ok || !isMissingAuthToken(apiResult.message)) {
      return apiResult;
    }

    return await loginWithWebsite(identifier, password, remember);
  } catch {
    return { ok: false, message: 'Unable to reach Gluo. Please try again.' };
  }
}
