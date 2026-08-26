'use client';

import React, {
  useMemo,
} from 'react';

import {
  FileCode2,
  ExternalLink,
} from 'lucide-react';

import type {
  TechnicalFile,
} from '@/lib/technical-project-explorer/types';

interface TechnicalFileViewerProps {
  file: TechnicalFile | null;

  lineStart?: number;
  lineEnd?: number;

  onClose?: () => void;
}

export const TechnicalFileViewer: React.FC<
  TechnicalFileViewerProps
> = ({
  file,
  lineStart,
  lineEnd,
}) => {
  const lines = 0;
}