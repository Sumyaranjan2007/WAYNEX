import React from 'react';
import { StateDetailView } from '@/components/state/StateDetailView';
import { Metadata } from 'next';
import { getStateBySlug } from '@/data/states';

interface Props {
  params: {
    stateSlug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const state = getStateBySlug(params.stateSlug);
  if (!state) {
    return {
      title: 'State Not Found — WAYNEX',
    };
  }
  return {
    title: `${state.name} Travel Guide, History, Climate & Destinations — WAYNEX`,
    description: state.description,
  };
}

export default function ExploreStatePage({ params }: Props) {
  return <StateDetailView stateSlug={params.stateSlug} />;
}
