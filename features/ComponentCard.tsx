'use client';

import { Component } from '@/types/component';
import { Test } from '@/types/test';
import Image from 'next/image';
import { ImageOff, Loader2 } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ContextMenu';
import { useSession } from 'next-auth/react';
import { getClient } from '@/lib/chromatic';
import { Session } from 'next-auth';
import { gql } from '@apollo/client';
import { Spec } from '@/types/spec';
import invariant from 'ts-invariant';
import { z } from 'zod';

export default function ComponentCard({ appId, component, test }: { appId: string; component: Component; test: Test }) {
  const session = useSession({ required: true });
  const isSnapshotAvailable = test.comparisons[0];
  const snapshotId = isSnapshotAvailable ? test.comparisons[0].id : '';
  const [tests, setTests] = useState<TestsWithSpec | undefined>(undefined);

  invariant(session.data, 'Session is mandatory, please login.');

  return (
    <ContextMenu>
      <ContextMenuTrigger
        asChild
        onContextMenu={() =>
          !tests && // don't reload if tests are already loaded
          getTestsForComponent({ appId, csfId: component.csfId, session: session.data }).then(
            (response) => void setTests(response)
          )
        }
      >
        <button
          className="flex flex-col items-stretch gap-2 rounded bg-neutral-950 p-2 text-left shadow-outline"
          title={component.name}
        >
          <div className="h-16 rounded bg-neutral-900/50 p-4">
            <div className="relative h-full w-full">
              {isSnapshotAvailable ? (
                <Image
                  unoptimized
                  fill
                  src={`/app/snapshots?appId=${appId}&snapshotId=${snapshotId}&isThumb=1`}
                  alt="Thumbnail"
                  className="max-h-full object-scale-down"
                />
              ) : (
                <ImageOff className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 text-neutral-600" />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <strong className="truncate break-words text-xs font-medium">{component.displayName}</strong>
            <small className="truncate text-2xs text-neutral-500">{component.name.replace('components/', '')}</small>
          </div>
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {tests === undefined && (
          <div className="flex items-center justify-center p-2">
            <Loader2 className="animate-spin" />
          </div>
        )}

        {tests !== undefined && tests.length === 0 && (
          <div className="flex items-center justify-center p-2">No results.</div>
        )}

        {tests &&
          tests.map((test) => (
            <ContextMenuItem key={test.id} className="flex items-center justify-between">
              <span>{test.spec.name}</span>
              {test.parameters.viewport ? (
                <small className="ml-6 text-neutral-500">{test.parameters.viewport}</small>
              ) : (
                ''
              )}
            </ContextMenuItem>
          ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}

async function getTestsForComponent({
  appId,
  csfId,
  session,
}: {
  appId: string;
  csfId: string;
  session: Session;
}): Promise<TestsWithSpec> {
  const { data } = await getClient(session.chromaticToken).query({
    query: gql`
      query getTestsForComponent($appId: ObjID!, $csfId: String!) {
        app(id: $appId) {
          lastBuild {
            id
            testsForComponent(csfId: $csfId) {
              id
              webPath
              comparisons {
                id
                headCapture {
                  resourceKey
                  imageUrl
                  imageSize {
                    width
                    height
                  }
                  backgroundColor
                }
              }
              storybookUrl
              parameters {
                viewport
              }
              spec {
                id
                name
              }
              status
              result
              createdAt
              updatedAt
            }
          }
        }
      }
    `,
    variables: {
      appId,
      csfId,
    },
  });

  return TestsWithSpec.parse(data.app.lastBuild.testsForComponent);
}

const TestsWithSpec = Test.extend({
  spec: Spec,
}).array();

type TestsWithSpec = z.infer<typeof TestsWithSpec>;
