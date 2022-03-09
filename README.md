# Introduction
This repository contains sample code that  illustrates how to build code in many different languages
such as Go, Rust, Haskell, Erlang, VS, Java, Python, Perl, Node etc. and how to run those programs or
run tests with the build frameworks such as Maven or VSTest.

Start with the file <tt>.pipelines\pipeline.user.windows.yml</tt> that is the entry point for CDPX a.k.a Project Endor.
The OneBranch cross-platform pipeline (CDPX a.k.a Project Endor) will load this file first and use it to execute your
build. Any governance/compliance actions such as static analysis, malware scanning, binary scanning, signing are
interleaved transparently by Endor without any additional work on your part.

## Unit tests

Unit tests should be written with [Jest](https://jestjs.io/docs/en/getting-started.html). Jest tests are named using the convention `<ModuleName>.test.ts`. To run these unit tests, use `npm run test` or `npm run watch` (which will stay active and "watch" for updates to your test files).

### Structure of the tests folder
Introduce [Rewire](https://www.npmjs.com/package/rewire) npm package to inspect non-exported modules/namespaces. Since the current version of rewire is only compatible with CommonJS modules, for testing purposes, the inspected module will be "rewired" from the generated integrated JS file instead of the typescript file where it is located. However, in order to keep the test cases more organized, we will keep the path of the `<ModuleName>.test.ts` files structured as `<ModuleName>.ts`. For example, the path of the file `Utils.ts` is `CRM.Omnichannel.ProductivityTools\solutions\ProductivityPaneComponent\Client\ProductivityPaneLoader\Utilities\Utils.ts`, then the path of its test file should be `CRM.Omnichannel.ProductivityTools\tests\solutions\ProductivityPaneComponent\Client\ProductivityPaneLoader\Utilities\Utils.test.ts`.
