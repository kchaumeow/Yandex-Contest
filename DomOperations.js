function solution(entryPoint) {
  const operations = {
    copy(element, n) {
      element.removeAttribute("x-make");
      for (let i = 1; i <= n; i++) {
        let copy = element.cloneNode(true);
        element.after(copy);
      }
    },

    remove(element, n) {
      element.removeAttribute("x-make");
      let temp;
      for (let i = 0; i < n; i++) {
        temp = element.nextElementSibling;
        if (!temp) break;
        temp.remove();
      }
    },

    removeChildren(element, n) {
      element.removeAttribute("x-make");
      let temp;
      for (let i = 0; i < n; i++) {
        temp = element.firstElementChild;
        if (!temp) break;
        temp.remove();
      }
    },

    switcher(element, n, positionOfElement2) {
      element.removeAttribute("x-make");
      if (!element.parentNode) return;
      const length = element.parentNode.children.length;
      n = (n + positionOfElement2) % length;
      let rEl = Array.from(element.parentNode.children)[n];
      let elCopy = element.cloneNode(true);
      let rElCopy = rEl.cloneNode(true);
      element.replaceWith(rElCopy);
      rEl.replaceWith(elCopy);
    },
  };

  function getOperation(element) {
    const operation = element.getAttribute("x-make");
    if (!operation) return [undefined, undefined];
    const separatorIndex = operation.indexOf(":");
    const method = operation.slice(0, separatorIndex);
    const n = operation.slice(separatorIndex + 1);
    return [method, parseInt(n)];
  }

  function runSwitch(children) {
    for (let i = 0; i < children.length; i++) {
      const [operation, n] = getOperation(children[i]);
      if (operation === "switch") {
        operations.switcher(children[i], n, i);
        return true;
      }
    }
    return false;
  }

  function checkLevel(element) {
    let children = Array.from(element.children);
    children.forEach((element) => {
      const [operation, n] = getOperation(element);
      if (operation === "copy") operations.copy(element, n);
    });
    children = Array.from(element.children);
    children.forEach((element) => {
      const [operation, n] = getOperation(element);
      if (operation === "remove") operations.remove(element, n);
    });
    children = Array.from(element.children);
    children.forEach((element) => {
      const [operation, n] = getOperation(element);
      if (operation === "removeChildren") operations.removeChildren(element, n);
    });
    children = Array.from(element.children);
    while (runSwitch(children)) {
      children = Array.from(element.children);
    }
    children.forEach((element) => checkLevel(element));
  }
  checkLevel(entryPoint);
}
solution(document.querySelector("entry"));
