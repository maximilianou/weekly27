# weekly27
# Typescript !
## Middleware Pattern, Typescript Implementation from scratch.
To apply in:

- Front or
- Back or
- Automation Tool or
- Command Line Tool
- My I have to use Command Pattern and Interpreter Pattern Mixed with Middleware Pattern. 

Seems:

*Like the old Filters in java web*

*But widely spread over platforms*

*Like the old Template in C++ .. <T> ..*


#### Reference:
- https://dev.to/lcanady/make-a-typescript-middleware-engine-21kb


- app.ts
```ts
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
```

- middleware.js
```ts
// middleware.ts
export type Next = () => Promise<any> | any;
export type Middleware<T> = (
  context: T,
  next: Next
) => Promise<void>;
export type Pipe<T> = {
  use: (...middlewares: Middleware<T>[]) => void;
  execute: (context: T) => Promise<void | T>
};
export function pipeline<T>(...middlewares: Middleware<T>[])
                  : Pipe<T> {
  const stack: Middleware<T>[] = middlewares;
  const use: Pipe<T>["use"] = (...middlewares) => {
    stack.push(...middlewares);
  }
  const execute: Pipe<T>["execute"] = async (context) => {
    let prevIndex = -1;
    const handler = async (index: number, context: T)
            : Promise<void | T> => {
      if(index === prevIndex){
        throw new Error("next() already called");
      }
      if(index === stack.length ){
        return context;
      }
      prevIndex = index;
      const middleware = stack[index];
      if(middleware){
        await middleware( context, () => handler( index+1, context ) );
      }
    };
    const response = await handler(0, context);
    if (response){
      return response;
    } 
  };
  return { use, execute };
}
```

- Makefile
```
api:
	mkdir api && cd api && npm -y init
	cd api && npm i express-openapi-validator	
	cd api && npm i @types/node typescript 
	cd api && npm install ts-node -D
	cd api &&  ./node_modules/.bin/tsc --init --rootDir src --outDir ./build --esModuleInterop --lib esnext --module esnext --noImplicitAny true
	cd api && mkdir src
	cd api && echo "console.log('Running.. TypeScript app')" > src/app.ts
	cd api && ./node_modules/.bin/tsc
	cd api && node ./build/app.js
```


- package.json
```json
{
  "name": "api",
  "version": "1.0.0",
  "description": "",
  "main": "app.ts",
  "scripts": {
    "build":"./node_modules/.bin/tsc ",
    "start":"node ./build/app.js",
    "dev":  "./node_modules/.bin/ts-node ./src/app.ts",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@types/node": "^14.14.22",
    "express-openapi-validator": "^4.10.9",
    "typescript": "^4.1.3"
  },
  "devDependencies": {
    "ts-node": "^9.1.1"
  }
}
```

- tsconfig.json
```json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    /* Basic Options */
    // "incremental": true,                   /* Enable incremental compilation */
    "target": "es5",                          /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */
    "module": "commonjs",                       /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    "lib": ["esnext"],                        /* Specify library files to be included in the compilation. */
    // "allowJs": true,                       /* Allow javascript files to be compiled. */
    // "checkJs": true,                       /* Report errors in .js files. */
    // "jsx": "preserve",                     /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
    // "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
    // "sourceMap": true,                     /* Generates corresponding '.map' file. */
    // "outFile": "./",                       /* Concatenate and emit output to single file. */
    "outDir": "./build",                      /* Redirect output structure to the directory. */
    "rootDir": "src",                         /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    // "composite": true,                     /* Enable project compilation */
    // "tsBuildInfoFile": "./",               /* Specify file to store incremental compilation information */
    // "removeComments": true,                /* Do not emit comments to output. */
    // "noEmit": true,                        /* Do not emit outputs. */
    // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

    /* Strict Type-Checking Options */
    "strict": true,                           /* Enable all strict type-checking options. */
    "noImplicitAny": true,                    /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,              /* Enable strict null checks. */
    // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
    // "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */

    /* Additional Checks */
    // "noUnusedLocals": true,                /* Report errors on unused locals. */
    // "noUnusedParameters": true,            /* Report errors on unused parameters. */
    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */
    // "noUncheckedIndexedAccess": true,      /* Include 'undefined' in index signature results */

    /* Module Resolution Options */
    "moduleResolution": "node",            /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    "baseUrl": "./",                       /* Base directory to resolve non-absolute module names. */
    "paths": {
      "@exmpl/*": ["src/*","build/*"]
    },                           /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                       /* List of folders to include type definitions from. */
    // "types": [],                           /* Type declaration files to be included in compilation. */
    // "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true,                  /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */
    // "allowUmdGlobalAccess": true,          /* Allow accessing UMD globals from modules. */

    /* Source Map Options */
    // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

    /* Experimental Options */
    // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */

    /* Advanced Options */
    "skipLibCheck": true,                     /* Skip type checking of declaration files. */
    "forceConsistentCasingInFileNames": true  /* Disallow inconsistently-cased references to the same file. */
  }
}
```

- Result
```
$ npm run dev

> api@1.0.0 dev /home/maximilianou/projects/weekly27/api
> ts-node ./src/app.ts

Running.. TypeScript app
{
  first: 'First things First!!',
  second: 'I am the developer:',
  third: 'https://github.com/maximilianou'
}
```
