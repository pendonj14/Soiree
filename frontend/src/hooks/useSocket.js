import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// Strip /api suffix to get the bare server origin
const SOCKET_URL = import.meta.env.VITE_API_URL.replace(/\/api$/, '');

export function useSocket(handlers) {
  // Keep a stable ref to handlers so the effect doesn't re-run on every render
  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    const token = localStorage.getItem('soiree_token');
    if (!token) return;

    const socket = io(SOCKET_URL, { auth: { token } });

    Object.entries(handlersRef.current).forEach(([event]) => {
      socket.on(event, (...args) => handlersRef.current[event]?.(...args));
    });

    return () => socket.disconnect();
    // NOTE: empty deps intentional — socket connects once; handlers updated via ref
  }, []);
}
