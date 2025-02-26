import { config } from 'dotenv';
import { initServer } from './configs/server.js'
import { initializeAdmin } from './configs/initialize.js'

initializeAdmin();
config();
initServer();