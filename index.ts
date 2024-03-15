import EnvConstants from './constants/env.constant';
import DBCONNECT from './database';
import CreateServer from './utils/server';

const PORT = EnvConstants.PORT;
const APP = CreateServer();

DBCONNECT(() => {
  APP.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}⚡`);
  });
});
