import {
  CommandsRegistry,
  handlerLogin,
  handlerRegister,
  registerCommand,
  runCommand,
} from './commands';

async function main() {
  const commands: CommandsRegistry = {};

  registerCommand(commands, 'login', handlerLogin);
  registerCommand(commands, 'register', handlerRegister);

  const args = process.argv.slice(2);
  if (!args.length) {
    console.log('Not enough arguments provided');
    process.exit(1);
  }

  await runCommand(commands, args[0], ...args.slice(1));
  process.exit(0);
}

main();
