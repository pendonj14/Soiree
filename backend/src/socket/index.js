import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

export function initSocket(httpServer, clientUrl) {
  const io = new Server(httpServer, {
    cors: { origin: clientUrl, methods: ['GET', 'POST'] },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Unauthorized'));
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const { id, role } = socket.user;
    if (role === 'admin') {
      socket.join('admins');
    } else {
      socket.join(`user:${id}`);
    }
  });

  return io;
}
