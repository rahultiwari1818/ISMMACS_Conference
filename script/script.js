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
          .map((point) => `<li class="highlight-item">• ${point}</li>`)
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

$.getJSON('./data/intended_audience.json', function (data) {
  $('#audience-title').text(data.title);
  $('#audience-desc').text(data.description);

  let cardsHTML = '';
  data.audience.forEach(person => {
    cardsHTML += `
      <div class="audience-card">
        <img src="${person.image}" alt="${person.title}" class="audience-icon">
        <h3>${person.title}</h3>
        <p>${person.description}</p>
      </div>
    `;
  });

  $('#audience-cards-container').html(cardsHTML);
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
      const interestsPreview = interests
        .slice(0, 3)
        .map((i) => `<li>${i}</li>`)
        .join("");

      const interestsHidden = interests
        .slice(3)
        .map((i) => `<li class="hidden-interest hidden-${index}">${i}</li>`)
        .join("");

      const showMoreBtn =
        interests.length > 3
          ? `<button class="show-more" onclick="event.stopPropagation(); toggleMore(this, ${index})">More</button>`
          : "";

      const card = `
      <div class="speaker-card" data-link="${speaker.link}">
        <img src="${speaker.image}" alt="${speaker.name}" class="speaker-image" />
        <div class="speaker-body">
          <div class="speaker-name">${speaker.name}</div>
          <div class="speaker-affiliation">${speaker.affiliation}</div>
          <ul class="speaker-interests">
            ${interestsPreview}
            ${interestsHidden}
          </ul>
          ${showMoreBtn}
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
    function renderFeeTable(targetId, feeData) {
      let html = `<table class="custom-table"><thead><tr><th>Category</th><th>Online</th><th>Onsite</th></tr></thead><tbody>`;
      const categories = Object.keys(feeData.Online);
      categories.forEach((cat) => {
        html += `<tr><td>${cat}</td><td>${feeData.Online[cat]}</td><td>${feeData.Onsite[cat]}</td></tr>`;
      });
      html += `</tbody></table>`;
      $(targetId).html(html);
    }

    renderFeeTable(
      "#workshopTable",
      data["RegistrationFee(Including 18% GST)"]["Workshop"]
    );
    renderFeeTable(
      "#conferenceTable",
      data["RegistrationFee(Including 18% GST)"]["Conference"]
    );
    renderFeeTable(
      "#workshopConfTable",
      data["RegistrationFee(Including 18% GST)"]["Workshop + Conference"]
    );

    $("#srmRate").text(
      data["RegistrationFee(Including 18% GST)"]["SRM Faculty/Students"]
    );

    data.Notes.forEach((note) => {
      $("#notesList").append(`<li>${note}</li>`);
    });

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
});

function toggleMore(button, index) {
  $(`.hidden-${index}`).removeClass("hidden-interest");
  $(button).hide();
}
