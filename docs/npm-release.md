# First npm release

## Current status

Version 0.1.0 was published as [`@rakeshvetal/calculator-resources`](https://www.npmjs.com/package/@rakeshvetal/calculator-resources) on 2026-11-05, authenticated as `rakeshvetal`. The registry release was installed in a fresh temporary project; all seven exports and zero-baseline validation passed. Its registry tarball SHA-1 matches the validated local tarball: `2f9b95efe6af7b93e224819a5f29539424adc03c`.

The first publication was accepted before the registry made it available. Do not republish or change the version merely because initial reads return 404 during processing. Verify registry availability before advertising a new release.

## Validate locally

From `javascript/`:

```sh
npm ci
npm run check
npm test
npm pack --dry-run
npm pack --pack-destination ../dist
```

Create `dist/` first. The tarball should contain only `package.json`, `README.md`, `LICENSE`, and `src/index.js`. The package README must describe the installed API and its limitations.

Install that tarball into a temporary empty project and test all seven exports using the package name. Do not rely solely on imports from the source checkout. The prepack check runs in the source repository, not in the installed package.

The automated installed-package check is `npm run test:package` from `javascript/` after packing. It installs the local tarball into a fresh temporary directory, checks the seven exported functions and verifies that the license is included.

## Publish after ownership and authentication

1. Run `npm login` interactively, then `npm whoami`. Never commit npm tokens or paste credentials into a chat.
2. Confirm the signed-in account is `rakeshvetal`, matching the package scope. If the name changes, update package.json, package-lock.json, README imports, tutorial imports and smoke-test imports together.
3. Check the registry for the package/version to avoid overwriting an existing release. Version 0.1.0 is intended for the first publication only.
4. Replace the package README's pre-release installation paragraph with `npm install <confirmed-package-name>`, then rebuild and recheck the tarball.
5. From `javascript/`, run `npm publish --access public`. Complete any account verification or second-factor prompt directly with npm.
6. Verify the npm page, README, license, homepage and repository links. Install the registry release in an empty project and repeat the smoke test.
7. Record the verified release URL and version. Only then update the root README with registry installation instructions and publish the DEV tutorial with the confirmed name.

The homepage points to Calxo.ai; the package README includes contextual examples. No automated publishing workflow or credentials are required for this first manual release.
