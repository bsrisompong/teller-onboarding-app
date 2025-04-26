import { http } from 'msw';
import { API_URL } from '@/config/constants';

export const healthHandlers = [
  http.get(`${API_URL}/health`, () => {
    return new Response(
      JSON.stringify({
        status: 'ok',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),
];
