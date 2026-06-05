import React, { useEffect } from 'react';

const FioCondutor: React.FC = () => {
  useEffect(() => {
    const no = document.getElementById('fio-no');
    if (!no) return;
    const onScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      const top = 62 + pct * (window.innerHeight - 124);
      no.style.top = top + 'px';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="fio" aria-hidden="true" />
      <div className="fio-no" id="fio-no" aria-hidden="true" />
    </>
  );
};

export { FioCondutor };
export default FioCondutor;
