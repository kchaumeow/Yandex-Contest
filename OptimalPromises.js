const example1 = [
  {
    id: "A",
    priority: 1,
    render: () =>
      Promise.resolve([
        {
          id: "A.1",
          priority: 2,
          render: () =>
            Promise.resolve([
              {
                id: "A.1.1",
                priority: 2,
                render: () => Promise.resolve(null),
              },
            ]),
        },
      ]),
  },
  {
    id: "B",
    priority: 2,
    render: () =>
      Promise.resolve([
        {
          id: "B.1",
          priority: 3,
          render: () => Promise.resolve(null),
        },
        {
          id: "B.2",
          priority: 3,
          render: () => Promise.resolve(null),
        },
        {
          id: "B.3",
          priority: 3,
          render: () => Promise.resolve(null),
        },
        {
          id: "B.4",
          priority: 1,
          render: () => Promise.resolve(null),
        },
        {
          id: "B.5",
          priority: 1,
          render: () => Promise.resolve(null),
        },
        {
          id: "B.6",
          priority: 1,
          render: () => Promise.resolve(null),
        },
      ]),
  },
];
async function renderAsync(renderItems, n) {
  let idArray = [];
  while (renderItems.length > 0) {
    renderItems.sort((a, b) => b.priority - a.priority);
    let children = await renderNItems();
    for (child of children) {
      renderItems = child != null ? renderItems.concat(child) : renderItems;
    }
  }
  async function renderNItems() {
    let array = [];
    const size = Math.min(n, renderItems.length);
    for (let i = 0; i < size; i++) {
      const item = renderItems[i];
      array.push(
        renderItems[i].render().then((children) => {
          idArray.push(item.id);
          return children;
        })
      );
    }
    renderItems.splice(0, size);
    return Promise.all(array);
  }
  return idArray;
}
module.exports = renderAsync;


renderAsync(example1, 5).then((res)=>{
  console.log(res);
});
