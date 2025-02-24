$(document).ready(function () {
  loadFromLocalStorage()
  dropAndDown();


  $("#theme-icon").click(function () {
    let toggleIcon = $("body").toggleClass("dark-theme");
    if (toggleIcon.hasClass("dark-theme")) {
      $("#theme-icon").attr("src", "sun.png");
    } else {
      $("#theme-icon").attr("src", "moon.png");
    }

  });

  $(".add-note").click(() => {
    $(".note-container").css("visibility", "visible");

    $("#title").val("");
    $("#note").val("");
    $(".save-note").removeData("editMode");
    $(".save-note").removeData("currentNote");
  });

  $(".cancel").click(() => {
    $(".note-container").css("visibility", "hidden");
  });

 

  $(".save-note").click(() => {
    let titlevalue = $("#title").val().trim();
    let notevalue = $("#note").val().trim();
    if (titlevalue === "" || notevalue === "") {
      alert("Title and Note cannot be empty!");
      return;
    }
    let isEditMode = $(".save-note").data("editMode");
    let currentNote = $(".save-note").data("currentNote");

    if (isEditMode && currentNote) {
      currentNote.find(".note-title").text($("#title").val().trim());
      currentNote.find(".note-content").text($("#note").val().trim());

      saveToLocalStorage();
    } else {
      addToNotes(titlevalue, notevalue);
      saveToLocalStorage();
    }

    $(".note-container").css("visibility", "hidden");
  });
  
  function saveToLocalStorage() {
    let notes = [];
    $(".note").each(function(){
      notes.push({
        title: $(this).find(".note-title").text(),
        note: $(this).find(".note-content").text()
      });
    });

      if (notes.length===0) {
        localStorage.removeItem("notes")
      } else {
        localStorage.setItem("notes",JSON.stringify("notes"))
      }
  }

  function loadFromLocalStorage(){
    let savedata=localStorage.getItem("notes");
    let notes=savedata ? JSON.parse("notes"):[];

    notes.forEach(function(data){
      addToNotes(data.title,data.note);
    })
  }


 
  function addToNotes(title, note) {
    $("#note-list").append(  `
       <li class="note">
            <div >
                <div class="inside-note">
                  <strong class="note-title">${title}</strong>
                  <p class="note-content">${note}</p>
                </div>
                <div class="list-item-buttons ">
                    <button class="edit"><i class="fa-solid fa-pencil"></i></button>
                    <button class="delete" ><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>

        </li>
            `
    );
  }

  $(document).on("click", ".delete", function () {
    $(this).parents(".note").remove();
    saveToLocalStorage();
  });

  $(document).on("click", ".edit", function () {
    let currentNote = $(this).closest(".note");
    let originalTitle = currentNote.find(".note-title").text();
    let originalContent = currentNote.find(".note-content").text();

    $("#title").val(originalTitle);
    $("#note").val(originalContent);

    $(".note-container").css("visibility", "visible");
    $(".save-note").data("editMode", true);
    $(".save-note").data("currentNote", currentNote);
    saveToLocalStorage();
  });

  function dropAndDown() {
    $("#note-list").sortable();
    saveToLocalStorage();
  }

  $("#search-bar").on("input", function () {
    let searchValue = $(this).val().toLowerCase().trim();

    $(".note").each(function () {
      let title = $(this).find(".note-title").text().toLowerCase();
      let content = $(this).find(".note-content").text().toLowerCase();

      if (title.includes(searchValue) || content.includes(searchValue)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });
});
