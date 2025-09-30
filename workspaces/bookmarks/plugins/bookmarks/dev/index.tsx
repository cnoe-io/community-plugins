import { createDevApp } from '@backstage/dev-utils';
import { bookmarksTranslations } from '../src';
import { bookmarksPlugin } from '../src/plugin';
import { AVAILABLE_LANGUAGES } from '../src/translations/translations';
import { PluginTestPage } from './PluginTestPage/PluginTestPage';

createDevApp()
  .registerPlugin(bookmarksPlugin)
  .addTranslationResource(bookmarksTranslations)
  .setAvailableLanguages(AVAILABLE_LANGUAGES)
  .addPage({
    element: <PluginTestPage />,
    title: 'Root Page',
    path: '/bookmarks',
  })
  .render();
