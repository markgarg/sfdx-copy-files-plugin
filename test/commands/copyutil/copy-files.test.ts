import { expect, test } from '@salesforce/command/lib/test';
import { readdir } from 'fs';

describe('copyutil:copy-files', () => {
  const sourcedir = 'test/fixtures/source';
  const targetdir = 'test/fixtures/target';

  test
    .command(['copyutil:copy-files', '--sourcedir', sourcedir, '--targetdir', targetdir])
    .it(`runs copyutil:copy-files --sourcedir ${sourcedir} --targetdir ${targetdir}`, ctx => {
      readdir(sourcedir, (err, srcfiles) => {
        expect(srcfiles).to.include('a.txt');
        expect(srcfiles).to.include('b.txt');
      });

      readdir(targetdir, (err, targetfiles) => {
        expect(targetfiles).to.include('a.txt');
        expect(targetfiles).to.include('b.txt');
      });
    });
});
