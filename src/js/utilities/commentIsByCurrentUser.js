import state from '../state';

export function commentIsByCurrentUser(username) {
  if (!username) {
    return;
  }

  return username === state.currentUser.username;
}