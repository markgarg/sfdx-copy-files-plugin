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
  `$ sfdx devutil:copy-files --fromdir config/customMetadata --todir force-app/main/default/customMetadata
  Copying files from dir/source to dir/target
  Copying a.json...
  Copying b.txt...
  Copied 2 files
  `
  ];

  protected static flagsConfig = {
    // flag with a value (-f, --fromdir=VALUE)
    fromdir: flags.string({char: 'f', description: messages.getMessage('fromdirDescription')}),
    // flag with a value (-t, --todir=VALUE)
    todir: flags.string({char: 't', description: messages.getMessage('todirDescription')}),
  };

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
    const fromdir = this.flags.fromdir;
    const todir = this.flags.todir;

    const outputString = `Copying files from ${fromdir} to ${todir}`;
    this.ux.log(outputString);
    const files = await fs.readdir(fromdir);
    for(let fileName of files) {
      this.ux.log(`Copying ${fileName}...`);
      fsLib.copyFileSync(`${fromdir}/${fileName}`, `${todir}/${fileName}`);
    }
    this.ux.log(`Copied ${files.length} files`);

    // Return an object to be displayed with --json
    return { outputString };
  }
}
