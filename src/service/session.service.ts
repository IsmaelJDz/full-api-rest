import { get, omit } from 'lodash';
import SessionModel, {
  SessionDocument,
} from '../models/session.model';
import UserModel from '../models/user.model';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { signJwt, verifyJwt } from '../utils/jwt';
import { findUser } from './user.service';
import config from 'config';

export async function createSession(
  userId: string,
  userAgent: string
) {
  const session = await SessionModel.create({
    user: userId,
    userAgent,
  });

  return session.toJSON();
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return false;
  }

  return omit(user.toJSON(), 'password');
}

export async function findSessions(
  query: FilterQuery<SessionDocument>
) {
  return SessionModel.find(query);
}

export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  return SessionModel.updateOne(query, update);
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJwt(
    refreshToken,
    'refreshTokenPublicKey'
  );

  if (!decoded || !get(decoded, 'session')) return false;

  const session = await SessionModel.findById(
    get(decoded, 'session')
  );

  if (!session || !session.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  const accessToken = signJwt(
    { ...user, session: session._id },
    'accessTokenPrivateKey',
    { expiresIn: config.get('accessTokenTtl') } // 15 minutes
  );

  return accessToken;
}
