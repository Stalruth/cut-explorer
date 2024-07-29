const layers = [];

function onBeforeNavigate(navigation) {
  if(!navigation.to) {
    return;
  }
  if(navigation.to.url.pathname === layers[layers.length - 1]) {
    layers.pop();
  } else {
    layers.push(navigation.from.url.pathname);
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

