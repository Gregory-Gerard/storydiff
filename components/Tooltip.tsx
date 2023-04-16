'use client';

import React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { motion } from 'framer-motion';

export default function Tooltip({ content, children }: React.PropsWithChildren<{ content: string }>) {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root delayDuration={300}>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>

        <RadixTooltip.Portal>
          <RadixTooltip.Content
            className="select-none rounded bg-neutral-900 px-4 py-2 leading-none text-neutral-300 shadow"
            sideOffset={5}
            asChild
          >
            <motion.div initial={{ translateY: '10px', opacity: 0 }} animate={{ translateY: 0, opacity: 1 }}>
              {content}
              <RadixTooltip.Arrow className="fill-neutral-900" />
            </motion.div>
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
