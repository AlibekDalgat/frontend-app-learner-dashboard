import React from 'react';

import { StrictDict } from 'utils';
import { apiHooks, reduxHooks } from 'hooks';
import { getConfig } from '@edx/frontend-platform';
import * as module from './hooks';
import { post } from 'data/services/lms/utils';

export const state = StrictDict({
  showPageBanner: (val) => React.useState(val), // eslint-disable-line
  showConfirmModal: (val) => React.useState(val), // eslint-disable-line
});

export const useConfirmEmailBannerData = () => {
  const { isNeeded } = reduxHooks.useEmailConfirmationData();
  const [showPageBanner, setShowPageBanner] = module.state.showPageBanner(isNeeded);
  const [showConfirmModal, setShowConfirmModal] = module.state.showConfirmModal(false);
  const closePageBanner = () => setShowPageBanner(false);
  const closeConfirmModal = () => setShowConfirmModal(false);
  const openConfirmModal = () => setShowConfirmModal(true);
  const sendConfirmEmail = apiHooks.useSendConfirmEmail();

  const openConfirmModalButtonClick = async () => {
    const resendUrl = `${getConfig().LMS_BASE_URL}/bulk_email/api/resend-activation-email/`;
    try {
      await post(resendUrl, {});
      console.log('Запрос на повторную отправку письма активации отправлен');
    } catch (err) {
      console.error('Ошибка при отправке запроса на повтор активации:', err);
    }
    openConfirmModal();
    closePageBanner();
  };

  const userConfirmEmailButtonClick = () => {
    closeConfirmModal();
    closePageBanner();
  };
  return {
    isNeeded,
    showPageBanner,
    closePageBanner,
    showConfirmModal,
    closeConfirmModal,
    openConfirmModalButtonClick,
    userConfirmEmailButtonClick,
  };
};

export default useConfirmEmailBannerData;
