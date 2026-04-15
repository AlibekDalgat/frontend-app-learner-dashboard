import React, { useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Card, IconButton, Button, Hyperlink } from '@openedx/paragon';
import { Chat, Delete, ArrowForward, Cancel } from '@openedx/paragon/icons';

import { deleteSession } from './api';
import messages from './messages';
import './AIAssistant.scss';

const AIChatsList = ({ sessions, activeSessionId, onDelete }) => {
  const intl = useIntl();
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const globalSession = sessions.find(s => s.context_key === 'global');
  const courseSessions = sessions.filter(s => s.context_key !== 'global');

  const handleDeleteClick = (e, sessionId) => {
    e.stopPropagation();
    setConfirmDeleteId(sessionId);
  };

  const confirmDelete = async (sessionId) => {
    try {
      await deleteSession(sessionId);
      await onDelete();
    } catch (err) {
      console.error('Failed to delete session', err);
      alert('Не удалось удалить чат');
    }
    setConfirmDeleteId(null);
  };

  return (
    <div className="ai-chats-list">
      <h4 className="mb-3">Чаты с ИИ-ассистентом</h4>

      {globalSession && (
        <Card
          className={`chat-card mb-3 ${activeSessionId === globalSession.rag_session_id ? 'active' : ''}`}
        >
          <Card.Body className="d-flex align-items-center py-3">
            <Chat className="text-primary mr-3" style={{ fontSize: '1.7rem' }} />
            <div className="flex-grow-1">
              <strong>{intl.formatMessage(messages.globalChat)}</strong>
            </div>

            {confirmDeleteId === globalSession.rag_session_id ? (
              <div className="d-flex gap-2">
                <Button variant="danger" size="sm" onClick={() => confirmDelete(globalSession.rag_session_id)}>
                  Удалить
                </Button>
                <IconButton
                  src={Cancel}
                  iconAs={Cancel}
                  size="sm"
                  variant="primary"
                  onClick={() => setConfirmDeleteId(null)}
                  style={{ marginLeft: '2px', marginRight: '2px' }}
                />
              </div>
            ) : (
              <IconButton
                src={Delete}
                iconAs={Delete}
                size="sm"
                variant="primary"
                onClick={(e) => handleDeleteClick(e, globalSession.rag_session_id)}
              />
            )}
          </Card.Body>
        </Card>
      )}

      {courseSessions.length > 0 && (
        <>
          <h5 className="small text-muted mb-3 mt-4">{intl.formatMessage(messages.courseChats)}</h5>
          {courseSessions.map(session => (
            <Card key={session.rag_session_id} className="chat-card mb-3">
              <Card.Body className="py-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1 pe-3 course-title-wrapper">
                    <strong className="course-title">{session.course_title || session.context_key}</strong>
                    <div className="small text-muted">
                      {new Date(session.last_used_at).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-2 align-items-end">
                    {session.course_url && (
                      <Hyperlink
                        destination={session.course_url}
                        target="_self"
                        className="p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconButton
                          src={ArrowForward}
                          iconAs={ArrowForward}
                          size="sm"
                          variant="primary"
                        />
                      </Hyperlink>
                    )}

                    {confirmDeleteId === session.rag_session_id ? (
                      <div className="d-flex gap-2">
                        <Button variant="danger" size="sm" onClick={() => confirmDelete(session.rag_session_id)}>
                          Удалить
                        </Button>
                        <IconButton
                          src={Cancel}
                          iconAs={Cancel}
                          size="sm"
                          variant="primary"
                          onClick={() => setConfirmDeleteId(null)}
                          style={{ marginLeft: '2px', marginRight: '2px' }}
                        />
                      </div>
                    ) : (
                      <IconButton
                        src={Delete}
                        iconAs={Delete}
                        size="sm"
                        variant="primary"
                        onClick={(e) => handleDeleteClick(e, session.rag_session_id)}
                      />
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default AIChatsList;