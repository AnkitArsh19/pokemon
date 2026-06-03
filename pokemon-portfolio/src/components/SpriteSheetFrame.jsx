export default function SpriteSheetFrame({
  src,
  frame = 0,
  frameWidth = 18,
  frameHeight = 22,
  columns = 3,
  rows = 3,
  sourceX = 0,
  sourceY = 0,
  sourceWidth = null,
  sourceHeight = null,
  scale = 3,
  className = '',
  style = {},
}) {
  const safeFrame = Math.max(0, frame);
  const column = safeFrame % columns;
  const row = Math.floor(safeFrame / columns);
  const hasSourceRect = sourceWidth != null && sourceHeight != null;

  const actualWidth = hasSourceRect ? sourceWidth : frameWidth;
  const actualHeight = hasSourceRect ? sourceHeight : frameHeight;
  const actualSourceX = hasSourceRect ? sourceX : column * frameWidth;
  const actualSourceY = hasSourceRect ? sourceY : row * frameHeight;

  return (
    <span
      aria-hidden="true"
      className={`sprite-sheet-frame ${className}`.trim()}
      style={{
        display: 'inline-block',
        position: 'relative',
        overflow: 'hidden',
        width: `calc(${actualWidth}px * ${scale})`,
        height: `calc(${actualHeight}px * ${scale})`,
        ...style,
      }}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        style={{
          position: 'absolute',
          top: `calc(${-actualSourceY}px * ${scale})`,
          left: `calc(${-actualSourceX}px * ${scale})`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          imageRendering: 'pixelated',
          maxWidth: 'none',
          maxHeight: 'none',
        }}
      />
    </span>
  );
}