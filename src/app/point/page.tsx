'use client';

import { useState, useCallback, useEffect, type MouseEvent } from 'react';
import { v4 as uuidV4 } from 'uuid';

type PointCoordinate = {
  id: string;
  x: number;
  y: number;
};

const PointPage = () => {
  const [points, setPoints] = useState<PointCoordinate[]>([]);
  const [pointsHistory, setPointsHistory] = useState<PointCoordinate[]>([]);

  function addPoint(event: MouseEvent<HTMLDivElement>) {
    setPoints((prevState) => [
      ...prevState,
      {
        id: uuidV4(),
        x: event.clientX,
        y: event.clientY - 78,
      },
    ]);
  }

  function undoLastPoint() {
    setPoints((prevState) => {
      const lastPointAdded = prevState.at(-1);

      if (lastPointAdded) {
        setPointsHistory((prevStatePointsHistory) => [
          ...prevStatePointsHistory,
          lastPointAdded,
        ]);
      }

      return [...prevState.filter((point) => point.id !== lastPointAdded?.id)];
    });
  }

  const undoLastPointKeyDown = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'z') {
        undoLastPoint();
      }
    },
    [],
  );

  function redoLastPoint() {
    setPoints((prevState) => {
      const lastPointRemoved = pointsHistory.at(-1);

      if (!lastPointRemoved) {
        return prevState;
      }

      setPointsHistory((prevStatePointHistory) => [
        ...prevStatePointHistory.filter(
          (pointHistory) => pointHistory.id !== lastPointRemoved.id,
        ),
      ]);

      return [...prevState, lastPointRemoved];
    });
  }

  function resetPoints() {
    setPoints([]);
  }

  useEffect(() => {
    window.addEventListener('keydown', undoLastPointKeyDown);

    return () => window.removeEventListener('keydown', undoLastPointKeyDown);
  }, [undoLastPointKeyDown]);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '3rem',
          gap: '10px',
          background: '#DDDDDD',
        }}
      >
        <button
          data-testid="undo-point"
          style={{
            width: '5rem',
            height: '2rem',
            borderRadius: '0.2rem',
            border: 'none',
            backgroundColor: '#7159c1',
            color: '#FFFFFF',
            cursor: 'pointer',
            pointerEvents: 'all',
          }}
          onClick={undoLastPoint}
        >
          Undo
        </button>

        <button
          data-testid="redo-point"
          style={{
            width: '5rem',
            height: '2rem',
            borderRadius: '0.2rem',
            border: 'none',
            backgroundColor: '#7159c1',
            color: '#FFFFFF',
            cursor: 'pointer',
          }}
          onClick={redoLastPoint}
        >
          Redo
        </button>

        <button
          data-testid="reset-button"
          style={{
            width: '5rem',
            height: '2rem',
            borderRadius: '0.2rem',
            border: 'none',
            backgroundColor: '#7159c1',
            color: '#FFFFFF',
            cursor: 'pointer',
          }}
          onClick={resetPoints}
        >
          Reset
        </button>
      </div>

      <div
        data-testid="points-container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          width: '100%',
          height: 'calc(100vh - 5rem)',
          backgroundColor: '#CCC',
        }}
        onMouseUp={addPoint}
      >
        {points.map((point, index) => (
          <div
            key={point.id}
            data-testid={`point-${index + 1}`}
            style={{
              position: 'absolute',
              width: '10px',
              height: '10px',
              top: point.y + 'px',
              left: point.x + 'px',
              backgroundColor: '#FF0000',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PointPage;
