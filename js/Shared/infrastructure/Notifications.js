export const Notifications = {
  error: (message) => {
    $.notify(
      {
        icon: "nc-icon nc-bell-55",
        message,
      },
      {
        type: "danger",
        timer: 4000,
      }
    );
  },
  info: (message) => {
    $.notify(
      {
        icon: "nc-icon nc-bell-55",
        message,
      },
      {
        type: "info",
        timer: 2500,
      }
    );
  },
  success: (message) => {
    $.notify(
      {
        icon: "nc-icon nc-bell-55",
        message,
      },
      {
        type: "success",
        timer: 2500,
      }
    );
  },
};

export const verifyFields = (...fields) => {
  const invalidField = fields.find(
    (field) => field.value == undefined || field.value == ""
  );
  if (invalidField) {
    return {
      message:
        invalidField.message ||
        `Campo <b>${invalidField.name}</b> es requerido`,
    };
  }
  return undefined;
};
