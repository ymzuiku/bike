export const cache = {
  done: 0,
  each: null as Function,
  before: null as Function,
  it: {} as { [key: string]: Function },
  matchIt: {} as { [key: string]: Function },
  errors: {} as { [key: string]: Error },
};
