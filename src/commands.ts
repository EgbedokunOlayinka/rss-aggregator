import {setUser} from './config';
import {createUser, getUserByName} from './lib/db/queries/users';

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}

export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  return await registry[cmdName](cmdName, ...args);
}

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (!args?.length) {
    throw new Error('Please provide a username');
  }
  try {
    const username = args[0];
    const user = await getUserByName(username);
    if (!user) {
      throw new Error('User not found!');
    }
    setUser(args[0]);
    console.log('User set successfully');
  } catch (error) {
    console.log(error);
  }
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (!args?.length) {
    throw new Error('Please provide a username');
  }
  const username = args[0];
  try {
    const userExists = await getUserByName(username);
    if (userExists) {
      throw new Error('User already exists!');
    }
    const res = await createUser(username);
    if (!res) {
      throw new Error('An error occurred while registering user');
    }
    setUser(username);
    console.log('User created!');
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}
