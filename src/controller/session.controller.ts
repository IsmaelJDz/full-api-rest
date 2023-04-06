import { Request, Response } from 'express';
import {
  createSession,
  findSessions,
  updateSession,
  validatePassword,
} from '../service/session.service';
import { signJwt } from '../utils/jwt';
import config from 'config';

export async function createSessionHandler(
  req: Request,
  res: Response
) {
  // Validate user password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send('Invalid username or password');
  }

  // Create session
  const session = await createSession(
    user._id,
    req.get('User-Agent') || ''
  );

  // Create access token

  const accessToken = signJwt(
    { ...user, session: session._id },
    'accessTokenPrivateKey',
    {
      expiresIn: config.get('accessTokenTtl'), // 15 minutes
    }
  );

  // Create refresh token

  const refreshToken = signJwt(
    { ...user, session: session._id },
    'refreshTokenPrivateKey',
    { expiresIn: config.get('refreshTokenTtl') } // 15 minutes
  );

  // Send refresh & access token back
  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(
  req: Request,
  res: Response
) {
  const userId = res.locals.user._id;

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}

export async function deleteSessionHandler(
  req: Request,
  res: Response
) {
  const sessionId = res.locals.user.sessionId;

  await updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    message: `You are logged out. SessionId: ${sessionId}`,
    accessToken: '',
    refreshToken: '',
  });
}
