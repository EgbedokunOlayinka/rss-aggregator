import fs from 'fs';
import path from 'path';
import os from 'os';

type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function setUser(username: string) {
  const config = readConfig();
  if (!config) {
    return console.log('Invalid config provided!');
  }

  config.currentUserName = username;
  writeConfig(config);
}

export function readConfig(): Config | undefined {
  const filePath = getConfigFilePath();
  if (filePath) {
    try {
      const file = fs.readFileSync(filePath, 'utf8');
      const validatedConfig = validateConfig(JSON.parse(file));
      if (!validatedConfig) {
        console.log('Invalid config provided!');
        return;
      }
      return validatedConfig;
    } catch (e) {
      console.error(e);
    }
  }
}

function writeConfig(cfg: Config): void {
  const configFilePath = getConfigFilePath();
  if (!configFilePath) {
    console.log('Config not found');
    return;
  }

  try {
    const jsonString = JSON.stringify(
      {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName,
      },
      null,
      2,
    );
    fs.writeFileSync(configFilePath, jsonString, {encoding: 'utf-8'});
  } catch (err) {
    console.error(err);
  }
}

function getConfigFilePath() {
  try {
    return path.join(os.homedir(), '.gatorconfig.json');
  } catch (e) {
    console.error(e);
  }
}

function validateConfig(rawConfig: any): Config | undefined {
  try {
    if (
      !rawConfig ||
      typeof rawConfig !== 'object' ||
      Array.isArray(rawConfig)
    ) {
      return;
    }

    const requiredKeys = ['db_url', 'current_user_name'];
    if (!requiredKeys.some(key => Object.hasOwn(rawConfig, key))) {
      return;
    }

    return {
      dbUrl: rawConfig?.db_url || '',
      currentUserName: rawConfig?.current_user_name || '',
    };
  } catch (e) {
    console.error(e);
  }
}

readConfig();
