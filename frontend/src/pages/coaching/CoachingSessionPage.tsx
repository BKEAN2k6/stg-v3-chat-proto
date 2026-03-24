import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {useState, useRef, useEffect} from 'react';
import {Button, Form, Spinner} from 'react-bootstrap';
import {useLingui} from '@lingui/react';
import {useParams, useNavigate} from 'react-router-dom';
import {Send} from 'react-bootstrap-icons';
import './CoachingSessionPage.scss';
import InteractiveOptions from './components/InteractiveOptions.js';
import {CustomScroll} from '@/components/ui/CustomScroll/CustomScroll.js';
import PageTitle from '@/components/ui/PageTitle.js';
import Avatar from '@/components/ui/Avatar.js';
import {MarkdownView} from '@/components/ui/MarkdownView.js';
import {colorFromId} from '@/helpers/avatars.js';
import {useCurrentUser} from '@/context/currentUserContext.js';
import {
  useGetCoachingSessionQuery,
  useSendCoachingMessageMutation,
  useUpdateCoachingSessionMutation,
} from '@/hooks/useApi.js';

// eslint-disable-next-line complexity
export default function CoachingSessionPage() {
  const {_} = useLingui();
  const {id} = useParams<{id: string}>();
  const navigate = useNavigate();
  const {currentUser} = useCurrentUser();

  const [messageInput, setMessageInput] = useState('');
  const [optimisticMessage, setOptimisticMessage] = useState<
    string | undefined
  >();
  const [llmError, setLlmError] = useState<string | undefined>();
  const [failedMessage, setFailedMessage] = useState<string | undefined>();
  const [retryContext, setRetryContext] = useState<
    {malformedResponse: string; validationError: string} | undefined
  >();
  const messagesEndReference = useRef<HTMLDivElement>(null);

  const {
    data: session,
    isLoading,
    refetch,
  } = useGetCoachingSessionQuery({id: id ?? ''}, {enabled: Boolean(id)});
  const sendMessageMutation = useSendCoachingMessageMutation();
  const updateSessionMutation = useUpdateCoachingSessionMutation();

  // Poll for initial message when session has no messages yet
  const isWaitingForInitialMessage =
    session?.messages.length === 0 && session.status === 'active';

  useEffect(() => {
    if (!isWaitingForInitialMessage) return;

    const interval = setInterval(() => {
      void refetch();
    }, 1500);

    return () => {
      clearInterval(interval);
    };
  }, [isWaitingForInitialMessage, refetch]);

  const scrollToBottom = () => {
    messagesEndReference.current?.scrollIntoView({behavior: 'smooth'});
  };

  // Get the last message to detect when interactive options appear
  const lastMessage = session?.messages.at(-1);
  const lastMessageHasMetadata = lastMessage?.metadata !== undefined;

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages.length, optimisticMessage, lastMessageHasMetadata]);

  const handleSendMessage = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!id || !messageInput.trim()) return;

    const message = messageInput.trim();
    setMessageInput('');
    setOptimisticMessage(message);
    setLlmError(undefined);
    setFailedMessage(undefined);
    setRetryContext(undefined);

    const result = await sendMessageMutation.mutateAsync({
      pathParameters: {id},
      payload: {content: message},
    });

    if (result.error) {
      setLlmError(result.error);
      setFailedMessage(message);
      setRetryContext(
        result.retryContext as
          | {malformedResponse: string; validationError: string}
          | undefined,
      );
      setOptimisticMessage(undefined);
      await refetch();
      return;
    }

    await refetch();
    setOptimisticMessage(undefined);

    // Session completion is handled by the UI - no auto-navigation
  };

  const handleInteractiveSelect = async (
    option: {id: string; label: string} | {value: 'up' | 'down'},
  ) => {
    if (!id || sendMessageMutation.isPending) return;

    // Determine the message content based on option type
    const message =
      'label' in option ? option.label : option.value === 'up' ? '👍' : '👎';
    setOptimisticMessage(message);
    setLlmError(undefined);
    setFailedMessage(undefined);
    setRetryContext(undefined);

    const result = await sendMessageMutation.mutateAsync({
      pathParameters: {id},
      payload: {content: message},
    });

    if (result.error) {
      setLlmError(result.error);
      setFailedMessage(message);
      setRetryContext(
        result.retryContext as
          | {malformedResponse: string; validationError: string}
          | undefined,
      );
      setOptimisticMessage(undefined);
      await refetch();
      return;
    }

    await refetch();
    setOptimisticMessage(undefined);
  };

  const handleComplete = async () => {
    if (!id) return;
    await updateSessionMutation.mutateAsync({
      pathParameters: {id},
      payload: {status: 'completed'},
    });
    navigate('/coaching');
  };

  const handleRetry = async () => {
    if (!id || !failedMessage) return;

    setOptimisticMessage(failedMessage);
    setLlmError(undefined);

    const result = await sendMessageMutation.mutateAsync({
      pathParameters: {id},
      payload: {content: failedMessage, retryContext},
    });

    if (result.error) {
      setLlmError(result.error);
      setRetryContext(
        result.retryContext as
          | {malformedResponse: string; validationError: string}
          | undefined,
      );
      setOptimisticMessage(undefined);
      await refetch();
      return;
    }

    setFailedMessage(undefined);
    setRetryContext(undefined);
    await refetch();
    setOptimisticMessage(undefined);
  };

  if (isLoading || !session) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  const isSessionActive = session.status === 'active';

  return (
    <div className="coaching-session">
      <PageTitle title={session.planTitle} />

      {/* Header */}
      <div className="coaching-session-header d-flex justify-content-between align-items-center">
        <Button
          variant="link"
          className="p-0 text-decoration-none"
          onClick={() => {
            navigate('/coaching');
          }}
        >
          ← <Trans>Back</Trans>
        </Button>
        {isSessionActive ? (
          <Button
            variant="outline-success"
            size="sm"
            disabled={updateSessionMutation.isPending}
            onClick={handleComplete}
          >
            <Trans>Mark Complete</Trans>
          </Button>
        ) : null}
      </div>

      {/* Messages Area */}
      <div className="coaching-messages-container">
        <CustomScroll
          heightRelativeToParent="100%"
          className="coaching-messages-scroll"
        >
          <div className="coaching-messages-list">
            {/* eslint-disable-next-line complexity */}
            {session.messages.map((message, index) => {
              const isLastMessage = index === session.messages.length - 1;
              const showInteractiveOptions =
                isLastMessage &&
                message.role === 'assistant' &&
                message.metadata &&
                isSessionActive &&
                !optimisticMessage;

              return (
                <div
                  key={message.createdAt}
                  className={`coaching-message coaching-message--${message.role}`}
                >
                  <Avatar
                    path={
                      message.role === 'assistant'
                        ? 'coach-kaisa'
                        : currentUser?.avatar
                    }
                    name={
                      message.role === 'assistant'
                        ? 'Coach Kaisa'
                        : `${currentUser?.firstName ?? ''} ${currentUser?.lastName ?? ''}`
                    }
                    color={
                      message.role === 'user' && currentUser?.id
                        ? colorFromId(currentUser.id)
                        : undefined
                    }
                    size={36}
                    hasTooltip={false}
                  />
                  <div className="coaching-message-bubble">
                    <div className="coaching-message-sender">
                      {message.role === 'assistant'
                        ? 'Coach Kaisa'
                        : `${currentUser?.firstName} ${currentUser?.lastName}`}
                    </div>
                    <div className="coaching-message-content">
                      {message.role === 'assistant' ? (
                        <MarkdownView content={message.content} />
                      ) : (
                        message.content
                      )}
                    </div>
                    {showInteractiveOptions && message.metadata ? (
                      <InteractiveOptions
                        metadata={message.metadata}
                        isDisabled={sendMessageMutation.isPending}
                        onSelect={handleInteractiveSelect}
                      />
                    ) : null}
                  </div>
                </div>
              );
            })}

            {/* Optimistic user message */}
            {optimisticMessage ? (
              <div className="coaching-message coaching-message--user">
                <Avatar
                  path={currentUser?.avatar}
                  name={`${currentUser?.firstName ?? ''} ${currentUser?.lastName ?? ''}`}
                  color={
                    currentUser?.id ? colorFromId(currentUser.id) : undefined
                  }
                  size={36}
                  hasTooltip={false}
                />
                <div className="coaching-message-bubble">
                  <div className="coaching-message-sender">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </div>
                  <div className="coaching-message-content">
                    {optimisticMessage}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Typing indicator - show when sending or waiting for initial message */}
            {sendMessageMutation.isPending || isWaitingForInitialMessage ? (
              <div className="coaching-typing-indicator">
                <Avatar path="coach-kaisa" size={36} hasTooltip={false} />
                <div className="coaching-typing-bubble">
                  <span className="coaching-typing-dot" />
                  <span className="coaching-typing-dot" />
                  <span className="coaching-typing-dot" />
                </div>
              </div>
            ) : null}

            {/* Error message with retry button */}
            {llmError && !sendMessageMutation.isPending ? (
              <div className="coaching-error-container">
                <div className="coaching-error-message">{llmError}</div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleRetry}
                >
                  <Trans>Retry</Trans>
                </Button>
              </div>
            ) : null}

            {/* Session completed message in chat area */}
            {!isSessionActive && (
              <div className="coaching-session-completed-message">
                <Trans>This session has been completed.</Trans>
              </div>
            )}

            <div ref={messagesEndReference} />
          </div>
        </CustomScroll>
      </div>

      {/* Input Area - Always at bottom */}
      {isSessionActive ? (
        <div className="coaching-input-container">
          <Form className="coaching-input-form" onSubmit={handleSendMessage}>
            <Form.Control
              type="text"
              className="coaching-input"
              value={messageInput}
              placeholder={_(msg`Type your message...`)}
              disabled={sendMessageMutation.isPending}
              onChange={(event) => {
                setMessageInput(event.target.value);
              }}
            />
            <Button
              type="submit"
              variant="primary"
              className="coaching-send-button"
              disabled={!messageInput.trim() || sendMessageMutation.isPending}
            >
              <Send size={20} />
            </Button>
          </Form>
        </div>
      ) : (
        <div className="coaching-input-container">
          <Button
            variant="outline-primary"
            className="w-100"
            onClick={() => {
              navigate('/coaching');
            }}
          >
            <Trans>Back to Sessions</Trans>
          </Button>
        </div>
      )}
    </div>
  );
}
