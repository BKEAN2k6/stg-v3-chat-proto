import React, {forwardRef, useEffect} from 'react';
import p5 from 'p5';

type ObjectType = {
  x: number;
  y: number;
  w: number;
  h: number;
  xspeed: number;
  yspeed: number;
  div: p5.Element;
};

type RectangleType = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type P5WrapperInstance = {
  createNewObject: () => void;
};

export const P5Wrapper = forwardRef<P5WrapperInstance>(() => {
  const sketch = (p: p5) => {
    const objects: ObjectType[] = [];
    const showCenterArea = true;

    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      canvas.parent('canvasContainer');

      for (let i = 0; i < 5; i++) {
        createNewObject();
      }
    };

    const createNewObject = () => {
      const x = p.random(p.width / 4, (3 * p.width) / 4);
      const y = p.random(p.height / 4, (3 * p.height) / 4);
      const w = p.random(40, 80);
      const h = p.random(30, 60);
      const xspeed = Number(p.random() < 0.5 ? -1 : 1);
      const yspeed = Number(p.random() < 0.5 ? -1 : 1);

      const div = p.createDiv(`Object ${objects.length + 1}`);
      div.size(w, h);
      div.position(x, y);
      div.style(
        'background-color',
        p.color(p.random(100, 256), p.random(100, 256), p.random(100, 256)),
      );

      const object: ObjectType = {x, y, w, h, xspeed, yspeed, div};

      div.style('color', p.color(0, 0, 0));
      div.style('text-align', 'center');
      div.mousePressed(() => {
        div.size(div.width * 1.1, div.height * 1.1);
        adjustPositionAfterResize(object);
        object.xspeed *= p.random() < 0.5 ? -1 : 1;
        object.yspeed *= p.random() < 0.5 ? -1 : 1;
      });

      objects.push(object);
    };

    const adjustPositionAfterResize = (object: ObjectType) => {
      for (const other of objects) {
        if (object !== other && isColliding(object, other)) {
          handleCollision(object, other);
        }
      }

      if (object.x + object.w > p.width) {
        object.x = p.width - object.w;
      }

      if (object.x < 0) {
        object.x = 0;
      }

      if (object.y + object.h > p.height) {
        object.y = p.height - object.h;
      }

      if (object.y < 0) {
        object.y = 0;
      }

      if (
        showCenterArea &&
        isColliding(object, {
          x: p.width / 4,
          y: p.height / 4,
          w: p.width / 2,
          h: p.height / 2,
        } as RectangleType)
      ) {
        handleCollision(object, {
          x: p.width / 4,
          y: p.height / 4,
          w: p.width / 2,
          h: p.height / 2,
        } as RectangleType);
      }
    };

    const isColliding = (
      a: ObjectType | RectangleType,
      b: ObjectType | RectangleType,
    ) =>
      a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

    const handleCollision = (a: ObjectType, b: ObjectType | RectangleType) => {
      const overlapX =
        a.w / 2 + b.w / 2 - Math.abs(a.x + a.w / 2 - (b.x + b.w / 2));
      const overlapY =
        a.h / 2 + b.h / 2 - Math.abs(a.y + a.h / 2 - (b.y + b.h / 2));

      const shiftX = overlapX / 2;
      const shiftY = overlapY / 2;

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

    p.draw = () => {
      p.background(0);

      if (showCenterArea) {
        p.fill(100, 100, 200, 150);
        p.rect(p.width / 4, p.height / 4, p.width / 2, p.height / 2);
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

        if (object.x + object.w >= p.width || object.x <= 0) {
          object.xspeed *= -1;
          object.x = p.constrain(object.x, 0, p.width - object.w);
        }

        if (object.y + object.h >= p.height || object.y <= 0) {
          object.yspeed *= -1;
          object.y = p.constrain(object.y, 0, p.height - object.h);
        }

        if (
          showCenterArea &&
          isColliding(object, {
            x: p.width / 4,
            y: p.height / 4,
            w: p.width / 2,
            h: p.height / 2,
          } as RectangleType)
        ) {
          handleCollision(object, {
            x: p.width / 4,
            y: p.height / 4,
            w: p.width / 2,
            h: p.height / 2,
          } as RectangleType);
        }
      }
    };
  };

  useEffect(() => {
    // eslint-disable-next-line new-cap
    const myP5 = new p5(sketch);

    return () => {
      myP5.remove();
    };
  }, []);

  return <div id="canvasContainer" style={{position: 'relative'}} />;
});

P5Wrapper.displayName = 'P5Wrapper';
