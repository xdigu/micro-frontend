import { useEffect, useRef } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.crossOrigin = 'anonymous';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function waitForGlobal(name, timeout = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function check() {
      if (window[name] && window[name].mount) {
        resolve(window[name]);
      } else if (Date.now() - start > timeout) {
        reject(new Error(`Timeout waiting for ${name}. Check that the MFE server is running.`));
      } else {
        setTimeout(check, 200);
      }
    }
    check();
  });
}

export default function Home() {
  const mfe1Ref = useRef(null);
  const mfe2Ref = useRef(null);

  useEffect(() => {
    let mfe1Unmount, mfe2Unmount;

    async function loadMfes() {
      try {
        console.log('[Host] Loading MFE scripts...');
        await loadScript('http://localhost:3001/main.js');
        console.log('[Host] MFE1 main.js loaded, waiting for global...');
        const mfe1 = await waitForGlobal('mfe1_react');
        console.log('[Host] MFE1 ready:', mfe1);

        await loadScript('http://localhost:3002/styles.js');
        await loadScript('http://localhost:3002/main.js');
        console.log('[Host] MFE2 main.js loaded, waiting for global...');
        const mfe2 = await waitForGlobal('mfe2_angular');
        console.log('[Host] MFE2 ready:', mfe2);

        if (mfe1Ref.current && mfe1.mount) {
          console.log('[Host] Mounting MFE1...');
          await mfe1.mount(mfe1Ref.current);
          mfe1Unmount = mfe1.unmount;
          console.log('[Host] MFE1 mounted');
        }
        if (mfe2Ref.current && mfe2.mount) {
          console.log('[Host] Mounting MFE2...');
          await mfe2.mount(mfe2Ref.current);
          mfe2Unmount = mfe2.unmount;
          console.log('[Host] MFE2 mounted');
        }
      } catch (err) {
        console.error('[Host] Failed to load MFEs:', err);
      }
    }

    loadMfes();

    return () => {
      if (mfe1Unmount && mfe1Ref.current) mfe1Unmount(mfe1Ref.current);
      if (mfe2Unmount && mfe2Ref.current) mfe2Unmount(mfe2Ref.current);
    };
  }, []);

  return (
    <div className={styles.page}>
      <Head>
        <title>Host — Module Federation POC (Next.js)</title>
      </Head>

      <header className={styles.header}>
        <h1>Micro Frontend Host</h1>
        <p>Module Federation POC — Next.js Shell (React + Angular)</p>
      </header>

      <div className={styles.crossMessage}>
        <strong>Cross-MFE Communication:</strong> Click a button in one MFE to send a message to the other
      </div>

      <div className={styles.mfeContainer}>
        <div ref={mfe1Ref} className={styles.mfeBox} />
        <div ref={mfe2Ref} className={styles.mfeBox} />
      </div>
    </div>
  );
}
