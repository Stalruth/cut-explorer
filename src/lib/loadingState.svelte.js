let isLoading = $state(false);

export function startLoading() {
  isLoading = true;
}

export function stopLoading() {
  isLoading = false;
}

export function getLoading() {
  return isLoading;
}
