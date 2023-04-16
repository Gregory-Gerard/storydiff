import { getClient } from '@/lib/chromatic';
import { gql } from '@apollo/client';
import { getSession } from '@/lib/session';
import { App } from '@/types/app';
import { Build } from '@/types/build';
import { z } from 'zod';
import { Component } from '@/types/component';
import { Test } from '@/types/test';
import { Spec } from '@/types/spec';
import Button from '@/components/Button';
import React from 'react';
import { Check, ServerCrash, Slash, TimerOff } from 'lucide-react';
import ComponentCard from '@/features/ComponentCard';
import { Session } from 'next-auth';
import { ClientSessionProvider } from '@/contexts/ClientSessionProvider';

export default async function Layout({
  children,
  params: { appId },
}: {
  children: React.ReactNode;
  params: { appId: string };
}) {
  const session = await getSession();

  const app = await getComponentRepresentations({ appId, session });

  const LastBuildStatusIcon = {
    SUCCESS: Check,
    CAPTURE_ERROR: Slash,
    SYSTEM_ERROR: ServerCrash,
    TIMEOUT: TimerOff,
  }[app.lastBuild.result];

  return (
    <ClientSessionProvider session={session}>
      <div className="flex h-screen overflow-hidden">
        <div className="h-full w-80 shrink-0 border-r border-neutral-900"></div>
        <div className="flex h-full grow flex-col gap-6 overflow-scroll p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold tracking-tight">{app.name}</h1>

            <div className="flex gap-2">
              <Button variant="ghost" as={'a'} href={app.lastBuild.storybookUrl} target="_blank">
                Storybook
              </Button>
              <Button as={'a'} href={app.webUrl} target="_blank">
                Chromatic
              </Button>
            </div>
          </div>

          <div className="-mx-6 grid grid-cols-4 gap-px divide-neutral-900 bg-neutral-900">
            <Stat title="Stories" value={app.lastBuild.specCount.toString()} />
            <Stat title="Branch" value={app.lastBuild.branch} />
            <Stat
              title="Build"
              value={
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    {app.lastBuild.number.toString()}
                    <LastBuildStatusIcon className="h-4 w-4 rounded-md bg-neutral-100 p-0.5 text-neutral-950" />
                  </div>

                  <small className="text-xs font-medium text-neutral-500">
                    {new Date(app.lastBuild.updatedAt).toDateString()}
                  </small>
                </div>
              }
            />
            <Stat title="Users" value={app.userCount.toString()} />
          </div>

          <div className="grid grid-cols-6 gap-x-4 gap-y-6">
            {app.lastBuild.componentRepresentations.map(
              (componentRepresentation) =>
                componentRepresentation.representativeTest.comparisons && (
                  <ComponentCard
                    key={componentRepresentation.component.id}
                    appId={app.id}
                    component={componentRepresentation.component}
                    test={componentRepresentation.representativeTest}
                  />
                )
            )}
          </div>
        </div>
        <div className="h-full w-1/3 shrink-0 border-l border-neutral-900">{children}</div>
      </div>
    </ClientSessionProvider>
  );
}

function Stat({ title, value }: { title: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 bg-neutral-950 px-6 py-3">
      <strong className="font-medium text-neutral-500">{title}</strong>
      <span className="text-2xl font-black text-neutral-100">{value}</span>
    </div>
  );
}

async function getComponentRepresentations({ appId, session }: { appId: string; session: Session }) {
  const { data } = await getClient(session.chromaticToken).query({
    query: gql`
      query findAllComponentsFromLastBuild($appId: ObjID!) {
        app(id: $appId) {
          id
          webUrl
          name
          userCount
          lastBuild {
            id
            webUrl
            storybookUrl
            branch
            commit
            result
            specCount
            number
            createdAt
            updatedAt
            componentRepresentations {
              component {
                id
                csfId
                name
                displayName
                path
                specs {
                  id
                  name
                }
              }
              representativeTest {
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
                status
                result
                createdAt
                updatedAt
              }
            }
          }
        }
      }
    `,
    variables: {
      appId,
    },
  });

  return App.extend({
    lastBuild: Build.extend({
      componentRepresentations: z
        .object({
          component: Component.extend({
            specs: Spec.array(),
          }),
          representativeTest: Test,
        })
        .array(),
    }),
  }).parse(data.app);
}
