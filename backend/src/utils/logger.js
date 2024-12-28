const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  fg: {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m"
  }
};

const logger = {
  error: (msg) => console.log(`${colors.fg.red}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.fg.green}${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.fg.cyan}${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.fg.yellow}${msg}${colors.reset}`)
};

module.exports = logger;
