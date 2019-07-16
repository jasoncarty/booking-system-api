import { dest, src } from 'gulp';

export default (cb: Function): void => {
  src('src/mailTemplates/*.pug').pipe(dest('dist/mailTemplates/'));
  src('.env-development').pipe(dest('dist'));
  src('.env-test').pipe(dest('dist'));
  cb();
};
