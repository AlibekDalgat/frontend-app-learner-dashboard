import React from 'react';
import PropTypes from 'prop-types';

import { Button, Hyperlink } from '@openedx/paragon';

import useCardDetailsData from './hooks';
import './index.scss';

export const CourseCardDetails = ({ cardId }) => {
  const {
    providerName,
    accessMessage,
    isEntitlement,
    isFulfilled,
    canChange,
    openSessionModal,
    courseNumber,
    changeOrLeaveSessionMessage,
    totalRewards,
    promotions,
  } = useCardDetailsData({ cardId });

const hasPromotion = promotions && promotions.text;  // или promotions?.text

  return (
    <>
      <span className="small" data-testid="CourseCardDetails">
        {providerName} • {courseNumber}
        {!(isEntitlement && !isFulfilled) && accessMessage && (
          ` • ${accessMessage}`
        )}
        {isEntitlement && isFulfilled && canChange ? (
          <>
            {' • '}
            <Button variant="link" size="inline" className="m-0 p-0" onClick={openSessionModal}>
              {changeOrLeaveSessionMessage}
            </Button>
          </>
        ) : null}
      </span>

      {totalRewards > 0 && (
        <h6 style={{ paddingTop: '10px' }}>
          За прохождение данного курса можно заработать награды: {totalRewards}
        </h6>
      )}

      {hasPromotion && (
        <div className={`promo-section ${promotions.link ? 'has-link' : ''}`}>
          <span className="promo-text">
            {promotions.text}
          </span>

          {promotions.logoUrl && (
            <a
              href={promotions.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="promo-link"
            >
              <img
                src={promotions.logoUrl}
                alt={promotions.text || 'Акция'}
                className="promo-icon"
              />
            </a>
          )}
        </div>
      )}
    </>
  );
};

CourseCardDetails.propTypes = {
  cardId: PropTypes.string.isRequired,
};

CourseCardDetails.defaultProps = {};

export default CourseCardDetails;
