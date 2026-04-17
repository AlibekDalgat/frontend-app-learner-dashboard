import { getConfig } from '@edx/frontend-platform';

import urls from 'data/services/lms/urls';

import messages from './messages';

const getLearnerHeaderMenu = (
  formatMessage,
  courseSearchUrl,
  authenticatedUser,
  exploreCoursesClick,
) => ({
  mainMenu: [
    {
      type: 'item',
      href: `${getConfig().LMS_BASE_URL}/dashboard`,
      content: formatMessage(messages.course),
      isActive: !window.location.pathname.includes('/ai-assistant'),
    },
    ...(getConfig().ENABLE_PROGRAMS ? [{
      type: 'item',
      href: `${urls.programsUrl()}`,
      content: formatMessage(messages.program),
    }] : []),
    ...(!getConfig().NON_BROWSABLE_COURSES ? [{
      type: 'item',
      href: `${urls.baseAppUrl(courseSearchUrl)}`,
      content: formatMessage(messages.discoverNew),
      onClick: (e) => {
        exploreCoursesClick(e);
      },
    }]
      : []),
    ...(getConfig().ENABLE_AI_ASSISTANT_WIDGET ? [{
      type: 'item',
      href: `${getConfig().LEARNER_HOME_BASE_URL}ai-assistant`,
      content: formatMessage(messages.aiAssis),
      isActive: window.location.pathname.includes('/ai-assistant'),
    }] : []),
    {
      type: 'item',
      href: `${getConfig().ACCOUNT_PROFILE_URL}/ratings`,
      content: formatMessage(messages.ratings),
    },
  ],
  secondaryMenu: [
    ...(getConfig().SUPPORT_URL ? [{
      type: 'item',
      href: `${getConfig().SUPPORT_URL}`,
      content: formatMessage(messages.help),
    }] : []),
  ],
  userMenu: [
    {
      heading: '',
      items: [
        {
          type: 'item',
          href: `${getConfig().ACCOUNT_PROFILE_URL}/u/${authenticatedUser?.username}`,
          content: formatMessage(messages.profile),
        },
        {
          type: 'item',
          href: `${getConfig().ACCOUNT_SETTINGS_URL}`,
          content: formatMessage(messages.account),
        },
        {
          type: 'item',
          href: `${getConfig().ACCOUNT_PROFILE_URL}/rewards`,
          content: formatMessage(messages.rewards),
        },
      ],
    },
    {
      heading: '',
      items: [
        {
          type: 'item',
          href: `${getConfig().LOGOUT_URL}`,
          content: formatMessage(messages.signOut),
        },
      ],
    },
  ],
}
);

export default getLearnerHeaderMenu;
