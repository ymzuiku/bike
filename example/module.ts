export function module() {
  console.log('run in module');
  throw new Error('test throw check typescript sourcemap');
}
