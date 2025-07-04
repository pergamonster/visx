import React from 'react';
import type { LinkProvidedProps } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DefaultLink({ link }: LinkProvidedProps<any>) {
  return link?.source && link.target ? (
    <line
      x1={link.source.x}
      y1={link.source.y}
      x2={link.target.x}
      y2={link.target.y}
      strokeWidth={2}
      stroke="#999"
      strokeOpacity={0.6}
    />
  ) : null;
}
