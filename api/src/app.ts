// app.ts
import { pipeline } from './middleware';

interface Context {
  [key: string]: any; // Yes, I Love semicolons.!!
};

const engine = pipeline<Context>( async (ctx, next) => {
  ctx.first = "First things First!!";
  next();
} );
engine.use( async (ctx, next) => {
  ctx.second = "I am the developer:";
  next();
} );
engine.use( async (ctx, next) => {
  ctx.third = "https://github.com/maximilianou";
  next();
} );

console.log('Running.. TypeScript app');

(async () => {
  const context: Context = {};
  await engine.execute(context);
  console.log(context);
})();

