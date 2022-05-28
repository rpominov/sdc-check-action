// References:
//
// https://github.com/NodeSecure/ci-action/blob/c93df9d7eaa9e799fed7e8f9396c42c95503df39/index.js
// https://github.com/mbalabash/sdc-check/blob/c88958963e8193c7554f599bab9fc5337f6813a1/src/cli.js

import core from "@actions/core";
import { check } from "sdc-check";

const root =
  core.getInput("root") == null || core.getInput("root") === ""
    ? process.env.GITHUB_WORKSPACE
    : core.getInput("root");

try {
  const report = await check({ rootDir: root });

  if (report.type === "none") {
    core.setFailed("Internal error");
  } else {
    printErrorsInfo(report.errors);
    printWarningsInfo(report.warnings);

    if (report.type === "error") {
      core.setFailed("Errors found");
    }
  }
} catch (error) {
  console.error(error);
  core.setFailed(error.message ?? "No message");
}

function printErrorsInfo(reportedItems) {
  if (reportedItems.length > 0) {
    console.error(`Errors: ${reportedItems.length}`);
    console.error(JSON.stringify(reportedItems, null, 2));
  } else {
    core.info("Errors: 0");
  }
}

function printWarningsInfo(reportedItems) {
  if (reportedItems.length > 0) {
    reportedItems.forEach(item => {
      core.warning(`${item.package}: ${item.message}`);
    })
    // console.warn(`\nWarnings: ${reportedItems.length}`);
    // console.warn(JSON.stringify(reportedItems, null, 2));
  } else {
    core.info("\nWarnings: 0");
  }
}
