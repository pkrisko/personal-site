'use client';

import React from 'react';
import CustomHead from '@/components/customHead';
import MovementCanvas from '@/components/watch/MovementCanvas';

export default function MovementPage() {
  return (
    <>
      <CustomHead title="Movement" />
      <MovementCanvas />
    </>
  );
}
