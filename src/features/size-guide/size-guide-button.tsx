'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/dialog';
import { Icon } from '@/components/ui/icon';
import { SizeGuideTable } from './size-guide-table';

export function SizeGuideButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-xs font-medium text-gold underline-offset-4 hover:underline"
      >
        <Icon name="ruler" size={16} /> Guía de tallas
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Guía de tallas (cm)">
        <SizeGuideTable />
      </Modal>
    </>
  );
}
