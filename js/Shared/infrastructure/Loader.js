export const Loader = {
  show: () => {
    $("#spinnerAjax").removeClass("fade");
  },
  hide: () => {
    $("#spinnerAjax").addClass("fade");
  },
};
