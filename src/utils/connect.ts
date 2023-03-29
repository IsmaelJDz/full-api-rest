import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';

async function connect() {
  const dbUri = config.get<string>('dbUri');

  /** with promise */
  // return mongoose
  //   .connect(dbUri)
  //   .then(() => console.log('Connected to MongoDB'))
  //   .catch(err => {
  //     console.error(err);
  //     process.exit(1);
  //   });

  try {
    await mongoose.connect(dbUri);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

export default connect;
