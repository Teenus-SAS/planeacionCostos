$("#sidebar-btn-hide").on("click", function () {
  $(".sidebar").toggleClass("hideSidebar-sidebar");
  $(".main-panel").toggleClass("hideSidebar-body");
  $("#sidebar-btn-hide").toggleClass("hideSidebar-btn");
});
