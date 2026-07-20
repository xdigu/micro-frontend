import('./bootstrap').then(() => {
  import('./mount').then((mod) => {
    if (typeof window !== 'undefined') {
      window.mfe1_react = { mount: mod.mount, unmount: mod.unmount };
    }
  });
});
