process.on('unhandledRejection', (err): void => {
  console.log('---------throwing error because of unhandled promise rejection-------');
  throw err;
});
