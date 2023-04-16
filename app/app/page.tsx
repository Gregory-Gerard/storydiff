import React from 'react';
import { gql } from '@apollo/client';
import { getClient } from '@/lib/chromatic';
import { getSession } from '@/lib/session';
import { App } from '@/types/app';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function Page() {
  const session = await getSession();

  const { data } = await getClient(session.chromaticToken).query({
    query: gql`
      query {
        me {
          apps {
            id
            webUrl
            name
            userCount
          }
        }
      }
    `,
  });

  const apps = App.array().parse(data.me.apps);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex w-96 flex-col gap-4 rounded p-4 shadow-outline">
        <h1 className="flex items-center gap-3 px-2 text-base font-bold">Choose your app</h1>

        <ul className="gap gap-1">
          {apps.map((app) => (
            <li key={app.id}>
              <Link
                href={`/app/${app.id}`}
                className="flex items-center justify-between rounded p-2 transition-colors hover:bg-neutral-900"
              >
                <h2>{app.name}</h2>

                <ChevronRight className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
