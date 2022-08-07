import state from '../state';

export function findUserVote(votes) {
  if (!votes) {
    return;
  }

  return votes.find((vote) => vote.username === state.currentUser.username);
}