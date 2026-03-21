import React, {forwardRef, useImperativeHandle} from 'react';
import {NextReactP5Wrapper} from '@p5-wrapper/next';
import {type P5CanvasInstance, type SketchProps} from '@p5-wrapper/react';
import type p5Types from 'p5';
import useLegacyEffect from '@/hooks/use-legacy-effect';

type ObjectType = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  xspeed: number;
  yspeed: number;
  div: p5Types.Element;
};

type RectangleType = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type BouncingItemsBackgroundInstance = {
  getP5Instance: () => p5Types;
  getObjects: () => ObjectType[];
  createNewObject: (div: p5Types.Element) => void;
  removeObject: (id: string) => void;
  resizeObjectById: (id: string) => void;
};

let p5Instance: p5Types;
let objects: ObjectType[] = [];
let resizes = 0;
let showCenterArea = false;

type CustomSketchProps = SketchProps & {
  rotation: number;
};

const sketch = (p5: P5CanvasInstance<CustomSketchProps>) => {
  p5Instance = p5;

  p5.setup = () => {
    const canvasWidth = p5.windowWidth;
    const canvasHeight = p5.windowHeight;
    p5.createCanvas(canvasWidth, canvasHeight);
  };

  p5.updateWithProps = (props) => {
    if (typeof props.showCenterArea === 'boolean') {
      showCenterArea = props.showCenterArea;
    }
  };

  p5.draw = () => {
    let rectWidth;
    let rectHeight;
    let rectX;
    let rectY;
    if (showCenterArea) {
      // invisible rectangle
      p5.fill(100, 100, 200, 0);
      // Define the size of the rectangle
      rectWidth = 400;
      rectHeight = 504;

      // Calculate the center of the canvas
      const canvasCenterX = p5.width / 2;
      const canvasCenterY = p5.height / 2;

      // Calculate the position to draw the rectangle such that it is centered on the canvas
      rectX = canvasCenterX - rectWidth / 2;
      rectY = canvasCenterY - rectHeight / 2 + 40;

      // Draw the rectangle
      p5.noStroke();
      p5.rect(rectX, rectY, rectWidth, rectHeight);
    }

    for (const object of objects) {
      object.w = object.div.width;
      object.h = object.div.height;

      object.x += object.xspeed;
      object.y += object.yspeed;
      object.div.position(object.x, object.y);

      for (const other of objects) {
        if (object !== other && isColliding(object, other)) {
          handleCollision(object, other);
        }
      }

      if (object.x + object.w >= p5.width || object.x <= 0) {
        object.xspeed *= -1;
        object.x = p5.constrain(object.x, 0, p5.width - object.w);
      }

      if (object.y + object.h >= p5.height || object.y <= 0) {
        object.yspeed *= -1;
        object.y = p5.constrain(object.y, 0, p5.height - object.h);
      }

      if (
        showCenterArea &&
        isColliding(object, {
          x: rectX ?? p5.width / 4,
          y: rectY ?? p5.height / 4,
          w: rectWidth ?? p5.width / 2,
          h: rectHeight ?? p5.height / 2,
        } as RectangleType)
      ) {
        handleCollision(object, {
          x: rectX ?? p5.width / 4,
          y: rectY ?? p5.height / 4,
          w: rectWidth ?? p5.width / 2,
          h: rectHeight ?? p5.height / 2,
        } as RectangleType);
      }
    }
  };
};

const findNonCollidingPosition = (width: number, height: number) => {
  const maxAttempts = 1000; // Maximum number of attempts to find a non-colliding position
  let attempts = 0;

  while (attempts < maxAttempts) {
    const x = p5Instance.random(
      p5Instance.width / 4,
      (3 * p5Instance.width) / 4,
    );
    const y = p5Instance.random(
      p5Instance.height / 4,
      (3 * p5Instance.height) / 4,
    );

    const collidesWithExistingObject = objects.some((object) =>
      isColliding(
        {x, y, w: width, h: height},
        {x: object.x, y: object.y, w: object.w, h: object.h},
      ),
    );

    if (!collidesWithExistingObject) {
      return {x, y};
    }

    attempts += 1;
  }

  // If a non-colliding position cannot be found after maxAttempts, return a default position
  return {x: p5Instance.width / 2, y: p5Instance.height / 2};
};

const adjustPositionAfterResize = (object: ObjectType) => {
  for (const other of objects) {
    if (object !== other && isColliding(object, other)) {
      handleCollision(object, other);
    }
  }

  if (object.x + object.w > p5Instance.width) {
    object.x = p5Instance.width - object.w;
  }

  if (object.x < 0) {
    object.x = 0;
  }

  if (object.y + object.h > p5Instance.height) {
    object.y = p5Instance.height - object.h;
  }

  if (object.y < 0) {
    object.y = 0;
  }

  if (
    showCenterArea &&
    isColliding(object, {
      x: p5Instance.width / 4,
      y: p5Instance.height / 4,
      w: p5Instance.width / 2,
      h: p5Instance.height / 2,
    } as RectangleType)
  ) {
    handleCollision(object, {
      x: p5Instance.width / 4,
      y: p5Instance.height / 4,
      w: p5Instance.width / 2,
      h: p5Instance.height / 2,
    } as RectangleType);
  }
};

