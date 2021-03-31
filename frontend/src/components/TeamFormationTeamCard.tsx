import React from 'react';
import styled from 'styled-components/macro';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import {
  ObjectiveStatementText,
  StyledActionButton,
  StyledCardArticle,
  TopicOrSkillBadge,
  TopicsAndSkillsArea
} from 'common/styles/teamFormationCardStyles';
import { Breakpoints, TeamFormationTeam } from 'types';

import profileImage from 'assets/icons/profile.svg';
import openSeatImage from 'assets/icons/team-formation/open-seat.svg';

interface TeamFormationTeamCardProps {
  teamData: TeamFormationTeam;
}

interface MemberImagesAreaProps {
  teamSize: number;
}

const TeamFormationTeamCard = (
  props: TeamFormationTeamCardProps
): JSX.Element => {
  const { teamData } = props;

  return (
    <StyledCardArticle>
      <TopHalf>
        <NameAndTopicsAndSkillsContainer>
          <NameArea>
            <NameText>{teamData.name}</NameText>
          </NameArea>

          <TopicsAndSkillsArea>
            {teamData.interestedTopicsAndSkills.map(
              (interestedTopicOrSkill, index) => {
                return (
                  <TopicOrSkillBadge key={index}>
                    {interestedTopicOrSkill}
                  </TopicOrSkillBadge>
                );
              }
            )}
          </TopicsAndSkillsArea>
        </NameAndTopicsAndSkillsContainer>

        <MemberImagesArea teamSize={teamData.size}>
          {generateMemberImages(teamData)}
        </MemberImagesArea>
      </TopHalf>

      <BottomHalf>
        <ObjectiveStatementText>
          {teamData.objectiveStatement}
        </ObjectiveStatementText>

        <ActionButtonContainer>
          {/* TODO: Add logic to handle join requests */}
          <MemberCount>
            {teamData.members.length}/{teamData.size} Members
          </MemberCount>
          <StyledActionButton>Request to Join</StyledActionButton>
        </ActionButtonContainer>
      </BottomHalf>
    </StyledCardArticle>
  );
};

const generateMemberImages = (teamData: TeamFormationTeam) => {
  const memberImageComponents = [];

  for (let i = 0; i < teamData.size; i++) {
    if (i < teamData.members.length) {
      // Go through members array and add them first
      const member = teamData.members[i];
      memberImageComponents.push(
        <OverlayTrigger
          overlay={
            <Tooltip id={`member-${member.id}-tooltip`}>
              {member.user.firstName} {member.user.lastName}
            </Tooltip>
          }
          key={member.id}
        >
          <StyledTeamMemberImage
            src={profileImage}
            alt={`Team Member: ${member.user.firstName} ${member.user.lastName}`}
          />
        </OverlayTrigger>
      );
    } else {
      // If and when there are no more members to add, add placeholder icons
      memberImageComponents.push(
        <StyledTeamMemberImage src={openSeatImage} alt="Open Team Seat" />
      );
    }
  }

  return memberImageComponents;
};

const TopHalf = styled.div`
  display: flex;
  flex-direction: column-reverse;

  @media screen and (min-width: ${Breakpoints.Medium}px) {
    flex-direction: row;
    max-height: 55%;
    overflow: hidden;
  }
`;

const BottomHalf = styled.div`
  @media screen and (min-width: ${Breakpoints.Medium}px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    max-height: 45%;
  }
`;

const NameArea = styled.div`
  @media screen and (min-width: ${Breakpoints.Medium}px) {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 0.7rem;
  }
`;

const NameAndTopicsAndSkillsContainer = styled.div`
  flex-basis: 80%;
`;

const MemberImagesArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr ${(props: MemberImagesAreaProps) =>
      props.teamSize > 2 ? ' 1fr' : ''};
  grid-gap: 0.75rem;
  margin: 0 auto 0.75rem;
  width: 55%;

  @media screen and (min-width: ${Breakpoints.Medium}px) {
    width: auto;
    margin: 0;
    flex-basis: 20%;
    align-self: flex-start;
  }
`;

const NameText = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 0.75rem;

  @media screen and (min-width: ${Breakpoints.Medium}px) {
    text-align: left;
    margin-bottom: 0;
  }
`;

const StyledTeamMemberImage = styled.img`
  display: block;
  margin: 0;
  width: 100%;
  height: auto;

  @media screen and (min-width: ${Breakpoints.Medium}px) {
    margin: 0;
  }
`;

const MemberCount = styled.div`
  display: block;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.75rem;

  @media screen and (min-width: ${Breakpoints.Medium}px) {
    margin-bottom: 0.5rem;
  }
`;

const ActionButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-end;
  overflow: visible;
`;

export default TeamFormationTeamCard;