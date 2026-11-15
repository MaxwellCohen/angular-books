// Vercel function: delegates to the Express server built by `ng build` (node target).
let handler;

export default async function (req, res) {
  handler ??= (await import('../dist/angular-books/server/server.mjs')).reqHandler;
  return handler(req, res);
}
