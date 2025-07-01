$(document).ready(function () {
  $("#attendentType").change(function () {
    $("#attendentTypeForm").submit();
  });

  //   --------------------------------------- About Section data fetching -----------------------------------------------
  // <h2 class="workshop-title text-center mb-4">${data.title}</h2>
  $.getJSON("./data/about_workshop.json", function (data) {
    const content = `
    <div class="about-workshop-content p-4">
      <p class="workshop-description mb-4">
        ${data.description.replace(/\n/g, "<br><br>")}
      </p>

      <h4 class="workshop-title mt-4">Highlights of the Conference:</h4>
      <ul class="highlight-list mb-4">
        ${data.highlights
          .map((point) => `<li class="highlight-item"> ${point}</li>`)
          .join("")}
      </ul>

      
    </div>`;
    $("#about-workshop-section").html(content);
  });

  // -------------------------------------------------- COnference Theme Section -------------------------------------------------------

  $.getJSON("./data/conference_theme.json", function (data) {
    // Workshop Theme
    let workshopHTML = `<h3>${data.workshopTheme.title}</h3>`;
    workshopHTML += `<p>${data.workshopTheme.description}</p><ul>`;
    data.workshopTheme.topics.forEach((topic) => {
      workshopHTML += `<li>${topic}</li>`;
    });
    workshopHTML += `</ul>`;
    $("#workshop-theme").html(workshopHTML);

    // Conference Theme
    let conferenceHTML = `<h3>${data.conferenceThemes.title}</h3><ul>`;
    conferenceHTML += `<p>${data.conferenceThemes.description}</p><ul>`;

    data.conferenceThemes.topics.forEach((topic) => {
      conferenceHTML += `<li>${topic}</li>`;
    });
    conferenceHTML += `</ul>`;
    $("#conference-theme").html(conferenceHTML);

    // Highlights Section (optional - if you have a container like #highlights)
    if (data.highlights) {
      let highlightsHTML = `<h3>${data.highlights.title}</h3><ul>`;
      data.highlights.points.forEach((point) => {
        highlightsHTML += `<li>${point}</li>`;
      });
      highlightsHTML += `</ul><p>${data.highlights.summary}</p>`;
      $("#highlights").html(highlightsHTML);
    }
  });

  // ---------------------------------------------------- Important Dates Section -----------------------------------------------------

  $.getJSON("./data/important_dates.json", function (data) {
    const content = `
        <div class="important-dates-content p-4">
          <h2 class="dates-title text-center mb-4">${data.title}</h2>
          <ul class="dates-list list-group list-group-flush">
            ${data.dates
              .map(
                (item) => `
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span class="event-name">${item.event}</span>
                <span class="event-date">${item.date}</span>
              </li>`
              )
              .join("")}
          </ul>
        </div>`;
    $("#important-dates-section .shadow-lg").html(content);
  });

  //   -------------------------------------------------- Workshop Schedule Section ----------------------------------------------------------------------------

  // $.getJSON("./data/workshop_schedule.json", function (data) {
  //   let scheduleHTML = "";
  //   data.schedule.forEach((dayObj, index) => {
  //     scheduleHTML += `
  //         <div class="col-md-6">
  //           <div class="schedule-card p-3 h-100">
  //             <h5 class="schedule-day mb-3">${dayObj.day}</h5>
  //             <ul class="list-group list-group-flush">
  //               ${dayObj.sessions
  //                 .map(
  //                   (session) => `
  //                 <li class="list-group-item">
  //                   <strong>${session.time}</strong><br/>
  //                   ${session.topic}
  //                 </li>
  //               `
  //                 )
  //                 .join("")}
  //             </ul>
  //           </div>
  //         </div>
  //       `;
  //   });
  //   $("#schedule-container").html(scheduleHTML);
  // });

  $.getJSON("./data/workshop_schedule.json", function (data) {
    let scheduleHTML = "";

    // Override all schedule data with TBA
    const tbaDays = ["Day 1", "Day 2", "Day 3"];
    tbaDays.forEach((day) => {
      scheduleHTML += `
      <div class="col-md-6">
        <div class="schedule-card p-3 h-100">
          <h5 class="schedule-day mb-3">${day} (To Be Announced)</h5>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              <strong>TBA</strong><br/>
              TBA
            </li>
            <li class="list-group-item">
              <strong>TBA</strong><br/>
              TBA
            </li>
            <li class="list-group-item">
              <strong>TBA</strong><br/>
              TBA
            </li>
          </ul>
        </div>
      </div>
    `;
    });

    $("#schedule-container").html(scheduleHTML);
  });

  // ---------------------------------- Intended Audience Section -------------------------------------------------------

  $.getJSON("./data/intended_audience.json", function (data) {
    $("#audience-title").text(data.title);
    $("#audience-desc").text(data.description);

    let cardsHTML = "";
    data.audience.forEach((person) => {
      cardsHTML += `
      <div class="audience-card">
        <img src="${person.image}" alt="${person.title}" class="audience-icon">
        <h3>${person.title}</h3>
        <p>${person.description}</p>
      </div>
    `;
    });

    $("#audience-cards-container").html(cardsHTML);
  });

  // ------------------------- to Committee Members data ------------------------------------------------------------

  $.getJSON("./data/committee_data.json", function (data) {
    const container = $("#committee-container");

    $.each(data, function (committeeName, members) {
      const section = $('<div class="committee-section col-12"></div>');
      section.append(`<div class="section-title">${committeeName}</div>`);

      const row = $('<div class="row"></div>');

      $.each(members, function (i, member) {
        const card = $(`
            <div class="col-md-4 col-sm-6">
              <div class="custom-card cursor-pointer text-center" 
              onclick="window.location.href='${member.link}'"
              >
                <img src="${member.image}" alt="${member.name}" class="member-img mb-3">
                <h5>${member.name}</h5>
                <p>${member.affiliation}</p>
              </div>
            </div>
          `);
        row.append(card);
      });

      section.append(row);
      container.append(section);
    });
  });

  // ------------------------- to display speakers data ------------------------------------------------------------

  $.getJSON("./data/invited_speaker_data.json", function (data) {
    const container = $("#speakers-container");

    data.speakers.forEach((speaker, index) => {
      const tagClass =
        speaker.speakerType === "fixed" ? "tag-fixed" : "tag-tentative";

      const interests = speaker.researchInterests || [];
      // const interestsPreview = interests
      //   .slice(0, 3)
      //   .map((i) => `<li>${i}</li>`)
      //   .join("");

      // const interestsHidden = interests
      //   .slice(3)
      //   .map((i) => `<li class="hidden-interest hidden-${index}">${i}</li>`)
      //   .join("");

      // const showMoreBtn =
      //   interests.length > 3
      //     ? `<button class="show-more" onclick="event.stopPropagation(); toggleMore(this, ${index})">More</button>`
      //     : "";

      // <ul class="speaker-interests">
      //   ${interestsPreview}
      //   ${interestsHidden}
      // </ul>
      // ${showMoreBtn}

      const card = `
      <div class="speaker-card" data-link="${speaker.link}">
        <img src="${speaker.image}" alt="${speaker.name}" class="speaker-image" />
        <div class="speaker-body">
          <div class="speaker-name">${speaker.name}</div>
          <div class="speaker-affiliation">${speaker.affiliation}</div>
      
          <div class="speaker-tag ${tagClass}">${speaker.speakerType}</div>
        </div>
      </div>
    `;

      container.append(card);
    });
  });

  // ----------------- More btn click ---------------------------------------------------------------------------

  $(document).on("click", ".speaker-card", function () {
    const link = $(this).data("link");
    window.open(link, "_blank"); // open in new tab
  });

  //   --------------------------------------- Registration Notes Data fetch ------------------------------------------------------------

  $.getJSON("./data/registration_fees_and_notes.json", function (data) {
    function renderDetailedFeeTable(targetId, feeData) {
      let html = "";

      // Loop over INDIAN and NRI separately
      Object.keys(feeData).forEach((nationality) => {
        html += `<h5>${nationality}</h5>`;

        const membershipGroups = feeData[nationality];

        Object.keys(membershipGroups).forEach((membershipType) => {
          html += `<h6>${membershipType}</h6>`;
          html += `<table class="custom-table"><thead><tr><th>Category</th><th>Fee</th></tr></thead><tbody>`;

          const categoryFees = membershipGroups[membershipType];
          Object.keys(categoryFees).forEach((category) => {
            html += `<tr><td>${category}</td><td>${categoryFees[category]}</td></tr>`;
          });

          html += `</tbody></table>`;
        });
      });

      $(targetId).html(html);
    }

    renderDetailedFeeTable(
      "#conferenceTable",
      data["RegistrationFee (Including 18% GST)"]["Conference"]
    );
    renderDetailedFeeTable(
      "#workshopConfTable",
      data["RegistrationFee (Including 18% GST)"]["Conference and Workshop"]
    );

    // Remove dau and simple notes logic if not needed, or keep if still valid
    if (data["RegistrationFee (Including 18% GST)"]["dau Faculty/Students"]) {
      $("#dauRate").text(
        data["RegistrationFee (Including 18% GST)"]["dau Faculty/Students"]
      );
    }

    if (data.Notes) {
      data.Notes.forEach((note) => {
        $("#notesList").append(`<li>${note}</li>`);
      });
    }

    $(".toggle-btn").click(function () {
      const target = $(this).data("target");
      $(target).toggleClass("hidden");
    });
  });

  //   --------------------------------------------------- Sponsors Data Fetch -------------------------------------------------------------

  $.getJSON("./data/sponsors_data.json", function (response) {
    const sponsors = response.data;
    const container = $("#sponsors-container");

    sponsors.forEach((sponsor) => {
      const sponsorCard = `
          <div class="col-md-4 col-sm-6 text-center mb-4">
            <a href="${sponsor.link}" target="_blank" class="sponsor-card d-block p-3">
              <img src="${sponsor.image}" alt="Sponsor Logo" class="sponsor-img img-fluid">
            </a>
          </div>`;
      container.append(sponsorCard);
    });
  });

  // ------------------------------------------------------------------ Call for Abstract Page --------------------------------------------------------------------------------

  $.getJSON("./data/call_for_abstract.json", function (data) {
    const content = `
    <div class="call-abstract-section">
      <h2 class="call-abstract-title">${data.title}</h2>
      <p class="call-abstract-description">${data.description}</p>

      <h4 class="call-abstract-guidelines-title">Topics include (but not limited to):</h4>
      <ul class="call-abstract-topics">
        ${data.topics.map((topic) => `<li>${topic}</li>`).join("")}
      </ul>

      <h4 class="call-abstract-guidelines-title">${data.guidelinesTitle}</h4>
      <ul class="call-abstract-guidelines">
        ${data.guidelines.map((item) => `<li>${item}</li>`).join("")}
      </ul>

      <p class="call-abstract-closing">${data.closingNote}</p>
    </div>
  `;
    $("#call-for-abstract-container").html(content);
  });

  // ---------------------------------------------------- Call for Abstract Form ---------------------------------------------------------------------------------

  $("input[name='uploadType']").change(function () {
    if (this.value === "text") {
      $("#textContentDiv").removeClass("d-none");
      $("#pdfContentDiv").addClass("d-none");
      $("#abstractFile").val("");
    } else if (this.value === "pdf") {
      $("#pdfContentDiv").removeClass("d-none");
      $("#textContentDiv").addClass("d-none");
      $("#abstractContent").val("");
    }
  });

  $("#previewBtn").click(function () {
    const fullName = $("#fullName").val().trim();
    const title = $("#title").val();
    const position = $("#position").val();
    const affiliation = $("#affiliation").val().trim();
    const abstractTitle = $("#abstractTitle").val().trim();
    const coauthors = $("#coauthors").val().trim();
    const uploadType = $("input[name='uploadType']:checked").val();
    const content = $("#abstractContent").val().trim();
    const file = $("#abstractFile")[0].files[0];

    // Validation
    if (
      !fullName ||
      !title ||
      !position ||
      !affiliation ||
      !abstractTitle ||
      !uploadType
    ) {
      showCustomAlert("Please fill all required fields.", "danger");
      return;
    }

    if (uploadType === "text" && !content) {
      showCustomAlert("Please provide abstract content text.", "danger");
      return;
    }
    if (uploadType === "pdf" && !file) {
      showCustomAlert("Please upload a PDF file.", "danger");
      return;
    }

    let previewHtml = `
      <p><strong>Full Name:</strong> ${fullName}</p>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Position:</strong> ${position}</p>
      <p><strong>Affiliation:</strong> ${affiliation}</p>
      <p><strong>Abstract Title:</strong> ${abstractTitle}</p>
      <p><strong>Co-authors:</strong> ${coauthors || "N/A"}</p>
    `;

    if (uploadType === "text") {
      previewHtml += `<p><strong>Abstract Content:</strong><br>${content}</p>`;
    } else if (uploadType === "pdf") {
      previewHtml += `<p><strong>PDF File:</strong> ${file.name}</p>`;
    }

    $("#previewContent").html(previewHtml);
    $("#previewModal").modal("show");
  });

  $("#confirmSubmit").click(function () {
    $("#previewModal").modal("hide");
    showCustomAlert(
      "Your abstract has been successfully submitted!",
      "success"
    );
    $("#abstractForm")[0].reset();
    $("#textContentDiv, #pdfContentDiv").addClass("d-none");
  });

  function showCustomAlert(message, type = "success") {
    $("#customAlert")
      .removeClass("d-none alert-success alert-danger alert-warning")
      .addClass("alert-" + type)
      .html(message);
    setTimeout(() => {
      $("#customAlert").addClass("d-none");
    }, 4000);
  }



  // ------------------------------------------------------------------------------------- Call for Symposium ----------------------------------------------

  $.getJSON("./data/call_for_symposium.json", function (data) {
  let html = `
    <h2 class="symposium-title mb-3">${data.title}</h2>
    <p class="symposium-intro mb-4">${data.intro}</p>
    <h5 class="symposium-subtitle mb-2">The proposal should include the following information:</h5>
    <ul class="symposium-list">
  `;

  data.requirements.forEach(req => {
    html += `<li><strong>${req.label}:</strong> ${req.description}</li>`;
  });

  html += `</ul><p class="symposium-note mt-3"><strong>Note:</strong> ${data.note}</p>`;

  $("#call-symposium-section").html(html);
});


});

function toggleMore(button, index) {
  $(`.hidden-${index}`).removeClass("hidden-interest");
  $(button).hide();
}
