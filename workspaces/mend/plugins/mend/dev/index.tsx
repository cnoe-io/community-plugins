import { createDevApp } from '@backstage/dev-utils';
import { MendPage, plugin } from '../src/plugin';

createDevApp()
  .registerPlugin(plugin)
  .addPage({
    element: <MendPage />,
    title: 'Mend Page',
    path: '/mend',
  })
  .render();
