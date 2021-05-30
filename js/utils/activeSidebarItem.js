const allItemsIds = [
  "sidebar-parametrizar-item",
  "sidebar-reportes-item",
  "sidebar-analisis-item",
  "sidebar-costear-item",
];

export function activeSidebarItem(id) {
  $(`#${id}`).addClass("active");
  const restItems = allItemsIds.filter((itemid) => itemid != id);
  restItems.forEach((itemId) => {
    $(`#${itemId}`).removeClass("active");
  });
}
