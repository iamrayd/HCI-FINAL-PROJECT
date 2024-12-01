import app from './app.js';
import config from './config/app.js'


app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

