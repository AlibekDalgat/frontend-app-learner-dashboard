/* eslint-disable import/prefer-default-export */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Route, Navigate, Routes,
} from 'react-router-dom';

import {
  AppProvider,
  ErrorPage,
  PageWrap,
} from '@edx/frontend-platform/react';
import store from 'data/store';
import {
  APP_READY,
  APP_INIT_ERROR,
  initialize,
  subscribe,
  mergeConfig,
  getConfig,
} from '@edx/frontend-platform';

import { configuration } from './config';

import messages from './i18n';

import App from './App';

const applyWidgetTheme = () => {
  const config = getConfig();
  const root = document.documentElement;

  root.style.setProperty('--primary', '#2F2F60');
  root.style.setProperty('--primary-light', '#EDE8F5');

  if (!config.WIDGET_MODE) {
    return;
  }


  root.style.setProperty('--primary', config.WIDGET_BRAND_PRIMARY);
  root.style.setProperty('--primary-light', config.WIDGET_BRAND_PRIMARY_LIGHT);

  if (config.WIDGET_MODE && config.WIDGET_LOGO_URL) {
    document.body.setAttribute('data-widget-mode', 'true');
    document.documentElement.style.setProperty('--widget-logo-url', `url(${config.WIDGET_LOGO_URL})`);
  } else {
    document.body.removeAttribute('data-widget-mode');
  }
};

subscribe(APP_READY, () => {
  const root = createRoot(document.getElementById('root'));
  applyWidgetTheme();
  root.render(
    <StrictMode>
      <AppProvider store={store}>
        <Routes>
          <Route path="/" element={<PageWrap><App /></PageWrap>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </StrictMode>,
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  const root = createRoot(document.getElementById('root'));

  root.render(
    <StrictMode>
      <ErrorPage message={error.message} />
    </StrictMode>,
  );
});

export const appName = 'LearnerHomeAppConfig';

initialize({
  handlers: {
    config: () => {
      mergeConfig(configuration, appName);
    },
  },
  messages,
  requireAuthenticatedUser: true,
});
