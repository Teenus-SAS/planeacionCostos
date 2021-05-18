export class Notifications {
  error(message) {
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
  }
}

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
