/* eslint-disable no-undef */

$(function() { 

  function removeErrors() {
    $('.add-post p.error').remove();
    $('#post-title, #post-body').removeClass('error');
  };

  // clear input forms
  $('.add-post input, #post-body').on('focus', removeErrors);

  $('.publish-button').on('click', function(e)  {
    e.preventDefault();

    removeErrors();

    var postData = {
      title: $('#post-title').val(),
      body: $('#post-body').val()
    };

    $.ajax({
      type: 'POST',
      data: JSON.stringify(postData),
      contentType: 'application/json',
      url: '/posts/add',
    }).done(function(data) {

      if (!data.ok) {
        $('.add-post h2').after('<p class="error">' + data.error + '</p>');

        if (data.fields) {
          data.fields.forEach(function(item) {
            console.log('#post-' + item);
           $('#post-' + item).addClass('error');
          });
        } 
      } else {
        $(location).attr('href', '/');
      }
     });
  });

  $('.post .body .mainView').on('click', function(e) {
    e.preventDefault();
    $('.post .body .mainView').removeClass('mainView');
  });

  //upload 
  $('#fileInfo').on('submit', function(e) {
    e.preventDefault();

    var formData = new FormData(this);
    $.ajax({
      type: 'POST',
      url: '/upload/image',
      data: formData,
      processData: false,
      contentType: false,
      success: function(r) {
        console.log(r);
      },
      error: function(e) {
        console.log(e);
      }
    })
  });
});