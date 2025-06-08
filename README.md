# Cmdesk

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.14.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Deployment

### Production Build

To create a production build of the application, run:

```bash
npm run build:prod
```

This will create optimized production files in the `dist/cmdesk/browser` directory.

### Local Production Server

To test the production build locally:

```bash
npm run serve:prod
```

This will serve the production build at `http://localhost:8080`.

### Docker Deployment

The application can be deployed using Docker:

1. Build the Docker image:
```bash
npm run docker:build
```

2. Run the Docker container:
```bash
npm run docker:run
```

The application will be available at `http://localhost:8080`.

### Server Configuration

For production deployments:

1. Ensure all requests are redirected to index.html (for client-side routing)
2. Configure proper cache headers for static assets
3. Enable GZIP compression
4. Set up HTTPS
5. Configure CORS if needed

The repository includes:
- `web.config` for IIS deployments
- `nginx.conf` for Nginx deployments

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
