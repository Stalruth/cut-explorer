const layers = [];

function onBeforeNavigate(navigation) {
  if(!navigation.to) {
    return;
  }

  const srcPath = navigation.from.url.pathname;
  const dstPath = navigation.to.url.pathname;

  const goingBack = dstPath === layers[layers.length - 1];
  const goingUp = srcPath.startsWith(dstPath)
  if(goingBack && goingUp) {
    layers.pop();
  } else {
    layers.push(srcPath);
  }
}

function onClickBack(e) {
  const url = new URL(e.target.href);
  if (url.pathname === layers[layers.length - 1]) {
    e.preventDefault();
    history.back();
  }
}

export { onBeforeNavigate, onClickBack }

