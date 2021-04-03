# Starting a greenfield project

Here I'm going to keep track of all the things I do to set this project up. Fascinating, I know.

1. Copy `docker-compose.yml` from a previous project and adapt for this one.
1. Copy top-level dot-files from previous projects.
1. Copy task-files from previous projects and adapt for this one.
1. Create `.env` file and set values.
1. **Commit** without having run anything.
1. Copy Node 14 `tsconfig.json` from [tsconfig/bases][1].
1. Start a Node.js container with `docker run -v $(pwd):/winterfell -it --rm alexgs99/node:2 zsh`.
1. Create `package.json` and install initial dependencies.
1. Create basic `index.ts` file for Express.
1. Initialize database.
1. Spin up Docker Compose stack and verify that server is working.
1. **Commit.**
1. Add task-file from Server service.
1. Copy ESLint and Prettier configs from previous projects and adapt for this one.

[1]: https://github.com/tsconfig/bases

## Other resources

- https://github.com/microsoft/TypeScript-Node-Starter
- https://github.com/jsynowiec/node-typescript-boilerplate
