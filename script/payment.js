 function validateRegistrationForm() {
  let isValid = true;

  // Validate common fields
  $(".validate").each(function () {
    const $field = $(this);
    const $error = $field.siblings(".error-message");
    if (!$field.val().trim()) {
      $field.addClass("input-error");
      $error.text("This field is required").show();
      isValid = false;
    } else {
      $field.removeClass("input-error");
      $error.hide();
    }
  });

  // Validate presenter-specific fields only if presenter is selected
  if ($("#attendentType").val() === "presenter") {
    $(".presenter-validate").each(function () {
      const $field = $(this);
      const $error = $field.siblings(".error-message");
      if (!$field.val().trim()) {
        $field.addClass("input-error");
        $error.text("This field is required").show();
        isValid = false;
      } else {
        $field.removeClass("input-error");
        $error.hide();
      }
    });

    // File validation for PDF
    const fileInput = $("input[name='abstract_pdf']")[0];
    if (fileInput && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      if (file.type !== "application/pdf") {
        $(fileInput).addClass("input-error");
        $(fileInput)
          .siblings(".error-message")
          .text("Only PDF files allowed")
          .show();
        isValid = false;
      }
    }
  }

  return isValid;
}

$(document).ready(function () {
  $(".pay-btn").on("click", function () {
    if (!validateRegistrationForm()) return;

    const options = {
      key: "rzp_test_SpVAPuZp9HlFTG", // Enter the Key ID generated from the Dashboard
      amount: 1000, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      name: "Conference",
      description: "Payment of Participant",
      image: "../assets/dau-logo.jpg",
      handler: function (response) {
        console.log(response);
        var paymentId = response.razorpay_payment_id;

        $("#presenterForm").append(
          '<input type="hidden" name="paymentId" value="' + paymentId + '">'
        );
        $("#presenterForm").submit();
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzp1 = new Razorpay(options);

    // console.log(options)
    rzp1.open();
  });
});
