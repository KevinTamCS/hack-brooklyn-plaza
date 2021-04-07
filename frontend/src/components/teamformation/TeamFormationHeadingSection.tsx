import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  ParticipantInboxModal,
  TeamInboxModal
} from 'components/teamformation';
import { HeadingActions } from 'components';
import {
  TitleArea,
  VisibilityStatus,
  VisibilityStatusText
} from 'common/styles/teamformation/teamFormationBrowserStyles';
import { HeadingSection, StyledH1 } from 'common/styles/commonStyles';
import { getParticipantData } from 'util/teamFormation';
import { handleError } from 'util/plazaUtils';
import {
  Breakpoints,
  MenuAction,
  RootState,
  TeamFormationParticipant,
  TeamFormationTeam
} from 'types';

import browserVisibleIcon from 'assets/icons/team-formation/browser-visible.svg';
import browserHiddenIcon from 'assets/icons/team-formation/browser-hidden.svg';
import mailboxIcon from 'assets/icons/mailbox.svg';

interface ParticipantHeadingContentsProps {
  participantData: TeamFormationParticipant;
}

interface TeamHeadingContentsProps {
  teamData: TeamFormationTeam;
}

const TeamFormationHeadingSection = (): JSX.Element => {
  const history = useHistory();

  const [
    participantData,
    setParticipantData
  ] = useState<TeamFormationParticipant>();

  useEffect(() => {
    loadHeading().catch((err) => handleError(err));
  }, []);

  const loadHeading = async () => {
    const participantData = await getParticipantData(history);
    setParticipantData(participantData);
  };

  return (
    <HeadingSection>
      {participantData !== undefined && (
        <>
          {participantData.team === null ? (
            <ParticipantHeadingContents participantData={participantData} />
          ) : (
            <TeamHeadingContents teamData={participantData.team} />
          )}
        </>
      )}
    </HeadingSection>
  );
};

const ParticipantHeadingContents = (
  props: ParticipantHeadingContentsProps
): JSX.Element => {
  const { participantData } = props;

  const windowWidth = useSelector((state: RootState) => state.app.windowWidth);

  const [participantInboxOpen, setParticipantInboxOpen] = useState(false);

  const participantHeadingActions: MenuAction[] = [
    {
      onClick: () => setParticipantInboxOpen(true),
      text: 'Inbox',
      type: 'button',
      icon: mailboxIcon
    }
  ];

  return (
    <>
      <TitleArea>
        <StyledH1>Team Formation</StyledH1>
        {participantData !== undefined ? (
          <VisibilityStatus>
            {windowWidth > Breakpoints.Large && (
              <>
                {participantData.visibleInBrowser ? (
                  <img src={browserVisibleIcon} alt="Visible in browser icon" />
                ) : (
                  <img src={browserHiddenIcon} alt="Hidden from browser icon" />
                )}
              </>
            )}

            <VisibilityStatusText>
              Your profile is currently
              {participantData.visibleInBrowser
                ? ' visible on '
                : ' hidden from '}
              the participant browser.
            </VisibilityStatusText>
          </VisibilityStatus>
        ) : (
          <VisibilityStatusText>
            Checking profile visibility...
          </VisibilityStatusText>
        )}
      </TitleArea>

      <HeadingActions
        viewName="Team Formation"
        actions={participantHeadingActions}
      />

      <ParticipantInboxModal
        show={participantInboxOpen}
        setShow={setParticipantInboxOpen}
      />
    </>
  );
};

const TeamHeadingContents = (props: TeamHeadingContentsProps): JSX.Element => {
  const { teamData } = props;

  const windowWidth = useSelector((state: RootState) => state.app.windowWidth);

  const [teamInboxOpen, setTeamInboxOpen] = useState(false);

  const teamHeadingActions: MenuAction[] = [
    {
      onClick: () => setTeamInboxOpen(true),
      text: 'Inbox',
      type: 'button',
      icon: mailboxIcon
    }
  ];

  return (
    <>
      <TitleArea>
        <StyledH1>Team Formation</StyledH1>

        <VisibilityStatus>
          {windowWidth > Breakpoints.Large && (
            <>
              {teamData.visibleInBrowser ? (
                <img src={browserVisibleIcon} alt="Visible in browser icon" />
              ) : (
                <img src={browserHiddenIcon} alt="Hidden from browser icon" />
              )}
            </>
          )}

          <VisibilityStatusText>
            Your team&apos;s profile is currently
            {teamData.visibleInBrowser ? ' visible on ' : ' hidden from '}
            the team browser.
          </VisibilityStatusText>
        </VisibilityStatus>
      </TitleArea>

      <HeadingActions viewName="Team Formation" actions={teamHeadingActions} />

      <TeamInboxModal show={teamInboxOpen} setShow={setTeamInboxOpen} />
    </>
  );
};

export default TeamFormationHeadingSection;
