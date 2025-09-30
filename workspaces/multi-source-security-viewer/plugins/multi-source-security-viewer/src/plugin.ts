/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import '@patternfly/patternfly/utilities/Accessibility/accessibility.css';
import '@patternfly/react-core/dist/styles/base-no-reset.css';
import {
  AzureDevOpsClient,
  isAzurePipelinesAvailable,
} from '@backstage-community/plugin-azure-devops';
import {
  GithubActionsClient,
  isGithubActionsAvailable,
} from '@backstage-community/plugin-github-actions';
import {
  isJenkinsAvailable,
  JenkinsClient,
} from '@backstage-community/plugin-jenkins';
import { MSSV_ENABLED_ANNOTATION } from '@backstage-community/plugin-multi-source-security-viewer-common';
import { Entity } from '@backstage/catalog-model';
import {
  configApiRef,
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
  gitlabAuthApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { scmAuthApiRef } from '@backstage/integration-react';
import { isGitlabAvailable } from '@immobiliarelabs/backstage-plugin-gitlab';
import { mssvAzureDevopsApiRef, MssvAzureDevopsClient } from './api/azure';
import { mssvGithubActionsApiRef, MssvGithubActionsClient } from './api/github';
import {
  CustomGitlabCiClient,
  mssvGitlabCIApiRef,
  MssvGitlabCIClient,
} from './api/gitlab';
import { mssvJenkinsApiRef, MssvJenkinsClient } from './api/jenkins';
import { rootRouteRef } from './routes';

/** @public */
export const multiSourceSecurityViewerPlugin = createPlugin({
  id: 'multi-source-security-viewer',
  apis: [
    createApiFactory({
      api: mssvJenkinsApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) => {
        return new MssvJenkinsClient({
          jenkinsApi: new JenkinsClient({
            discoveryApi,
            fetchApi,
          }),
        });
      },
    }),
    createApiFactory({
      api: mssvGithubActionsApiRef,
      deps: {
        configApi: configApiRef,
        scmAuthApi: scmAuthApiRef,
      },
      factory: ({ configApi, scmAuthApi }) => {
        return new MssvGithubActionsClient({
          githubActionsApi: new GithubActionsClient({ configApi, scmAuthApi }),
        });
      },
    }),
    createApiFactory({
      api: mssvGitlabCIApiRef,
      deps: {
        configApi: configApiRef,
        discoveryApi: discoveryApiRef,
        gitlabAuthApi: gitlabAuthApiRef,
        identityApi: identityApiRef,
      },
      factory: ({ configApi, identityApi, discoveryApi, gitlabAuthApi }) => {
        return new MssvGitlabCIClient({
          gitlabCiApi: new CustomGitlabCiClient({
            discoveryApi,
            gitlabAuthApi,
            identityApi,
            codeOwnersPath: configApi.getOptionalString(
              'gitlab.defaultCodeOwnersPath',
            ),
            readmePath: configApi.getOptionalString('gitlab.defaultReadmePath'),
            useOAuth: configApi.getOptionalBoolean('gitlab.useOAuth'),
          }),
        });
      },
    }),
    createApiFactory({
      api: mssvAzureDevopsApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) => {
        return new MssvAzureDevopsClient({
          azureDevopsApi: new AzureDevOpsClient({
            discoveryApi,
            fetchApi,
          }),
        });
      },
    }),
  ],
  routes: {
    entityContent: rootRouteRef,
  },
});

/**
 * @public
 * Returns true if the CI provider annotations are set on component.
 */
export const isMultiCIAvailable = (entity: Entity): boolean =>
  isJenkinsAvailable(entity) ||
  isGitlabAvailable(entity) ||
  isGithubActionsAvailable(entity) ||
  isAzurePipelinesAvailable(entity);

/**
 * @public
 * Returns true if CI provider and mssv annotations are set on component.
 */
export const isMultiCIAvailableAndEnabled = (entity: Entity): boolean =>
  Boolean(
    entity.metadata.annotations?.[MSSV_ENABLED_ANNOTATION] === 'true' &&
      isMultiCIAvailable(entity),
  );

/** @public */
export const EntityMultiCIPipelinesContent =
  multiSourceSecurityViewerPlugin.provide(
    createRoutableExtension({
      name: 'EntityMultiCIPipelinesContent',
      component: () => import('./components/Router').then(m => m.Router),
      mountPoint: rootRouteRef,
    }),
  );
