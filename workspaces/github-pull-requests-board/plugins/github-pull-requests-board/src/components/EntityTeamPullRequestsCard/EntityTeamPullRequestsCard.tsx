/*
 * Copyright 2022 The Backstage Authors
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
import { InfoCard, Progress } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Grid, Typography } from '@material-ui/core';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import PeopleIcon from '@material-ui/icons/People';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import { useState } from 'react';
import { usePullRequestsByTeam } from '../../hooks/usePullRequestsByTeam';
import { useUserRepositoriesAndTeam } from '../../hooks/useUserRepositoriesAndTeam';
import { shouldDisplayCard } from '../../utils/functions';
import { PRCardFormating } from '../../utils/types';
import { DraftPrIcon } from '../icons/DraftPr';
import { InfoCardHeader } from '../InfoCardHeader';
import { PullRequestBoardOptions } from '../PullRequestBoardOptions';
import { PullRequestCard } from '../PullRequestCard';
import { Wrapper } from '../Wrapper';

/** @public */
export interface EntityTeamPullRequestsCardProps {
  pullRequestLimit?: number;
}

const EntityTeamPullRequestsCard = (props: EntityTeamPullRequestsCardProps) => {
  const { pullRequestLimit } = props;
  const [infoCardFormat, setInfoCardFormat] = useState<PRCardFormating[]>([]);
  const { entity: teamEntity } = useEntity();
  const {
    loading: loadingReposAndTeam,
    repositories,
    teamMembers,
    teamMembersOrganization,
  } = useUserRepositoriesAndTeam(teamEntity);
  const {
    loading: loadingPRs,
    pullRequests,
    refreshPullRequests,
  } = usePullRequestsByTeam(
    repositories,
    teamMembers,
    teamMembersOrganization,
    pullRequestLimit,
  );

  const header = (
    <InfoCardHeader onRefresh={refreshPullRequests}>
      <PullRequestBoardOptions
        onClickOption={newFormats => setInfoCardFormat(newFormats)}
        value={infoCardFormat}
        options={[
          {
            icon: <PeopleIcon />,
            value: 'team',
            ariaLabel: 'Show PRs from your team',
          },
          {
            icon: <DraftPrIcon />,
            value: 'draft',
            ariaLabel: 'Show draft PRs',
          },
          {
            icon: <UnarchiveIcon />,
            value: 'archivedRepo',
            ariaLabel: 'Show archived repos',
          },
          {
            icon: <FullscreenIcon />,
            value: 'fullscreen',
            ariaLabel: 'Set card to fullscreen',
          },
        ]}
      />
    </InfoCardHeader>
  );

  const getContent = () => {
    if (loadingReposAndTeam || loadingPRs) {
      return <Progress />;
    }

    return (
      <Grid container spacing={2}>
        {pullRequests.length ? (
          pullRequests.map(({ title: columnTitle, content }) => (
            <Wrapper
              key={columnTitle}
              fullscreen={infoCardFormat.includes('fullscreen')}
            >
              <Typography variant="overline">{columnTitle}</Typography>
              {content.map(
                (
                  {
                    id,
                    title,
                    createdAt,
                    lastEditedAt,
                    author,
                    url,
                    latestReviews,
                    repository,
                    isDraft,
                    labels,
                    commits,
                  },
                  index,
                ) =>
                  shouldDisplayCard(
                    repository,
                    author,
                    repositories,
                    teamMembers,
                    infoCardFormat,
                    isDraft,
                  ) && (
                    <PullRequestCard
                      key={`pull-request-${id}-${index}`}
                      title={title}
                      createdAt={createdAt}
                      updatedAt={lastEditedAt}
                      author={author}
                      url={url}
                      reviews={latestReviews.nodes}
                      repositoryName={repository.name}
                      repositoryIsArchived={repository.isArchived}
                      isDraft={isDraft}
                      labels={labels.nodes}
                      status={commits.nodes}
                    />
                  ),
              )}
            </Wrapper>
          ))
        ) : (
          <Typography variant="overline" data-testid="no-prs-msg">
            No pull requests found
          </Typography>
        )}
      </Grid>
    );
  };

  return <InfoCard title={header}>{getContent()}</InfoCard>;
};

export default EntityTeamPullRequestsCard;
