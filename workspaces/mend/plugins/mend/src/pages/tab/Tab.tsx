import { Content } from '@backstage/core-components';
import { fetchApiRef, useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { mendApiRef } from '../../api';
import { useFindingData } from '../../queries';
import { FindingTable } from './components';

export const Tab = () => {
  const connectBackendApi = useApi(mendApiRef);
  const { fetch } = useApi(fetchApiRef);
  const { entity } = useEntity();
  const data = useFindingData({
    connectApi: connectBackendApi,
    fetchApi: fetch,
    uid: entity.metadata.uid,
  });

  return (
    <Content>
      <FindingTable {...data} />
    </Content>
  );
};
