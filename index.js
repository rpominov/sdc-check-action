// References:
//
// https://github.com/NodeSecure/ci-action/blob/c93df9d7eaa9e799fed7e8f9396c42c95503df39/index.js
// https://github.com/mbalabash/sdc-check/blob/c88958963e8193c7554f599bab9fc5337f6813a1/src/cli.js

import core from "@actions/core";
import { check } from "sdc-check";

const directory = core.getInput("directory") ?? process.env.GITHUB_WORKSPACE;
// const strategy = core.getInput("strategy");
// const vulnerabilities = core.getInput("vulnerabilities");
// const warnings = core.getInput("warnings");
// const reporters = core.getInput("reporters");

try {
  const report = await check({ rootDir: directory });

  if (report.type === "none") {
    throw new Error("sdc-check internal error");
  }

  printErrorsInfo(report.errors, cliOptions);
  printWarningsInfo(report.warnings, cliOptions);

  if (report.type === "error") {
    core.setFailed("sdc-check has found errors");
  }
} catch (error) {
  core.setFailed(`[UNCAUGHT_ERROR]: ${error.message}`);
}

function printErrorsInfo(reportedItems) {
  if (reportedItems.length > 0) {
    console.error(`Errors: ${reportedItems.length}`);
    console.error(JSON.stringify(reportedItems, null, 2));
  } else {
    console.log("Errors: 0");
  }
}

function printWarningsInfo(reportedItems, cliOptions) {
  if (reportedItems.length > 0) {
    console.warn(`\nWarnings: ${reportedItems.length}`);
    console.warn(JSON.stringify(reportedItems, null, 2));
  } else {
    console.log("\nWarnings: 0");
  }
}
