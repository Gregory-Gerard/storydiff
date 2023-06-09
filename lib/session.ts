import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getSession() {
  const session = await getServerSession(authOptions);

  if (!session?.chromaticToken) {
    throw new Error('Please login.');
  }

  return session;
}
