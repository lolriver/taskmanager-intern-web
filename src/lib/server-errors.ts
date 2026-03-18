import { NextResponse } from 'next/server';

const dbConnectionErrorPatterns = [
  /could not connect to any servers/i,
  /server selection timed out/i,
  /server selection error/i,
  /network access/i,
  /whitelist/i,
  /enotfound/i,
  /econnrefused/i,
  /querysrv/i,
];

function isDatabaseConnectionError(message: string) {
  return dbConnectionErrorPatterns.some((pattern) => pattern.test(message));
}

export function createServerErrorResponse(error: unknown, fallbackMessage = 'Server error') {
  const details = error instanceof Error ? error.message : 'Unknown server error';

  if (isDatabaseConnectionError(details)) {
    return NextResponse.json(
      {
        error: 'Database connection failed. Add this machine to MongoDB Atlas Network Access or use a reachable MONGODB_URI.',
        details,
      },
      { status: 503 }
    );
  }

  return NextResponse.json(
    {
      error: fallbackMessage,
      details,
    },
    { status: 500 }
  );
}
