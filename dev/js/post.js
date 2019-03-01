/* eslint-disable no-undef */

$(function() { 

  function removeErrors() {
    console.log('ggg');
    $('.add-post p.error').remove();
    $('#post-title, #post-body').removeClass('error');
  };

  var editor = new MediumEditor('#post-body', {
    placeholder: {
      text: '',
      hideOnClick: true
    }
  });

  // clear input forms
  $('.add-post input, #post-body').on('focus', removeErrors);

  $('.publish-button').on('click', function(e)  {
    e.preventDefault();

    $('#post-body').val('');

    removeErrors();

    var postData = {
      title: $('#post-title').val(),
      body: $('#post-body').html() //because we wanna take data from div, html() can do it, but val() cant/
    };
    console.log(postData);

    $.ajax({
      type: 'POST',
      data: JSON.stringify(postData),
      contentType: 'application/json',
      url: '/post/add',
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
        console.log('good');
      }
     });

  });
});