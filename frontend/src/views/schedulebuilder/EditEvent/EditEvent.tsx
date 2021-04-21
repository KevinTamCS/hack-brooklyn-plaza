import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { acCan, refreshAccessToken } from 'util/auth';
import EventEditor from 'components/schedulebuilder/EventEditor';
import {
  AnnouncementNotFoundError,
  ConnectionError,
  EventData,
  NoPermissionError,
  RootState,
  UnknownError
} from 'types';
import { handleError, handleErrorAndPush } from 'util/plazaUtils';
import { API_ROOT } from 'index';
import { Resources } from 'security/accessControl';

dayjs.extend(utc);
dayjs.extend(timezone);

interface ParamId {
  eventId: string;
}

const initialValues: EventData = {
  id: 0,
  title: '',
  presenter: '',
  startTime: '2021-4-23T00:00:00',
  endTime: '2021-4-23T00:00:00',
  description: '',
  externalLink: ''
};

const EditEvent = (): JSX.Element => {
  const history = useHistory();
  
  const userRole = useSelector((state: RootState) => state.user.role);
  
  const [event, setEvent] = useState(initialValues);
  const { eventId } = useParams<ParamId>();

  const accessToken = useSelector(
    (state: RootState) => state.auth.jwtAccessToken
  );

  useEffect(() => {
    try {
      const permission = acCan(userRole).updateAny(Resources.Events);
      if (!permission.granted) throw new NoPermissionError();
    } catch (err) {
      handleErrorAndPush(err, history);
      return;
    }
    
    getEvent().catch((err) => handleError(err));
  }, []);

  const getEvent = async (overriddenAccessToken?: string) => {
    const token = overriddenAccessToken ? overriddenAccessToken : accessToken;

    let res;
    try {
      res = await fetch(`${API_ROOT}/events/${eventId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      throw new ConnectionError();
    }

    if (res.status === 200) {
      const json = await res.json();
      setEvent(json);
    } else if (res.status === 401) {
      const refreshedToken = await refreshAccessToken(history);
      await getEvent(refreshedToken);
    } else if (res.status === 403) {
      history.push('/');
      throw new NoPermissionError();
    } else if (res.status === 404) {
      history.push('/announcements');
      throw new AnnouncementNotFoundError();
    } else {
      throw new UnknownError();
    }
  };

  const submitPost = async (eventData: EventData) => {
    try {
      await editEvent(eventData);
      toast.success('Event successfully edited');
      history.push('/schedule');
    } catch (err) {
      handleError(err);
    }
  };

  const editEvent = async (
    eventData: EventData,
    overriddenAccessToken?: string
  ) => {
    const token = overriddenAccessToken ? overriddenAccessToken : accessToken;

    let res;
    try {
      res = await fetch(`${API_ROOT}/events/${eventId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          announcementId: eventId,
          ...eventData
        })
      });
    } catch (err) {
      throw new ConnectionError();
    }

    if (res.status === 200) {
      history.push('/schedule');
      return;
    } else if (res.status === 401) {
      const refreshToken = await refreshAccessToken(history);
      await editEvent(eventData, refreshToken);
    } else if (res.status === 403) {
      history.push('/');
      throw new NoPermissionError();
    } else {
      throw new UnknownError();
    }
  };

  return (
    <>
      {event.title === '' ? (
        <></>
      ) : (
        <EventEditor
          eventData={event}
          actionType={'Edit'}
          submitForm={submitPost}
        />
      )}
    </>
  );
};

export default EditEvent;
