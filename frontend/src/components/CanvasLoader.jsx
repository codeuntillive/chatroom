import { useProgress, Html } from "@react-three/drei";

export const CanvasLoader = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <div style={{
        color: 'white',
        fontSize: '1.5rem',
        fontFamily: 'monospace',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '1rem 2rem',
        borderRadius: '10px'
      }}>
        {progress !== 0 ? `${progress.toFixed(2)}%` : "Loading..."}
      </div>
    </Html>
  );
};
