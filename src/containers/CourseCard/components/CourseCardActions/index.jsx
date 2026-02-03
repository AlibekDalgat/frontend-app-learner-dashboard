import React from 'react';
import PropTypes from 'prop-types';

import { ActionRow } from '@openedx/paragon';

import { reduxHooks } from 'hooks';

import CourseCardActionSlot from 'plugin-slots/CourseCardActionSlot';
import SelectSessionButton from './SelectSessionButton';
import BeginCourseButton from './BeginCourseButton';
import ResumeButton from './ResumeButton';
import ViewCourseButton from './ViewCourseButton';

export const CourseCardActions = ({ cardId }) => {
  const { isEntitlement, isFulfilled } = reduxHooks.useCardEntitlementData(cardId);
  const {
    hasStarted,
  } = reduxHooks.useCardEnrollmentData(cardId);
  const { isArchived } = reduxHooks.useCardCourseRunData(cardId);
  const { isCourseCompleted = false } = reduxHooks.useCardCourseRunData(cardId);

  return (
    <ActionRow data-test-id="CourseCardActions">
      <CourseCardActionSlot cardId={cardId} />

      {isCourseCompleted && <ViewCourseButton cardId={cardId} />}

      {!isCourseCompleted && (
        <>
          {isEntitlement && (isFulfilled
            ? <ViewCourseButton cardId={cardId} />
            : <SelectSessionButton cardId={cardId} />
          )}
          {(isArchived && !isEntitlement) && (
            <ViewCourseButton cardId={cardId} />
          )}
          {!(isArchived || isEntitlement) && (hasStarted
            ? <ResumeButton cardId={cardId} />
            : <BeginCourseButton cardId={cardId} />
          )}
        </>
      )}
    </ActionRow>
  );
};
CourseCardActions.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default CourseCardActions;
