const stopPropagationHandler = (event: React.SyntheticEvent): void => {
  event.stopPropagation();
};

const stopPropagationHandlers = {
  onPointerDown: stopPropagationHandler,
  onPointerMove: stopPropagationHandler,
  onPointerUp: stopPropagationHandler,
  onPointerCancel: stopPropagationHandler,
  onDragStart: stopPropagationHandler,
};

export default stopPropagationHandlers;
