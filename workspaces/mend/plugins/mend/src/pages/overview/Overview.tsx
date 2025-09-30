import { Content, Page } from '@backstage/core-components';
import { fetchApiRef, useApi } from '@backstage/core-plugin-api';
import { mendApiRef } from '../../api';
import { Header } from '../../components';
import { useProjectData } from '../../queries';
import { ProjectTable } from './components';

export const Overview = () => {
  const connectBackendApi = useApi(mendApiRef);
  const { fetch } = useApi(fetchApiRef);
  const data = useProjectData({
    connectApi: connectBackendApi,
    fetchApi: fetch,
  });

  return (
    <Page themeId="tool">
      <Header />
      <Content>
        <ProjectTable {...data} />
      </Content>
    </Page>
  );
};
