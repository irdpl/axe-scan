// run: Run the accessibility test

import { AxePuppeteer } from '@axe-core/puppeteer';
import axe from 'axe-core';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import puppeteer from 'puppeteer';

// import { AxeScanError } from '../axe-scan-error';
import {
  VERSION,
  ConfigValue,
  REPORT_HEADER,
  ReportRowValue,
} from '../constants.js';
import { MessageLocalization, setAxeLocalization } from '../messages.js';
import { getConfig, spinner } from '../utils.js';

interface CommandOption {
  readonly file?: string;
  readonly whitelist?: string;
}
interface PartialAxeResults {
  passes: axe.Result[];
  violations: axe.Result[];
  incomplete: axe.Result[];
  inapplicable: axe.Result[];
}
const config: ConfigValue = getConfig();
const localizedMessage = new MessageLocalization(config.locale);
const axeConfig: axe.Spec = {
  locale: setAxeLocalization(config.locale),
};

/**
 * Run the accessibility test and returns the results as a standard output.
 * @param {string} options.file File path to the text file containing the list of URLs.
 * @param {string} options.whitelist File path to the CSV file containing the list of whitelisted alerts to be ommited from the output.
 */
export default async function (options: CommandOption): Promise<void> {
  // Start spinner
  spinner.start(localizedMessage.message.INFO_RUNNING);

  const filePath: string = options?.file ? options.file : config.filePath;
  const urls: string[] = fs
    .readFileSync(filePath /*, { encoding: config.encoding }*/)
    .toString()
    .replace(/\r?\n/g, ',')
    .split(',');

  // Optional whitelisted items
  const whitelist: ReportRowValue[] | undefined = options?.whitelist
    ? parse(fs.readFileSync(options.whitelist), { columns: true })
    : undefined;

  const browser: puppeteer.Browser = await puppeteer.launch();

  let outputText: string = REPORT_HEADER.join();
  for (let i = 0; i < urls.length; i++) {
    const url: string = urls[i];
    const page: puppeteer.Page = await browser.newPage();
    await page.setBypassCSP(true);
    /* Emulate device: left here as a potential option for the future
      await page.emulate(puppeteer.devices['iPhone 8']);
      */

    // Read the web page
    await Promise.all([
      page.setDefaultNavigationTimeout(0),
      page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] }),
      page.goto(`${url}`),
    ]);
    // Execute accessibility test
    const results: axe.AxeResults = await new AxePuppeteer(page)
      .configure(axeConfig)
      .withTags(config.axeCoreTags)
      .analyze();
    config.resultTypes.forEach((resultType: string) => {
      results[resultType as keyof PartialAxeResults].forEach(
        (resultItem: axe.Result) => {
          resultItem.nodes.forEach((node: axe.NodeResult) => {
            node.any.forEach((a: axe.CheckResult) => {
              // Rule Set
              const ruleSet: string = resultItem.tags
                .filter((tag: string) => config.axeCoreTags.includes(tag))
                .join();
              // DOM Element
              const domElement: string = node.target.join();
              // WCAG Criteria
              const wcagCriteria: string = resultItem.tags
                .reduce((arr: string[], tag: string) => {
                  if (tag.match(/^wcag\d{3}$/)) {
                    arr.push(
                      [
                        tag.slice(-3, -2),
                        tag.slice(-2, -1),
                        tag.slice(-1),
                      ].join('.')
                    );
                  }
                  return arr;
                }, [])
                .join(' ');
              if (
                whitelist &&
                whitelist.some(
                  (row: ReportRowValue) =>
                    row.URL == results.url &&
                    row['Rule Type'] == resultItem.id &&
                    row['Result Type'] == resultType &&
                    row['Rule Set'] == ruleSet &&
                    row['Impact'] == resultItem.impact &&
                    row['HTML Element'] == node.html &&
                    row['DOM Element'] == domElement &&
                    row['WCAG Criteria'] == wcagCriteria
                )
              ) {
                return;
              } else {
                const outputRow: string = [
                  // Corresponds with the columns of REPORT_HEADER
                  results.url, // URL
                  resultItem.id, // Rule Type
                  resultType, // Result Type
                  ruleSet, // Rule Set
                  resultItem.impact, // Impact
                  a.message, // Message
                  node.html, // HTML Element
                  domElement, // DOM Element
                  resultItem.help, // Help
                  resultItem.helpUrl, // Help URL
                  wcagCriteria, // WCAG Criteria,
                  VERSION, // axe-scan version
                ]
                  .map((value) =>
                    String(value)
                      .replace(/,/g, '-')
                      .replace(/(\n|\r|\r\n)/gm, ' ')
                  )
                  .join();
                outputText += `\n${outputRow}`;
              }
            });
          });
        }
      );
    });
    await page.close();
  }
  await browser.close();
  console.info(outputText);
}
