/* eslint-disable no-undef */

$(function() {
  var commentForm;
  var parentId;

  function showForm(isNew, comment) {
    $('.reply').show();

    if (commentForm) {
      commentForm.remove();
    }
    
    parentId = null;
    commentForm = $('form.comment').clone(true, true);

    if (isNew) {
      commentForm.find('.cancel').hide();
      commentForm.appendTo('.comment-list');
    } else {
      var parentComment = $(comment).parent();
      parentId = parentComment.attr('id');
      $(comment).after(commentForm);
    }

    commentForm.css({display: 'flex'});
  }

  showForm(true);

  $('.reply').on('click', function(e) {
    showForm(false, this);
    $(this).hide();
  });

  $('form.comment .cancel').on('click', function(e) {
    e.preventDefault();
    commentForm.remove();
    showForm(true);
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
      if (!response.ok) {
        if (response.error === undefined) {
          response.error = 'Неизвестная ошибка';
        } 

        $(commentForm).prepend('<p class="error">' + response.error + '</p>');

        if (response.fields) {
          data.fields.forEach(function(item) {
          $('#post-' + item).addClass('error');
          });
        } 
      } else {
        var textOfComment = '<ul id="newComment"><li style="background-color: #ffffe0;" id="'+data.post+'"><div class="head"><a href="/users/'+response.owner+'">'+response.owner+'</a><span class="date">Только что</span></div>'+data.body+'</li></ul>';
        $(commentForm).after(textOfComment);
        
        showForm(true);
      }
    });
  });
});