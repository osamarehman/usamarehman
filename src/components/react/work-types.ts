export type WorkCover = {
  src: string;
  width: number;
  height: number;
};

export type WorkItem = {
  id: string;
  client: string;
  title: string;
  headlineMetric: string;
  subtitle: string;
  type: string;
  stack: string[];
  summary: string;
  category: 'client' | 'product';
  status?: string;
  kind: 'migration' | 'product' | 'portal' | 'pipeline' | 'configurator' | 'editor';
  cover?: WorkCover;
  coverAlt?: string;
  coverCaption?: string;
  metrics: { label: string; value: string }[];
};
