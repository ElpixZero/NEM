/* eslint-disable no-undef */

$(function() {
  var commentForm;
  var parentId;

  $('#new, #reply').on('click', function(e) {
    e.preventDefault();

    if (commentForm) {
      commentForm.remove();
    }
    
    parentId = null;

    commentForm = $('form.comment').clone(true, true);

    if ($(this).attr('id') === 'new') {
      commentForm.appendTo('.comment-list');
    } else {
      var parentComment = $(this).parent();
      parentId = parentComment.attr('id');
      $(this).after(commentForm);
    }

    commentForm.css({display: 'flex'});
  });

  $('form.comment .buttons .cansel ').on('click', function(e) {
    e.preventDefault();
    commentForm.remove();
  });

  $('form.comment .send').on('click', function(e) {
    e.preventDefault();

    var data = {
      post: $('.comments').attr('id'),
      body: commentForm.find('textarea').val(),
      parent: parentId
    };

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/comment/add',
    }).done(function(response) {
      if (response.ok) {
        $(location).attr('href', '/');
      }
    });
  });
});