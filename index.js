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
    const byPackage = new Map()

    reportedItems.forEach(item => {
      const cur = byPackage.has(item.package) ?  byPackage.get(item.package) : []
      byPackage.set(item.package, cur.concat([item.metric]))

      core.error(`${item.metric} in ${item.package}: ${item.message}`);
    })

    core.info("")
    core.info("To suppress all errors, add the following to .sdccheckignore:")
    byPackage.forEach((val, key) => {
      core.info(`${key} | ${val.join(', ')}`)
    })
    core.info("")
  } else {
    core.info("No errors");
    core.info("")
  }
}

function printWarningsInfo(reportedItems) {
  if (reportedItems.length > 0) {
    const byPackage = new Map()

    reportedItems.forEach(item => {
      const cur = byPackage.has(item.package) ?  byPackage.get(item.package) : []
      byPackage.set(item.package, cur.concat([item.metric]))

      core.warning(`${item.metric} in ${item.package}: ${item.message}`);
    })

    core.info("")
    core.info("To suppress all warnings, add the following to .sdccheckignore:")
    byPackage.forEach((val, key) => {
      core.info(`${key} | ${val.join(', ')}`)
    })
    core.info("")
  } else {
    core.info("No warnings");
    core.info("")
  }
}
