import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

const getApiBase = () => `${getConfig().LMS_BASE_URL}/api/ai-assis`;

export async function getAllSessions() {
  const { data } = await getAuthenticatedHttpClient().get(`${getApiBase()}/sessions/`);
  return data;
}

export async function getSession(contextKey) {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBase()}/session/?context_key=${encodeURIComponent(contextKey)}`
  );
  return data;
}

export async function sendMessage(ragSessionId, query, courseId = null) {
  const response = await getAuthenticatedHttpClient().post(
    `${getApiBase()}/query/`,
    {
      rag_session_id: ragSessionId,
      query,
      course_id: courseId,
    },
    {
      headers: { 'Accept': 'text/event-stream' },
      responseType: 'stream',
      adapter: 'fetch',
    }
  );
  return response;
}

export async function deleteSession(ragSessionId) {
  const { data } = await getAuthenticatedHttpClient().delete(
    `${getApiBase()}/chat/`,
    { data: { rag_session_id: ragSessionId } }
  );
  return data;
}