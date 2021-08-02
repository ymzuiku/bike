export const cache = {
  done: 0,
  before: null as Function,
  each: null as Function,
  it: {} as { [key: string]: Function },
  matchIt: {} as { [key: string]: Function },
  errors: {} as { [key: string]: Error },
};
