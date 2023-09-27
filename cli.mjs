import { Command } from 'commander';

// Initialize CLI options and arguments
export function getOptions() {
  const program = new Command();
  program
    .version('1.0.0')
    .description('CLI tool for translating Notion pages using DeepL API')
    .option('-u, --url <url>', 'URL of the Notion page to translate')
    .option('-f, --from <language>', 'Source language code')
    .option('-t, --to <language>', 'Target language code')
    .option('--notion-token <token>', 'Notion API token')
    .option('--deepl-token <token>', 'DeepL API token')
    .parse(process.argv);

  const options = program.opts();
  return options;
}
