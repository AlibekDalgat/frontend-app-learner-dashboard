import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Helmet } from 'react-helmet';
import { getConfig } from '@edx/frontend-platform';
import { Alert, Container } from '@openedx/paragon';

import AppWrapper from 'containers/AppWrapper';
import LearnerDashboardHeader from 'containers/LearnerDashboardHeader';
import CustomFooter from 'components/CustomFooter';
import messages from './messages';
import AIAssistantLayout from './AIAssistantLayout';

const AIAssistantPage = () => {
  const intl = useIntl();
  const config = getConfig();
  if (!config.ENABLE_AI_ASSISTANT_WIDGET) {
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
              <Container size="md" className="py-5">
                <Alert variant="warning" className="mt-5">
                  <p>
                    {intl.formatMessage(messages.aiAssistantUnavailableMessage)}
                  </p>
                </Alert>
              </Container>
            </main>
          </AppWrapper>
          <div className="app-footer">
            <CustomFooter />
          </div>
        </div>
      </>
    );
  }
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