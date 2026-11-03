import { useRef } from 'react';

export default function SummerScene() {
  const artRef = useRef(null);

  const handlePointerMove = (event) => {
    if (event.pointerType === 'touch') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const host = artRef.current;
    if (!host) return;

    const rect = host.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    host.style.setProperty('--rx', `${-py * 7}deg`);
    host.style.setProperty('--ry', `${px * 9}deg`);
  };

  const handlePointerLeave = () => {
    const host = artRef.current;
    if (!host) return;

    host.style.setProperty('--rx', '0deg');
    host.style.setProperty('--ry', '0deg');
  };

  return (
    <div
      className="art"
      ref={artRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-hidden="true"
    >
      <span className="art__sun" />
      <span className="art__horizon" />

      <div className="art__float">
        <div className="art__card">
          <div className="art__card-inner">
            <div className="art__card-top">
              <span className="art__brand">Bookmark Manager</span>
              <span className="art__vip">VIP</span>
            </div>

            <div className="art__card-body">
              <span className="art__monogram">B</span>
              <span className="art__title">
                The Summer
                <em>Edit</em>
              </span>
            </div>

            <div className="art__card-foot">
              <span>No. 026</span>
              <span>MMXXVI</span>
            </div>
          </div>
        </div>
      </div>

      <span className="art__caption">VIP members’ edition</span>
    </div>
  );
}
