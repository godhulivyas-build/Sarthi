import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppStateProvider } from './state/AppState';
import { VoiceAssistantProvider } from './voice/VoiceAssistantProvider';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppStateProvider>
      <VoiceAssistantProvider>
        <App />
      </VoiceAssistantProvider>
    </AppStateProvider>
  </React.StrictMode>
);