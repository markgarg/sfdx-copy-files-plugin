import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { fs } from '@salesforce/core/lib/util/fs';
import * as fsLib from 'fs';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-copy-files-plugin', 'copy-files');

export default class CopyFiles extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
  `$ sfdx devutil:copy-files --sourcedir config/customMetadata --targetdir force-app/main/default/customMetadata
  Copying files from dir/source to dir/target
  Copying a.json...
  Copying b.txt...
  Copied 2 files
  `
  ];

  protected static flagsConfig = {
    // flag with a value (-f, --sourcedir=VALUE)
    sourcedir: flags.string({char: 's', description: messages.getMessage('sourcedirDescription')}),
    // flag with a value (-t, --targetdir=VALUE)
    targetdir: flags.string({char: 't', description: messages.getMessage('targetdirDescription')}),
  };

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
    const sourcedir = this.flags.sourcedir;
    const targetdir = this.flags.targetdir;

    const outputString = `Copying files from ${sourcedir} to ${targetdir}`;
    this.ux.log(outputString);
    const files = await fs.readdir(sourcedir);
    for(let fileName of files) {
      this.ux.log(`Copying ${fileName}...`);
      fsLib.copyFileSync(`${sourcedir}/${fileName}`, `${targetdir}/${fileName}`);
    }
    this.ux.log(`Copied ${files.length} files`);

    // Return an object to be displayed with --json
    return { outputString };
  }
}
