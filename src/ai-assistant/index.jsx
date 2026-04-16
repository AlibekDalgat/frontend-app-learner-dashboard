import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Helmet } from 'react-helmet';
import AppWrapper from 'containers/AppWrapper';
import LearnerDashboardHeader from 'containers/LearnerDashboardHeader';
import CustomFooter from 'components/CustomFooter';
import messages from './messages';
import AIAssistantLayout from './AIAssistantLayout';

const AIAssistantPage = () => {
  const intl = useIntl();

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage(messages.pageTitle)}</title>
      </Helmet>
      <div>
        <AppWrapper>
          <div className="app-header-fixed">
            <LearnerDashboardHeader />
          </div>

          <main id="main">
            <AIAssistantLayout />
          </main>
        </AppWrapper>

        <div className="app-footer">
          <CustomFooter />
        </div>
      </div>
    </>
  );
};

export default AIAssistantPage;