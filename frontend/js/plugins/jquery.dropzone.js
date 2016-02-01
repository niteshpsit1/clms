function initDropzone() {
  // Get the template HTML and remove it from the doument
  var previewNode = $("#dropZoneTemplate")[0];
  var previewTemplate = previewNode.parentNode.innerHTML;
  previewNode.parentNode.removeChild(previewNode);

  $("#actions").hide();

  var user = JSON.parse(sessionStorage.getItem('user'));

  var fileDropzone = new Dropzone("#fileDropzone", { // Make the span element "fileDropzone" our dropzone
    url: "/api/documents", // Set the url
    maxFiles: null,
    paramName: "file",
    parallelUploads: 20,
    maxFilesize: 10*1024, // MB
    previewTemplate: previewTemplate,
    headers: {'x-access-token': user.token},
    autoQueue: false, // Make sure the files aren't queued until manually added
    previewsContainer: "#previews", // Define the container to display the previews
    uploadMultiple: false
  });

  // Hookup the add file button
  fileDropzone.on("addedfile", function(file) {
    $("#actions").show();
    //$(".start").onclick = function() { fileDropzone.enqueueFile(file); };
  });

  // Update the total progress bar
  fileDropzone.on("totaluploadprogress", function(progress) {
    $("#total-progress .progress-bar").css("width", "progress"+"%");
  });

  fileDropzone.on("sending", function(file, xhr, data) {

    // Append additional parameters
    // NOTE: documenttype_id is set to test value 1
    data.append("documenttype_id", 1);
    data.append("entity_id", Entities.getSelected().ID);

    // Show the total progress bar when upload starts
    $("#total-progress").show();
    // And disable the start button
    $("#actions .start").attr("disabled", true);
    $("#actions .cancel").attr("disabled", false);
    $("#actions .delete").attr("disabled", true);
  });


  fileDropzone.on("success", function(file, response) {
    $(file.previewElement).find('.dz-status').html("✔");
    setTimeout(function () {
      $(Documents).trigger("refresh");
      $("#actions .start").attr("disabled", false);
      $("#actions .cancel").attr("disabled", true);
      $("#actions .delete").attr("disabled", false);
      $("#total-progress").hide();
    }, 1250);
  });

  fileDropzone.on("error", function(file, response) {
    $(file.previewElement).find('.dz-status').html("✘");
    $("#actions .start").attr("disabled", false);
    $("#actions .cancel").attr("disabled", true);
    $("#actions .delete").attr("disabled", false);
    $("#total-progress").hide();
  });



  // Setup the buttons for all transfers
  $("#actions .start").click( function() {
    fileDropzone.enqueueFiles(fileDropzone.getFilesWithStatus(Dropzone.ADDED));
  });

  $("#actions .cancel").click( function() {
    $("#actions .start").attr("disabled", false);
    $("#actions .cancel").attr("disabled", true);
    $("#actions .delete").attr("disabled", false);
    fileDropzone.removeAllFiles(true);
  });

  $("#actions .delete").click( function() {
    fileDropzone.removeAllFiles();
    $("#actions").hide();
  });

}