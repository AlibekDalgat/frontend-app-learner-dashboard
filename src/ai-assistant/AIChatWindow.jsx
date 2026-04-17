import React, { useState, useEffect, useRef } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { IconButton } from '@openedx/paragon';
import { Send } from '@openedx/paragon/icons';

import { sendMessage, getSession } from './api';
import messages from './messages';
import './AIAssistant.scss';

const AIChatWindow = ({ session, onSessionUpdated }) => {
  const intl = useIntl();
  const config = getConfig();
  const [messagesList, setMessagesList] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const chatRef = useRef(null);

  const isGlobal = session?.context_key === 'global';

  useEffect(() => {
    if (!session) return;

    setLoadError(null);
    getSession(session.context_key)
      .then(data => {
        setMessagesList(data.history || []);
      })
      .catch(err => {
        console.error('Failed to load session history', err);
        setLoadError('Не удалось загрузить историю чата. ИИ временно недоступен.');
      });
  }, [session?.rag_session_id]);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messagesList, isLoading]);

  const renderGreeting = () => {
    if (messagesList.length > 0 || isLoading || loadError) return null;

    const siteName = config.SITE_NAME || 'нашей платформе';
    let text = intl.formatMessage(messages.welcomeGlobal, { siteName });

    if (!isGlobal) {
      text += intl.formatMessage(messages.welcomeCourse);
    }

    return (
      <div className="d-flex justify-content-start">
        <div className="message-bubble assistant greeting">
          {text}
        </div>
      </div>
    );
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !session) return;

    const currentInput = input.trim();

    setMessagesList(prev => [...prev, { role: 'user', content: currentInput }]);
    setInput('');
    setIsLoading(true);
    setLoadError(null);

    setMessagesList(prev => [...prev, {
      role: 'assistant',
      content: '',
      sources: []
    }]);

    try {
      const response = await sendMessage(
        session.rag_session_id,
        currentInput,
        session.context_key !== 'global' ? session.context_key : null
      );

      const reader = response.data.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let accumulatedSources = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (!dataStr) continue;

            try {
              const data = JSON.parse(dataStr);

              if (data.event === 'text_chunk' && data.chunk) {
                accumulatedContent += data.chunk;
                setMessagesList(prev => {
                  const newList = [...prev];
                  const lastMsg = newList[newList.length - 1];
                  if (lastMsg.role === 'assistant') {
                    newList[newList.length - 1] = {
                      ...lastMsg,
                      content: accumulatedContent
                    };
                  }
                  return newList;
                });
              } else if (data.event === 'metadata' && data.sources) {
                accumulatedSources = data.sources;
                setMessagesList(prev => {
                  const newList = [...prev];
                  const lastMsg = newList[newList.length - 1];
                  if (lastMsg.role === 'assistant') {
                    newList[newList.length - 1] = {
                      ...lastMsg,
                      sources: accumulatedSources
                    };
                  }
                  return newList;
                });
              }
            } catch (e) {
              console.warn('Parse error:', e);
            }
          }
        }
      }
    } catch (err) {
      const is429 = err.response?.status === 429 || err.error === 'token_limit';
      setMessagesList(prev => {
        const newList = [...prev];
        const lastMsg = newList[newList.length - 1];

        if (lastMsg && lastMsg.role === 'assistant' && !lastMsg.content) {
          newList[newList.length - 1] = {
            role: 'assistant',
            content: is429 ? intl.formatMessage(messages.errorTokenLimit) : intl.formatMessage(messages.errorGeneral),
            isError: true,
            errorType: err.response?.status === 429 ? 'token_limit' : 'generic'
          };
        }
        return newList;
      });
    } finally {
      setIsLoading(false);
      onSessionUpdated?.();
    }
  };

  return (
    <div className="ai-chat-window">
      <div className="ai-chat-header">
        <h5 className="mb-0">
          {isGlobal ? intl.formatMessage(messages.globalTitle): (session.course_title || 'Чат по курсу')}
        </h5>
      </div>

      <div ref={chatRef} className="ai-chat-messages">
        {loadError ? (
          <div className="message-bubble error p-3">{loadError}</div>
        ) : (
          <>
            {renderGreeting()}
            {messagesList.map((msg, i) => (
              <div
                key={i}
                className={`d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div
                  className={`message-bubble ${msg.role} ${
                    msg.isError
                      ? (msg.errorType === 'token_limit' ? 'error-token' : 'error')
                      : ''
                  }`}
                >
                  {msg.content}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="sources-container">
                      <div className="sources-title">Источники:</div>
                      <ul>
                        {msg.sources.map((src, idx) => (
                          <li key={idx}>
                            <a href={src.url} target="_blank" rel="noopener noreferrer">
                              {src.citation_marker || `[${idx + 1}]`} {src.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="d-flex justify-content-start">
                <div className="message-bubble assistant">ИИ думает...</div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="ai-chat-input-area">
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder={intl.formatMessage(messages.typeMessage)}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <IconButton
            src={Send}
            iconAs={Send}
            variant="primary"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AIChatWindow;