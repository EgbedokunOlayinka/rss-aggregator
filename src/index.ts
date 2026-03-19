import {
  CommandsRegistry,
  registerCommand,
  runCommand,
} from './commands/commands';
import {handlerLogin, handlerRegister, handlerReset} from './commands/users';

async function main() {
  const commands: CommandsRegistry = {};

  registerCommand(commands, 'login', handlerLogin);
  registerCommand(commands, 'register', handlerRegister);
  registerCommand(commands, 'reset', handlerReset);

  const args = process.argv.slice(2);
  if (!args.length) {
    console.log('Not enough arguments provided');
    process.exit(1);
  }

  try {
    await runCommand(commands, args[0], ...args.slice(1));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
