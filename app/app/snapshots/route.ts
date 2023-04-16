import { NextRequest, NextResponse } from 'next/server';
import invariant from 'ts-invariant';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  const session = await getSession();
  const { searchParams } = new URL(request.url);

  const appId = searchParams.get('appId');
  const snapshotId = searchParams.get('snapshotId');
  const isThumb = searchParams.get('isThumb') === '1';

  if (!appId || !snapshotId) {
    return NextResponse.json(
      {
        message: 'Invalid request.',
      },
      {
        status: 422,
      }
    );
  }

  invariant(process.env.NEXT_PUBLIC_CHROMATIC_SNAPSHOTS);

  const baseUrl = process.env.NEXT_PUBLIC_CHROMATIC_SNAPSHOTS;
  const snapshotUrl = `${baseUrl}/${appId}-${snapshotId}${isThumb ? '/thumb/' : '/'}capture.png`;

  const response = await fetch(snapshotUrl, {
    headers: {
      authorization: `Bearer ${session.chromaticToken}`,
    },
  });

  const image = await response.blob();

  return new NextResponse(image, {
    headers: response.headers,
  });
}
