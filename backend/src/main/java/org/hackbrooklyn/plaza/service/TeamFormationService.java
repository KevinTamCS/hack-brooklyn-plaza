package org.hackbrooklyn.plaza.service;

import org.hackbrooklyn.plaza.dto.*;
import org.hackbrooklyn.plaza.model.TeamFormationParticipant;
import org.hackbrooklyn.plaza.model.TeamFormationTeam;
import org.hackbrooklyn.plaza.model.TeamFormationTeamJoinRequest;
import org.hackbrooklyn.plaza.model.User;

public interface TeamFormationService {

    void createParticipant(User user, CreateTFParticipantDTO participantProfileData);

    void createTeam(User user, CreateTFTeamDTO teamData);

    void createParticipantAndTeam(User user, CreateTFParticipantAndTeamDTO participantAndTeamData);

    TeamFormationParticipant getLoggedInParticipantData(User user);

    TeamFormationTeam getLoggedInParticipantTeamData(User user);

    TeamFormationTeamSearchDTO getTeams(int page, int limit, boolean personalized, boolean hideSentJoinRequests, String searchQuery, User user);

    TeamFormationParticipantSearchDTO getParticipants(int page, int limit, boolean personalized, boolean hideSentInvitations, String searchQuery, User user);

    void requestToJoinTeam(int teamId, MessageDTO requestData, User user);

    void inviteParticipantToTeam(int participantId, MessageDTO resBody, User user);

    TeamFormationTeamInboxDTO getTeamInbox(int page, int limit, User user);

    TeamFormationMessageIdsDTO getTeamInboxMessageIds(User user);

    TeamFormationTeamJoinRequest getJoinRequestDetails(int joinRequestId, User user);

    void setJoinRequestAccepted(int joinRequestId, Boolean requestAccepted, User user);
}
