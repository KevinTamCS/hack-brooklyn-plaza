import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { TeamFormationHeadingSection } from 'components/teamformation';
import {
  Activate,
  Dashboard,
  ForgotPassword,
  Landing,
  Login
} from 'views/root';
import { ApplicationLanding, ApplicationPage } from 'views/apply';
import {
  AnnouncementView,
  PostAnnouncement,
  EditAnnouncement
} from 'views/announcements';
import { ScheduleBuilder, CreateEvent, EditEvent } from 'views/schedule';
import {
  TeamFormationHome,
  TeamFormationParticipantHome,
  TeamFormationParticipantSearch,
  TeamFormationParticipantSetup,
  TeamFormationTeamHome,
  TeamFormationTeamSearch,
  TeamFormationTeamSetup
} from 'views/teamformation';
import {
  CreateUser,
  ManageApplications,
  SetUserRole,
  SubmittedApplicationResume,
  ViewSubmittedApplication
} from 'views/admin';
import { RootState } from 'types';

const Routes = (): JSX.Element => {
  const userIsLoggedIn = useSelector(
    (state: RootState) => state.auth.isLoggedIn
  );

  return (
    <>
      {/* This heading component will render on top of the switched routes when
          any route containing /teamformation is active */}
      <Route path="/teamformation">
        <TeamFormationHeadingSection />
      </Route>

      <Switch>
        {/* Root */}
        <Route path="/" exact>
          {userIsLoggedIn ? <Dashboard /> : <Landing />}
        </Route>

        <Route path="/login">
          <Login />
        </Route>

        <Route path="/activate">
          <Activate />
        </Route>

        <Route path="/resetpassword">
          <ForgotPassword />
        </Route>

        {/* Public Application Form */}
        <Route path="/apply" exact>
          <ApplicationLanding />
        </Route>

        <Route path="/apply/form">
          <ApplicationPage />
        </Route>

        {/* Announcements */}
        <Route path="/announcements" exact>
          <AnnouncementView />
        </Route>

        <Route path="/announcements/post">
          <PostAnnouncement />
        </Route>

        <Route path="/announcements/:announcementId/edit">
          <EditAnnouncement />
        </Route>

        {/* Schedule Builder */}
        <Route path="/schedule" exact>
          <ScheduleBuilder />
        </Route>

        <Route path="/schedule/create">
          <CreateEvent />
        </Route>

        <Route path="/schedule/:eventId/edit">
          <EditEvent />
        </Route>

        <Route path="/schedule/:eventId">
          <ScheduleBuilder />
        </Route>

        {/* Team Formation */}
        <Route path="/teamformation" exact>
          <TeamFormationHome />
        </Route>

        <Route path="/teamformation/participants/setup">
          <TeamFormationParticipantSetup />
        </Route>

        <Route path="/teamformation/teams/setup">
          <TeamFormationTeamSetup />
        </Route>

        <Route path="/teamformation/participants" exact>
          <TeamFormationParticipantHome />
        </Route>

        <Route path="/teamformation/teams" exact>
          <TeamFormationTeamHome />
        </Route>

        <Route path="/teamformation/participants/search">
          <TeamFormationParticipantSearch />
        </Route>

        <Route path="/teamformation/teams/search">
          <TeamFormationTeamSearch />
        </Route>

        {/* Admin */}
        <Route path="/admin/applications" exact>
          <ManageApplications />
        </Route>

        <Route path="/admin/applications/:applicationNumberParam" exact>
          <ViewSubmittedApplication />
        </Route>

        <Route path="/admin/applications/:applicationNumberParam/resume">
          <SubmittedApplicationResume />
        </Route>

        <Route path="/admin/users/create">
          <CreateUser />
        </Route>

        <Route path="/admin/users/setrole">
          <SetUserRole />
        </Route>
      </Switch>
    </>
  );
};

export default Routes;
