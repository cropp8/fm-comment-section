import { makeRequest } from '../api';
import state from '../state';

export function getCurrentUser() {
  return makeRequest('currentUser.json').then(data => {
    state.currentUser = data;
  });
}