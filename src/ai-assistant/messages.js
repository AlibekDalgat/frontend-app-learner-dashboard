import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  pageTitle: {
    id: 'ai.assistant.page.title',
    defaultMessage: 'Чаты с ИИ-ассистентом',
  },
  globalChat: {
    id: 'ai.assistant.global',
    defaultMessage: 'Глобальный чат',
  },
  courseChats: {
    id: 'ai.assistant.course-chats',
    defaultMessage: 'Чаты по обучению',
  },
  deleteChat: {
    id: 'ai.assistant.delete',
    defaultMessage: 'Удалить',
  },
  globalTitle: {
    id: 'ai.assistant.global.title',
    defaultMessage: 'Глобальный чат с ИИ-ассистентом',
  },
  welcomeGlobal: {
    id: 'ai.assistant.global.welcome',
    defaultMessage: 'Я ИИ-ассистент. Помогу сориентироваться на {siteName}.',
  },
  welcomeCourse: {
    id: 'ai.assistant.course.welcome',
    defaultMessage: ' Также я готов ответить на любые вопросы по материалам этого курса.',
  },
  typeMessage: {
    id: 'ai.assistant.typeMessage',
    defaultMessage: 'Задайте вопрос...',
  },
  errorGeneral: {
    id: 'ai.assistant.error.general',
    defaultMessage: 'Ошибка при обращении к ИИ-ассистенту. Повторите запрос позже.',
  },
  errorTokenLimit: {
    id: 'ai.assistant.error.tokenLimit',
    defaultMessage: 'Вы достигли лимита запросов к ИИ-ассистенту. Задайте вопрос позже.',
  },
});

export default messages;