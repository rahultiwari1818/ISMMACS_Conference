$(document).ready(function () {
  $("#attendentType").on("change", function () {
    if ($(this).val() === "presenter") {
      $(".presenter-fields").slideDown();
    } else {
      $(".presenter-fields").slideUp();
    }
    console.log("object");
  });

  $("#attendentType").on("change", function () {
    const selected = $(this).val();
    if (selected === "presenter") {
      $(".presenter-fields").slideDown();
    } else {
      $(".presenter-fields").slideUp();
      $(".presenter-fields input, .presenter-fields select").removeClass(
        "input-error"
      );
      $(".presenter-fields .error-message").hide();
    }
  });


});

