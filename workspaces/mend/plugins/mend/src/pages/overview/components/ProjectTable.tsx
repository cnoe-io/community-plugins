import { Table } from '../../../components';
import { Project } from '../../../models';
import { ProjectData } from '../../../queries';
import { getProjetStatistics } from './projectTable.helpers';
import { projectTableColumnSchema } from './projectTable.schema';

export const ProjectTable = ({
  projectData,
  projectDataError,
  projectDataLoading,
}: ProjectData) => (
  <Table
    clientName={projectData?.clientName}
    clientUrl={`${projectData?.clientUrl}/app/orgs/${projectData?.clientName}/projects`}
    getStatistics={data => getProjetStatistics(data as Project[])}
    tableColumns={projectTableColumnSchema}
    tableData={projectData?.projectList as Project[]}
    tableDataError={projectDataError}
    tableDataLoading={projectDataLoading}
    tableTitle="Projects"
    totalTitle="Projects Overview"
  />
);
