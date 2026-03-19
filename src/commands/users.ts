import {setUser} from 'src/config';
import {createUser, deleteUsers, getUserByName} from 'src/lib/db/queries/users';

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (!args?.length) {
    throw new Error('Please provide a username');
  }

  const username = args[0];
  const user = await getUserByName(username);
  if (!user) {
    throw new Error('User not found!');
  }
  setUser(args[0]);
  console.log('User set successfully');
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (!args?.length) {
    throw new Error('Please provide a username');
  }
  const username = args[0];

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
}

export async function handlerReset(cmdName: string, ...args: string[]) {
  await deleteUsers();
  console.log('Users deleted successfully');
}