const resizeAllObjects = (factor: number) => {
  for (const object of objects) {
    console.log(
      'resize from',
      object.div.width,
      'to',
      object.div.width * factor,
    );
    object.div.size(object.div.width * factor, object.div.height * factor);
    adjustPositionAfterResize(object);
    object.xspeed *= p5Instance.random() < 0.5 ? -1 : 1;
    object.yspeed *= p5Instance.random() < 0.5 ? -1 : 1;
  }
};

const isColliding = (
  a: ObjectType | RectangleType,
  b: ObjectType | RectangleType,
) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

const handleCollision = (a: ObjectType, b: ObjectType | RectangleType) => {
  const overlapX =
    a.w / 2 + b.w / 2 - Math.abs(a.x + a.w / 2 - (b.x + b.w / 2));
  const overlapY =
    a.h / 2 + b.h / 2 - Math.abs(a.y + a.h / 2 - (b.y + b.h / 2));

  const bounceFactor = 1.1;
  const shiftX = (overlapX / 2) * bounceFactor;
  const shiftY = (overlapY / 2) * bounceFactor;

  if (overlapX > overlapY) {
    if (a.y + a.h / 2 < b.y + b.h / 2) {
      a.y -= shiftY;
      if ('yspeed' in b) {
        b.y += shiftY;
      }
    } else {
      a.y += shiftY;
      if ('yspeed' in b) {
        b.y -= shiftY;
      }
    }

    a.yspeed *= -1;
    if ('yspeed' in b) {
      b.yspeed *= -1;
    }
  } else {
    if (a.x + a.w / 2 < b.x + b.w / 2) {
      a.x -= shiftX;
      if ('xspeed' in b) {
        b.x += shiftX;
      }
    } else {
      a.x += shiftX;
      if ('xspeed' in b) {
        b.x -= shiftX;
      }
    }

    a.xspeed *= -1;
    if ('xspeed' in b) {
      b.xspeed *= -1;
    }
  }
};

type Props = {
  readonly showCenterArea: boolean;
  readonly onAfterP5Setup: () => void;
};

export const BouncingItemsBackground = forwardRef<
  BouncingItemsBackgroundInstance,
  Props
>((props, ref) => {
  const {showCenterArea, onAfterP5Setup} = props;

  useImperativeHandle(ref, () => ({
    getP5Instance: () => p5Instance,
    getObjects: () => objects,
    createNewObject(div) {
      const {x, y} = findNonCollidingPosition(div.width, div.height);
      const xspeed = Number(p5Instance.random() < 0.5 ? -1 : 1);
      const yspeed = Number(p5Instance.random() < 0.5 ? -1 : 1);

      const object: ObjectType = {
        id: div.id(),
        x,
        y,
        w: div.width,
        h: div.height,
        xspeed,
        yspeed,
        div,
      };

      objects.push(object);
    },
    resizeObjectById(id) {
      const object = objects.find((o) => o.id === id);
      if (!object) {
        return;
      }

      if (object.div.width < 150) {
        object.div.size(object.div.width * 1.05, object.div.height * 1.05);
      }

      adjustPositionAfterResize(object);
      object.xspeed *= p5Instance.random() < 0.5 ? -1 : 1;
      object.yspeed *= p5Instance.random() < 0.5 ? -1 : 1;
      resizes += 1;
      if (resizes === 50) {
        resizeAllObjects(0.9);
      }

      if (resizes === 100) {
        resizeAllObjects(0.9);
      }

      if (resizes === 150) {
        resizeAllObjects(0.9);
      }

      if (resizes === 200) {
        resizeAllObjects(0.9);
      }

      if (resizes === 250) {
        resizeAllObjects(0.9);
      }

      if (resizes === 300) {
        resizeAllObjects(0.9);
      }

      if (resizes === 350) {
        resizeAllObjects(0.9);
      }

      if (resizes === 400) {
        resizeAllObjects(0.9);
      }

      if (resizes === 450) {
        resizeAllObjects(0.9);
      }

      if (resizes === 500) {
        resizeAllObjects(0.9);
      }
    },
    removeObject(id) {
      const objectToRemove = objects.find((o) => o.id === id);
      objectToRemove?.div.remove();
      objects = objects.filter((o) => o.id !== id);
    },
  }));

  useLegacyEffect(() => {
    const pollForP5 = setInterval(async () => {
      if (p5Instance) {
        clearInterval(pollForP5);
        onAfterP5Setup?.();
      }
    }, 50);
    return () => {
      clearInterval(pollForP5);
    };
  }, []);

  return <NextReactP5Wrapper sketch={sketch} showCenterArea={showCenterArea} />;
});

BouncingItemsBackground.displayName = 'BouncingItemsBackground';

export default BouncingItemsBackground;
