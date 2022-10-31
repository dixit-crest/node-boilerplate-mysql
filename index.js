const logger = require("./src/logs/logger");
const app = require("./src/utils/app");
const { PORT } = require("./src/utils/constants");


// app.listen(PORT, () => logger.info(`app listening on ${PORT}`));
app.listen(PORT, () => console.log(`app listening on ${PORT}`));
