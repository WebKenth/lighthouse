const fse = require('fs-extra');

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const reports = require('./reports.json');
const desktopConfig = require('./node_modules/lighthouse/lighthouse-core/config/lr-desktop-config.js');
const mobileConfig = require('./node_modules/lighthouse/lighthouse-core/config/lr-mobile-config.js');

const ora = require('ora');
const spinner = ora('Running');

let folder = process.argv.slice(2)[0] !== undefined ? process.argv.slice(2)[0] : '';

(async () => {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {
    output: 'html',
    onlyCategories: [
      'performance',
      'best-practices',
      'accessibility',
      'seo'
    ], 
    port: chrome.port
  };

  for(project of reports){
    console.log('Running lighthouse for project: '+project.name)
    for(report of project.reports){
      console.log(report);
      await runWithConfig(project.name, chrome, report, options, 'mobile', mobileConfig);
      await runWithConfig(project.name, chrome, report, options, 'desktop', desktopConfig);
    }
  }

  await chrome.kill();
})();

async function runWithConfig(project, chrome, report, options, type, config)
{
    spinner.start();
    const runnerResult = await lighthouse(report.url, options, config);
    const reportHtml = runnerResult.report;
    let fileName = report.name + '-' + type + '.html';
    if(folder !== '')
      folder = folder + '/';
    await fse.outputFile('reports/'+ project + '/'+ folder + fileName, reportHtml);
    
    spinner.stop();
    console.log('Report is done for',type, runnerResult.lhr.finalUrl);
    for(let categoryName in runnerResult.lhr.categories){
      let category = runnerResult.lhr.categories[categoryName];
      console.log(category.title + ' score was', category.score * 100);
    }
}