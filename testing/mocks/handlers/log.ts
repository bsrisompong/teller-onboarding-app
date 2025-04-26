import { http } from 'msw';
import { API_URL } from '@/config/constants';
import { db } from '../db';

interface LogRequest {
  userId: string;
  action: string;
  timestamp?: string;
}

const createLogHandler = http.post(`${API_URL}/logs`, async ({ request }) => {
  const body = (await request.json()) as LogRequest;

  if (!body.userId || !body.action) {
    return new Response(
      JSON.stringify({ success: false, error: 'UserId and action are required' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  try {
    const log = db.log.create({
      userId: body.userId,
      action: body.action,
      timestamp: body.timestamp || new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true, log }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to create log entry' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
});

const getLogsHandler = http.get(`${API_URL}/logs`, async ({ request }) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  const action = url.searchParams.get('action');
  const page = url.searchParams.get('page');
  const limit = url.searchParams.get('limit');

  // Validate pagination parameters
  if (page && isNaN(parseInt(page, 10))) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Invalid page number',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  if (limit && isNaN(parseInt(limit, 10))) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Invalid limit value',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const pageNum = parseInt(page || '1', 10);
  const limitNum = parseInt(limit || '10', 10);

  // Validate pagination values
  if (pageNum < 1) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Page number must be greater than 0',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  if (limitNum < 1 || limitNum > 100) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Limit must be between 1 and 100',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const where: Record<string, any> = {};
    if (userId) {
      where.userId = userId;
    }
    if (action) {
      where.action = action;
    }

    const total = db.log.count({ where });
    const logs = db.log.findMany({
      where,
      orderBy: {
        timestamp: 'desc',
      },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

    return new Response(
      JSON.stringify({
        success: true,
        logs,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error while fetching logs',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});

export const logHandlers = [createLogHandler, getLogsHandler];
