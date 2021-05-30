const loaderContent = `<i class="fa fa-cog fa-spin fa-3x fa-fw" id="spinnerAjax"></i>`;

export const Loader = {
  addLoader: () => {
    const mainDiv = document.createElement("div");
    mainDiv.id = "loader";
    mainDiv.className = "fade fixed fixed bottom-8 right-8";
    mainDiv.innerHTML = loaderContent;
    document.body.appendChild(mainDiv);
  },
  show: () => {
    $("#loader").removeClass("fade");
  },
  hide: () => {
    $("#loader").addClass("fade");
  },
};
