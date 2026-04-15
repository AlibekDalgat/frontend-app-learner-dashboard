import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from '@openedx/paragon';

import { getAllSessions, getSession } from './api';
import AIChatsList from './AIChatsList';
import AIChatWindow from './AIChatWindow';
import './AIAssistant.scss';

const AIAssistantLayout = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSessions = async () => {
    try {
      let data = await getAllSessions();
      let updatedSessions = data.sessions || [];

      const hasGlobal = updatedSessions.some(s => s.context_key === 'global');

      if (!hasGlobal) {
        await getSession('global');
        data = await getAllSessions();
        updatedSessions = data.sessions || [];
      }

      setSessions(updatedSessions);

      const globalSession = updatedSessions.find(s => s.context_key === 'global');
      if (globalSession) {
        setActiveSessionId(globalSession.rag_session_id);
      }
    } catch (err) {
      console.error('Failed to load AI sessions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const activeSession = sessions.find(s => s.rag_session_id === activeSessionId);

  return (
    <div className="ai-assistant-page">
      <Container size="xl" className="py-4">
        <h1 className="mb-4">Чаты с ИИ-ассистентом</h1>

        <Row>
          <Col lg={4} xl={3}>
            <AIChatsList
              sessions={sessions}
              activeSessionId={activeSessionId}
              onDelete={loadSessions}
              loading={loading}
            />
          </Col>

          <Col lg={8} xl={9}>
            {activeSession ? (
              <AIChatWindow
                session={activeSession}
                onSessionUpdated={loadSessions}
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 text-muted border rounded p-5">
                Загрузка...
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AIAssistantLayout;