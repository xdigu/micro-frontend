import('./bootstrap').then(() => {
  import('./app/mount').then((mod) => {
    if (typeof window !== 'undefined') {
      (window as any).mfe2_angular = { mount: mod.mount, unmount: mod.unmount };
    }
  });
}).catch((err) => console.error(err));
